# Download influencer look portraits from Unsplash (free license)
$looksDir = "C:/Users/Kieran/Projects/shortkey/public/images/looks"
New-Item -ItemType Directory -Force -Path $looksDir | Out-Null

$downloads = @(
  @{
    file = "look-1.jpg"
    url  = "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=500&h=667&fit=crop&auto=format&q=85"
    note = "Glass Skin Glow — dewy editorial portrait (Unsplash: f2ar0ltTvaI)"
  }
  @{
    file = "look-2.jpg"
    url  = "https://images.unsplash.com/photo-1627037118727-cd7095b7ef02?w=500&h=667&fit=crop&auto=format&q=85"
    note = "Soft Latte Makeup — warm natural beauty portrait (Unsplash: EUydTGTCrHo)"
  }
  @{
    file = "look-3.jpg"
    url  = "https://images.unsplash.com/photo-1593260853607-d0e0f639bdab?w=500&h=667&fit=crop&auto=format&q=85"
    note = "Clean Girl Aesthetic — soft natural portrait (Unsplash: uo0nqpI3OGg)"
  }
  @{
    file = "look-4.jpg"
    url  = "https://images.unsplash.com/photo-1575542490596-96f9f4e1d541?w=500&h=667&fit=crop&auto=format&q=85"
    note = "Korean Idol Look — editorial beauty portrait (Unsplash: dIUc4P7HfNQ)"
  }
)

foreach ($item in $downloads) {
  $dest = Join-Path $looksDir $item.file
  Write-Output "Downloading $($item.file) — $($item.note)"
  Invoke-WebRequest -Uri $item.url -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -OutFile $dest -UseBasicParsing
}

Write-Output "Saved $($downloads.Count) look images to $looksDir"
