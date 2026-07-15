# Fix product images: re-download lip/makeup JPEGs and convert PNG misnamed as .jpg
$productsDir = "C:/Users/Kieran/Projects/shortkey/public/images/products"
New-Item -ItemType Directory -Force -Path $productsDir | Out-Null

$oy = "https://use-image.oliveyoung.com"
$q = "?RS=1000X1000&AR=0&QT=85"

# Pout tab + all makeup SKUs (JPEG-only URLs where possible)
$downloads = @(
  @{ file = "sk-m001.jpg"; url = "$oy/images/prd/8809526845148/thumbnail/3034ac07-0c32-4a3f-a29f-98d89ac8255e.jpg$q" }
  @{ file = "sk-m002.jpg"; url = "$oy/images/prd/8809447254609/thumbnail/36c860a0-0979-4b57-b97f-e9a935e5edb8.jpg$q" }
  @{ file = "sk-m003.jpg"; url = "$oy/images/prd/GA250732424/thumbnail/cffd2e1f-7f72-4ecd-92c8-b5822c9a39bc.jpg$q" }
  @{ file = "sk-m004.jpg"; url = "$oy/images/prd/UA69657368/thumbnail/67dfbc99-a287-4b59-af94-f7cd701bfbfa.jpg$q" }
  @{ file = "sk-m005.jpg"; url = "$oy/images/prd/UA69657368/thumbnail/a46fccda-6349-4f6d-93bd-e36f107f13ad.jpg$q" }
  @{ file = "sk-m006.jpg"; url = "$oy/images/prd/UA69657368/thumbnail/bd06782d-8f98-415f-89fb-fcbb970c7a60.jpg$q" }
  @{ file = "sk-m007.jpg"; url = "$oy/images/prd/8800255689959/thumbnail/c51631e6-18a2-4ecb-9bbb-5d8783b7ae12.jpg$q" }
  @{ file = "sk-m008.jpg"; url = "$oy/images/prd/8809937360230/thumbnail/50755e40-5d44-4aa8-a4b4-8a8df2fccbf4.jpg$q" }
  @{ file = "sk-m009.jpg"; url = "$oy/images/prd/temp-2bf0f0db-c4fa-4de6-822c-8d4268cd53aa/thumbnail/954ccbf1-f59c-4608-b472-8ef7a71d796d.jpg$q" }
  @{ file = "sk-m010.jpg"; url = "$oy/images/prd/8800288640286/thumbnail/f05b19a6-15dd-4439-a3b0-a6ab25cfa004.jpg$q" }
  @{ file = "sk-m011.jpg"; url = "$oy/images/prd/GA240825413/thumbnail/a8f13a83-7b8d-4ca1-8ddf-066494f5b87a.jpg$q" }
  @{ file = "sk-m012.jpg"; url = "$oy/images/prd/temp-ae319616-9e89-4551-a478-65b8d3fa1400/thumbnail/3ff4113f-e4f7-4705-a09e-a1d97d16d72c.jpg$q" }
  @{ file = "sk-m013.jpg"; url = "$oy/images/prd/GA250732424/thumbnail/c1a5297b-c037-4af8-a8a9-421cd3faab6f.jpg$q" }
  @{ file = "sk-m014.jpg"; url = "$oy/images/prd/8809820709276/thumbnail/8688c3d8-6ce3-4c18-9c8f-0b956171c715.jpg$q" }
  @{ file = "sk-m015.jpg"; url = "$oy/images/prd/8806109102636/thumbnail/3bb2dfbf-06b7-49a4-a943-da69133106e2.jpg$q" }
  @{ file = "sk-m016.jpg"; url = "$oy/prd/images/GA220113375/thumbnail/4026e276-2893-47f2-95ec-a627426ceaa7.jpg$q" }
  @{ file = "sk-m017.jpg"; url = "$oy/images/prd/8809964171380/thumbnail/b3af5eee-1fe6-4d6b-8364-e6b423614314.jpg$q" }
  @{ file = "sk-m018.jpg"; url = "$oy/images/prd/8800276312836/thumbnail/0a836dcf-0f5d-4ecf-9b73-ca1e02f484a4.jpg$q" }
)

foreach ($item in $downloads) {
  $dest = Join-Path $productsDir $item.file
  Write-Output "Downloading $($item.file)..."
  try {
    Invoke-WebRequest -Uri $item.url -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -OutFile $dest -UseBasicParsing
  } catch {
    Write-Warning "Failed $($item.file): $($_.Exception.Message)"
  }
}

# Convert any PNG content saved as .jpg to real JPEG
Add-Type -AssemblyName System.Drawing
Get-ChildItem (Join-Path $productsDir "sk-m*.jpg") | ForEach-Object {
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
  if ($bytes.Length -ge 4 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50) {
    Write-Output "Converting PNG -> JPEG: $($_.Name)"
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $tmp = "$($_.FullName).tmp.jpg"
    $img.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $img.Dispose()
    Move-Item -Force $tmp $_.FullName
  }
}

Write-Output "Product images ready in $productsDir"
