import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_CSV = join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
  "products_export_1 (1).csv",
);

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      row.push(cell);
      cell = "";
      i += 1;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i += 1;
      continue;
    }
    cell += c;
    i += 1;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function mapCategory(type, tags) {
  const hay = `${type || ""} ${tags || ""}`.toLowerCase();
  if (hay.includes("makeup") || hay.includes("prep & finish") || hay.includes("prep-and-finish")) {
    return "Makeup";
  }
  return "Skin Care";
}

function mapRegion(vendor, tags) {
  const hay = `${vendor || ""} ${tags || ""}`.toLowerCase();
  if (hay.includes("j-beauty") || hay.includes("japan")) return "J-Beauty";
  if (hay.includes("c-beauty") || hay.includes("china")) return "C-Beauty";
  return "K-Beauty";
}

function main() {
  const csvPath = process.argv[2] || DEFAULT_CSV;
  const text = readFileSync(csvPath, "utf8");
  const rows = parseCSV(text);
  const headers = rows[0];
  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));

  const products = new Map();

  for (const r of rows.slice(1)) {
    const handle = (r[idx.Handle] || "").trim();
    if (!handle) continue;

    if (!products.has(handle)) {
      products.set(handle, {
        handle,
        title: "",
        bodyHtml: "",
        vendor: "",
        type: "",
        tags: "",
        status: "active",
        published: true,
        images: [],
        variants: [],
      });
    }

    const p = products.get(handle);
    const title = (r[idx.Title] || "").trim();
    const body = r["Body (HTML)"] != null ? r[idx["Body (HTML)"]] : r[idx["Body (HTML)"]];
    // fix: Body (HTML) key
    const bodyHtml = (r[idx["Body (HTML)"]] || "").trim();
    const vendor = (r[idx.Vendor] || "").trim();
    const type = (r[idx.Type] || "").trim();
    const tags = (r[idx.Tags] || "").trim();
    const published = (r[idx.Published] || "").trim();
    const status = (r[idx.Status] || "").trim();
    const sku = (r[idx["Variant SKU"]] || "").trim();
    const price = (r[idx["Variant Price"]] || "").trim();
    const optionName = (r[idx["Option1 Name"]] || "").trim();
    const optionValue = (r[idx["Option1 Value"]] || "").trim();
    const imageSrc = (r[idx["Image Src"]] || "").trim();
    const imagePos = (r[idx["Image Position"]] || "").trim();
    const shortDesc = (r[idx["Short description (product.metafields.custom.short_description)"]] || "").trim();
    const whyEdit = (r[idx["Why it made the edit (product.metafields.custom.why_it_made_the_edit)"]] || "").trim();
    const howToUse = (r[idx["How to use (product.metafields.custom.how_to_use)"]] || "").trim();
    const bestFor = (r[idx["Best for (product.metafields.custom.best_for)"]] || "").trim();

    if (title) p.title = title;
    if (bodyHtml) p.bodyHtml = bodyHtml;
    if (vendor) p.vendor = vendor;
    if (type) p.type = type;
    if (tags) p.tags = tags;
    if (published) p.published = published.toLowerCase() === "true";
    if (status) p.status = status;
    if (shortDesc) p.shortDescription = shortDesc;
    if (whyEdit) p.whyItMadeTheEdit = whyEdit;
    if (howToUse) p.howToUse = howToUse;
    if (bestFor) p.bestFor = bestFor.split(/\n+/).map((s) => s.trim()).filter(Boolean);

    if (imageSrc && !p.images.some((img) => img.src === imageSrc)) {
      p.images.push({
        src: imageSrc,
        position: Number(imagePos) || p.images.length + 1,
      });
    }

    if (sku) {
      const existing = p.variants.find((v) => v.sku === sku);
      if (!existing) {
        p.variants.push({
          sku,
          priceUsd: Number(price) || 0,
          optionName: optionName || "Option",
          optionValue: optionValue || "Default",
          image: imageSrc || "",
        });
      } else if (imageSrc && !existing.image) {
        existing.image = imageSrc;
      }
    }
  }

  const catalog = [];
  for (const p of products.values()) {
    p.images.sort((a, b) => a.position - b.position);
    const primaryImage = p.images[0]?.src || p.variants[0]?.image || "";
    const primaryVariant = p.variants[0];
    if (!primaryVariant) continue;

    // One shop row per variant (multi-option products become multiple SKUs)
    for (const variant of p.variants) {
      const displayName =
        p.variants.length > 1 && variant.optionValue && variant.optionValue !== "Default"
          ? `${p.title} — ${variant.optionValue}`
          : p.title;

      catalog.push({
        sku: variant.sku,
        handle: p.handle,
        name: displayName,
        title: p.title,
        vendor: p.vendor,
        type: p.type || "Beauty",
        category: mapCategory(p.type, p.tags),
        region: mapRegion(p.vendor, p.tags),
        priceUsd: variant.priceUsd,
        image: variant.image || primaryImage,
        images: p.images.map((img) => img.src),
        tags: p.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        optionName: variant.optionName,
        optionValue: variant.optionValue,
        status: p.status,
        published: p.published,
        description: stripHtml(p.shortDescription || p.bodyHtml),
        bodyHtml: p.bodyHtml,
        whyItMadeTheEdit: p.whyItMadeTheEdit || "",
        howToUse: p.howToUse || "",
        bestFor: p.bestFor || [],
        syncReady: p.status === "active" && p.published !== false,
      });
    }
  }

  catalog.sort((a, b) => a.name.localeCompare(b.name));

  const dataDir = join(root, "data");
  mkdirSync(dataDir, { recursive: true });

  const destCsv = join(dataDir, "shopify-products-export.csv");
  copyFileSync(csvPath, destCsv);

  const jsonPath = join(dataDir, "shopify-catalog.json");
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        source: "shopify-products-export.csv",
        importedAt: new Date().toISOString(),
        productCount: products.size,
        variantCount: catalog.length,
        products: catalog,
      },
      null,
      2,
    ),
  );

  // Generate TypeScript module for the app
  const tsPath = join(root, "src", "content", "shopifyCatalog.ts");
  const ts = `/* Auto-generated from data/shopify-products-export.csv — do not edit by hand.
 * Re-run: npm run import:shopify-csv -- "path/to/export.csv"
 */
import catalogJson from "../../data/shopify-catalog.json";

export type ShopifyCatalogProduct = {
  sku: string;
  handle: string;
  name: string;
  title: string;
  vendor: string;
  type: string;
  category: "Makeup" | "Skin Care";
  region: "K-Beauty" | "J-Beauty" | "C-Beauty" | "Multi";
  priceUsd: number;
  image: string;
  images: string[];
  tags: string[];
  optionName: string;
  optionValue: string;
  status: string;
  published: boolean;
  description: string;
  bodyHtml: string;
  whyItMadeTheEdit: string;
  howToUse: string;
  bestFor: string[];
  syncReady: boolean;
};

export const shopifyCatalog = catalogJson.products as ShopifyCatalogProduct[];

export function getShopifyCatalogProduct(sku: string): ShopifyCatalogProduct | undefined {
  const key = sku.toLowerCase();
  return shopifyCatalog.find((p) => p.sku.toLowerCase() === key || p.handle.toLowerCase() === key);
}

export function getSyncReadyShopifyProducts(): ShopifyCatalogProduct[] {
  return shopifyCatalog.filter((p) => p.syncReady);
}
`;
  writeFileSync(tsPath, ts);

  console.log(`Imported ${products.size} products / ${catalog.length} variants`);
  console.log(`CSV  → ${destCsv}`);
  console.log(`JSON → ${jsonPath}`);
  console.log(`TS   → ${tsPath}`);
  console.log("Vendors:", [...new Set(catalog.map((p) => p.vendor))].join(", "));
}

main();
