/**
 * Sync Shortkey shop catalog → Shopify Admin (draft products).
 *
 * Usage:
 *   npm run sync:shopify           # dry-run (prints + writes sync payload)
 *   npm run sync:shopify -- --push # create draft products when Admin token is set
 *
 * Env required for --push:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_ACCESS_TOKEN
 *   SHOPIFY_API_VERSION (optional, default 2025-01)
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load shop catalog via compiled-friendly JSON export from TS source parse
// Prefer reading the generated list from a small TS-free mirror:
const shopCatalogPath = join(root, "src", "content", "shopCatalog.ts");

function loadSyncReadyFromSource() {
  const fs = require("node:fs");
  const src = fs.readFileSync(shopCatalogPath, "utf8");
  const products = [];
  const blockRe =
    /\{\s*sku:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?type:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?region:\s*"([^"]+)"[\s\S]*?priceUsd:\s*(\d+)[\s\S]*?image:\s*productImg\("([^"]+)"\)[\s\S]*?syncReady:\s*(true|false)/g;
  let match;
  while ((match = blockRe.exec(src))) {
    if (match[8] !== "true") continue;
    products.push({
      sku: match[1],
      name: match[2],
      type: match[3],
      category: match[4],
      region: match[5],
      priceUsd: Number(match[6]),
      imageSku: match[7],
      syncReady: true,
    });
  }
  return products;
}

async function shopifyAdmin(path, method, body) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || "2025-01";
  if (!domain || !token) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN");
  }
  const res = await fetch(`https://${domain}/admin/api/${version}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Shopify ${method} ${path} → ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

function toShopifyDraft(product) {
  const cents = Math.round(product.priceUsd * 100);
  return {
    product: {
      title: product.name,
      body_html: `<p>${product.type} · ${product.region}</p>`,
      vendor: "Shortkey",
      product_type: product.category,
      status: "draft",
      tags: ["shortkey", product.category, product.region, product.sku].join(", "),
      variants: [
        {
          sku: product.sku,
          price: product.priceUsd.toFixed(2),
          inventory_management: null,
          requires_shipping: true,
        },
      ],
      metafields: [
        {
          namespace: "shortkey",
          key: "sku",
          type: "single_line_text_field",
          value: product.sku,
        },
        {
          namespace: "shortkey",
          key: "price_cents",
          type: "number_integer",
          value: String(cents),
        },
      ],
    },
  };
}

async function main() {
  const push = process.argv.includes("--push");
  const products = loadSyncReadyFromSource();

  const payload = {
    generatedAt: new Date().toISOString(),
    count: products.length,
    mode: push ? "push" : "dry-run",
    products,
  };

  const outPath = join(root, "scripts", "shopify-sync-payload.json");
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Sync-ready products: ${products.length}`);
  console.log(`Wrote ${outPath}`);

  if (!push) {
    console.log("\nDry-run only. To create draft products in Shopify:");
    console.log("  1. Set SHOPIFY_STORE_DOMAIN + SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local");
    console.log("  2. npm run sync:shopify -- --push");
    console.log("  3. Copy variant GIDs into src/lib/commerce/sku-map.ts");
    return;
  }

  // Load dotenv-like env from .env.local if present
  try {
    const fs = require("node:fs");
    const envPath = join(root, ".env.local");
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* ignore */
  }

  const mapLines = [];
  for (const product of products) {
    process.stdout.write(`Creating ${product.sku} ${product.name}… `);
    const created = await shopifyAdmin("/products.json", "POST", toShopifyDraft(product));
    const variant = created?.product?.variants?.[0];
    const variantId = variant?.admin_graphql_api_id || (variant?.id ? `gid://shopify/ProductVariant/${variant.id}` : null);
    console.log(variantId || "ok");
    if (variantId) {
      mapLines.push(`  "${product.sku}": { shopifyVariantId: "${variantId}" },`);
    }
  }

  if (mapLines.length) {
    console.log("\nPaste into src/lib/commerce/sku-map.ts:\n");
    console.log("export const skuGatewayMap: Record<string, SkuGatewayMap> = {");
    console.log(mapLines.join("\n"));
    console.log("};");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
