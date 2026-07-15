$src = "C:/Users/Kieran/Projects/shortkey/public/images/hero-silk-banner.png"
$dst = "C:/Users/Kieran/Projects/shortkey/public/images/hero-silk-crop.png"

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height
$cropH = [int]($h * 0.52)
$cropW = [int]($w * 0.62)
$startX = [int]($w * 0.34)

$bmp = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect = New-Object System.Drawing.Rectangle $startX, 0, $cropW, $cropH
$destRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
$g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "cropped ${cropW}x${cropH}"
