# Download all local images for shortkey (products, looks, command cards)
$root = "C:/Users/Kieran/Projects/shortkey/public/images"
$productsDir = Join-Path $root "products"
$looksDir = Join-Path $root "looks"
$commandsDir = Join-Path $root "commands"

foreach ($dir in @($productsDir, $looksDir, $commandsDir)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$oy = "https://use-image.oliveyoung.com"
$q = "?RS=1000X1000&AR=0&QT=85"

$products = @(
  # Legacy skincare SKUs (still on disk for reference)
  @{ file = "sk-b001.jpg"; url = "$oy/images/prd/1343/14665001-d7a1-4c53-b8fb-a073efa332ed.jpg$q" }
  @{ file = "sk-b002.jpg"; url = "$oy/images/prd/8800255689959/thumbnail/c51631e6-18a2-4ecb-9bbb-5d8783b7ae12.jpg$q" }
  @{ file = "sk-b003.jpg"; url = "$oy/images/prd/8800301681418/thumbnail/a0521fce-ea65-4338-8a4c-668b8a3dcac6.jpg$q" }
  @{ file = "sk-h001.jpg"; url = "$oy/images/prd/8800307372853/thumbnail/24b7fae7-be08-4d58-939b-ba4c703e5d31.jpg$q" }
  @{ file = "sk-h002.jpg"; url = "$oy/images/prd/GA250128314/thumbnail/87b41248-c2a5-46e8-a093-5b55340d64d4.jpg$q" }
  @{ file = "sk-h003.jpg"; url = "$oy/images/prd/8809784607243/thumbnail/0c3867ef-7fb4-40d7-a90a-26e0bf152041.jpg$q" }
  @{ file = "sk-g001.jpg"; url = "$oy/images/prd/temp-ae319616-9e89-4551-a478-65b8d3fa1400/thumbnail/3ff4113f-e4f7-4705-a09e-a1d97d16d72c.jpg$q" }
  @{ file = "sk-g002.jpg"; url = "$oy/images/prd/temp-2bf0f0db-c4fa-4de6-822c-8d4268cd53aa/thumbnail/954ccbf1-f59c-4608-b472-8ef7a71d796d.jpg$q" }
  @{ file = "sk-g003.jpg"; url = "$oy/images/prd/8809562192770/thumbnail/0ab0e3cf-3ba6-45e7-b966-566c0b89297c.png$q" }
  @{ file = "sk-z001.jpg"; url = "$oy/images/prd/603084490943/thumbnail/882c3f15-9d7d-4a40-a098-642cfc55eb34.png$q" }
  @{ file = "sk-z002.jpg"; url = "$oy/images/prd/8809447254609/thumbnail/36c860a0-0979-4b57-b97f-e9a935e5edb8.jpg$q" }
  @{ file = "sk-d001.jpg"; url = "$oy/images/prd/8809937360230/thumbnail/50755e40-5d44-4aa8-a4b4-8a8df2fccbf4.jpg$q" }
  @{ file = "sk-d002.jpg"; url = "$oy/prd/images/GA220113375/thumbnail/4026e276-2893-47f2-95ec-a627426ceaa7.jpg$q" }
  @{ file = "sk-d003.jpg"; url = "$oy/prd/images/GA210510558/thumbnail/34deac4e-aca3-43ff-91c9-b5ae6a453e8c.jpg$q" }

  # Makeup Beauty OS — SK-M001 … SK-M018
  @{ file = "sk-m001.jpg"; url = "$oy/images/prd/8809526845148/thumbnail/3034ac07-0c32-4a3f-a29f-98d89ac8255e.jpg$q" }   # Dinto lip veil
  @{ file = "sk-m002.jpg"; url = "$oy/images/prd/8809562192770/thumbnail/0ab0e3cf-3ba6-45e7-b966-566c0b89297c.png$q" }       # Lip oil / plump
  @{ file = "sk-m003.jpg"; url = "$oy/images/prd/8809820709276/thumbnail/53639a6a-da11-4953-af36-0464fc149267.png$q" }       # ETUDE lip tint
  @{ file = "sk-m004.jpg"; url = "$oy/images/prd/UA69657368/thumbnail/67dfbc99-a287-4b59-af94-f7cd701bfbfa.jpg$q" }          # Pen liner
  @{ file = "sk-m005.jpg"; url = "$oy/images/prd/UA69657368/thumbnail/a46fccda-6349-4f6d-93bd-e36f107f13ad.jpg$q" }          # Wing liner
  @{ file = "sk-m006.jpg"; url = "$oy/images/prd/UA69657368/thumbnail/bd06782d-8f98-415f-89fb-fcbb970c7a60.jpg$q" }          # Gel liner
  @{ file = "sk-m007.jpg"; url = "$oy/images/prd/8800255689959/thumbnail/c51631e6-18a2-4ecb-9bbb-5d8783b7ae12.jpg$q" }       # Sculpt palette tones
  @{ file = "sk-m008.jpg"; url = "$oy/images/prd/8809937360230/thumbnail/50755e40-5d44-4aa8-a4b4-8a8df2fccbf4.jpg$q" }       # Contour stick
  @{ file = "sk-m009.jpg"; url = "$oy/images/prd/temp-2bf0f0db-c4fa-4de6-822c-8d4268cd53aa/thumbnail/954ccbf1-f59c-4608-b472-8ef7a71d796d.jpg$q" } # Highlight
  @{ file = "sk-m010.jpg"; url = "$oy/images/prd/8800288640286/thumbnail/f05b19a6-15dd-4439-a3b0-a6ab25cfa004.jpg$q" }       # TIRTIR cushion
  @{ file = "sk-m011.jpg"; url = "$oy/images/prd/GA240825413/thumbnail/a8f13a83-7b8d-4ca1-8ddf-066494f5b87a.jpg$q" }          # TFIT concealer
  @{ file = "sk-m012.jpg"; url = "$oy/images/prd/temp-ae319616-9e89-4551-a478-65b8d3fa1400/thumbnail/3ff4113f-e4f7-4705-a09e-a1d97d16d72c.jpg$q" } # Primer
  @{ file = "sk-m013.jpg"; url = "$oy/images/prd/GA250732424/thumbnail/cffd2e1f-7f72-4ecd-92c8-b5822c9a39bc.jpg$q" }          # Lip-cheek tint
  @{ file = "sk-m014.jpg"; url = "$oy/images/prd/GA250732424/thumbnail/c1a5297b-c037-4af8-a8a9-421cd3faab6f.jpg$q" }          # Water tint
  @{ file = "sk-m015.jpg"; url = "$oy/images/prd/8806109102636/thumbnail/3bb2dfbf-06b7-49a4-a943-da69133106e2.jpg$q" }       # Cream blush
  @{ file = "sk-m016.jpg"; url = "$oy/prd/images/GA220113375/thumbnail/4026e276-2893-47f2-95ec-a627426ceaa7.jpg$q" }          # Setting powder
  @{ file = "sk-m017.jpg"; url = "$oy/images/prd/8809964171380/thumbnail/b3af5eee-1fe6-4d6b-8364-e6b423614314.jpg$q" }     # Setting spray
  @{ file = "sk-m018.jpg"; url = "$oy/images/prd/8800276312836/thumbnail/0a836dcf-0f5d-4ecf-9b73-ca1e02f484a4.png$q" }       # Blur finish cushion
)

$looks = @(
  @{ file = "look-1.jpg"; url = "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=500&h=667&fit=crop&auto=format&q=85" }
  @{ file = "look-2.jpg"; url = "https://images.unsplash.com/photo-1627037118727-cd7095b7ef02?w=500&h=667&fit=crop&auto=format&q=85" }
  @{ file = "look-3.jpg"; url = "https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=500&h=667&fit=crop&auto=format&q=85" }
  @{ file = "look-4.jpg"; url = "https://images.unsplash.com/photo-1575542490596-96f9f4e1d541?w=500&h=667&fit=crop&auto=format&q=85" }
)

$commands = @(
  @{ file = "cmd-tryon.jpg"; url = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format&q=85" }
  @{ file = "cmd-makeover.jpg"; url = "https://images.unsplash.com/photo-1627037118727-cd7095b7ef02?w=600&h=600&fit=crop&auto=format&q=85" }
  @{ file = "cmd-looks.jpg"; url = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop&auto=format&q=85" }
  @{ file = "cmd-videos.jpg"; url = "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop&auto=format&q=85" }
  @{ file = "cmd-shop.jpg"; url = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format&q=85" }
  @{ file = "cmd-brands.jpg"; url = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=600&fit=crop&auto=format&q=85" }
)

function Save-Image($dest, $url) {
  Write-Output "  -> $(Split-Path $dest -Leaf)"
  Invoke-WebRequest -Uri $url -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -OutFile $dest -UseBasicParsing
}

Write-Output "Products ($($products.Count))..."
foreach ($item in $products) {
  Save-Image (Join-Path $productsDir $item.file) $item.url
}

Write-Output "Looks ($($looks.Count))..."
foreach ($item in $looks) {
  Save-Image (Join-Path $looksDir $item.file) $item.url
}

Write-Output "Command cards ($($commands.Count))..."
foreach ($item in $commands) {
  Save-Image (Join-Path $commandsDir $item.file) $item.url
}

Write-Output "Done. Images saved under $root"
