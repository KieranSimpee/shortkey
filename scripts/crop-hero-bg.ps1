$src = "C:/Users/Kieran/Projects/shortkey/public/images/hero-premium.png"
$wide = "C:/Users/Kieran/Projects/shortkey/public/images/hero-bg-wide.png"
$model = "C:/Users/Kieran/Projects/shortkey/public/images/hero-bg-model.png"

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height

function Save-Crop($startXRatio, $cropWRatio, $startYRatio, $cropHRatio, $path) {
  $startX = [int]($w * $startXRatio)
  $cropW = [int]($w * $cropWRatio)
  $startY = [int]($h * $startYRatio)
  $cropH = [int]($h * $cropHRatio)
  $bmp = New-Object System.Drawing.Bitmap $cropW, $cropH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle $startX, $startY, $cropW, $cropH
  $destRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
  $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Output "$path -> ${cropW}x${cropH}"
}

# Model + lavender for full-bleed bg (no bottle, keys, or sidebar mockup)
Save-Crop 0.54 0.26 0.05 0.33 $model

$img.Dispose()
