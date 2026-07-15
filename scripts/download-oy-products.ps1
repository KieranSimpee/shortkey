# Download product hero images from Olive Young CDN (us.oliveyoung.com + global.oliveyoung.com)
$productsDir = "C:/Users/Kieran/Projects/shortkey/public/images/products"
New-Item -ItemType Directory -Force -Path $productsDir | Out-Null

$downloads = @(
  @{ file = "sk-b001.jpg"; url = "https://cdn-image.oliveyoung.com/prdtImg/1343/14665001-d7a1-4c53-b8fb-a073efa332ed.jpg" }
  @{ file = "sk-b002.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8800255689959/thumbnail/c51631e6-18a2-4ecb-9bbb-5d8783b7ae12.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-b003.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8800301681418/thumbnail/a0521fce-ea65-4338-8a4c-668b8a3dcac6.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-h001.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8800307372853/thumbnail/24b7fae7-be08-4d58-939b-ba4c703e5d31.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-h002.jpg"; url = "https://use-image.oliveyoung.com/images/prd/GA250128314/thumbnail/87b41248-c2a5-46e8-a093-5b55340d64d4.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-h003.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8809784607243/thumbnail/0c3867ef-7fb4-40d7-a90a-26e0bf152041.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-g001.jpg"; url = "https://use-image.oliveyoung.com/images/prd/temp-ae319616-9e89-4551-a478-65b8d3fa1400/thumbnail/3ff4113f-e4f7-4705-a09e-a1d97d16d72c.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-g002.jpg"; url = "https://use-image.oliveyoung.com/images/prd/temp-2bf0f0db-c4fa-4de6-822c-8d4268cd53aa/thumbnail/954ccbf1-f59c-4608-b472-8ef7a71d796d.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-g003.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8809562192770/thumbnail/0ab0e3cf-3ba6-45e7-b966-566c0b89297c.png?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-z001.jpg"; url = "https://use-image.oliveyoung.com/images/prd/603084490943/thumbnail/882c3f15-9d7d-4a40-a098-642cfc55eb34.png?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-z002.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8809447254609/thumbnail/36c860a0-0979-4b57-b97f-e9a935e5edb8.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-d001.jpg"; url = "https://use-image.oliveyoung.com/images/prd/8809937360230/thumbnail/50755e40-5d44-4aa8-a4b4-8a8df2fccbf4.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-d002.jpg"; url = "https://use-image.oliveyoung.com/prd/images/GA220113375/thumbnail/4026e276-2893-47f2-95ec-a627426ceaa7.jpg?RS=1000X1000&AR=0&QT=85" }
  @{ file = "sk-d003.jpg"; url = "https://use-image.oliveyoung.com/prd/images/GA210510558/thumbnail/34deac4e-aca3-43ff-91c9-b5ae6a453e8c.jpg?RS=1000X1000&AR=0&QT=85" }
)

foreach ($item in $downloads) {
  $dest = Join-Path $productsDir $item.file
  Write-Output "Downloading $($item.file)..."
  Invoke-WebRequest -Uri $item.url -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -OutFile $dest -UseBasicParsing
}

Write-Output "Saved $($downloads.Count) product images to $productsDir"
