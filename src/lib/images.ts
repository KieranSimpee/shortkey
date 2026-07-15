/** Local command card image — public/images/commands/{id}.jpg */
export function commandImg(id: string) {
  return `/images/commands/${id}.jpg`;
}

/** Local product image — public/images/products/{sku}.jpg */
export function productImg(sku: string) {
  return `/images/products/${sku.toLowerCase()}.jpg`;
}

/** Local influencer look portrait — public/images/looks/{id}.jpg */
export function lookImg(id: string) {
  return `/images/looks/${id}.jpg`;
}
