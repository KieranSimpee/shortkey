$src = "C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo.png"
$tmp = "C:/Users/Kieran/Projects/shortkey/public/images/shortkey-logo-transparent.tmp.png"

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($src)
$w = $img.Width
$h = $img.Height
$out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$out.SetResolution($img.HorizontalResolution, $img.VerticalResolution)

function Is-Background([System.Drawing.Color]$c) {
  return $c.A -gt 0 -and $c.R -ge 248 -and $c.G -ge 248 -and $c.B -ge 248
}

for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $c = $img.GetPixel($x, $y)
    if (Is-Background $c) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
    } else {
      $out.SetPixel($x, $y, $c)
    }
  }
}

$img.Dispose()
$out.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
$out.Dispose()
Move-Item -Force $tmp $src
Write-Output "transparent logo saved ${w}x${h}"
