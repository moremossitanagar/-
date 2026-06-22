Add-Type -AssemblyName System.Drawing

$items = @{
    "beeffriedmomo.png" = "BEEF FRIED MOMO"
    "chickenfriedrice.png" = "CHICKEN FRIED RICE"
    "porkfriedrice.png" = "PORK FRIED RICE"
    "chickenchowmein.png" = "CHICKEN CHOWMEIN"
    "beefchowmein.png" = "BEEF CHOWMEIN"
    "porkchowmein.png" = "PORK CHOWMEIN"
    "ramendry.png" = "RAMEN DRY"
    "chickenthukpa.png" = "CHICKEN THUKPA"
    "porkthukpa.png" = "PORK THUKPA"
    "beefthukpa.png" = "BEEF THUKPA"
    "strawberryshake.png" = "STRAWBERRY SHAKE"
    "mangoshake.png" = "MANGO SHAKE"
    "blueberryshake.png" = "BLUEBERRY SHAKE"
    "frenchfries.png" = "FRENCH FRIES"
    "periperifries.png" = "PERI PERI FRIES"
    "chickenwrap.png" = "CHICKEN WRAP"
    "beefwrap.png" = "BEEF WRAP"
}

foreach ($file in $items.Keys) {
    $text = $items[$file]
    $bmp = New-Object System.Drawing.Bitmap 800, 600
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.Clear([System.Drawing.Color]::White)
    
    $font = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Red)
    
    # Calculate text size to center it better
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, 800, 600)
    $graphics.DrawString($text, $font, $brush, $rect, $format)
    
    # Add a small note that it's a placeholder
    $fontSmall = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
    $brushSmall = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Gray)
    $rectSmall = New-Object System.Drawing.RectangleF(0, 400, 800, 200)
    $graphics.DrawString("(Placeholder Image)", $fontSmall, $brushSmall, $rectSmall, $format)
    
    $path = Join-Path "c:\Users\ACER\OneDrive\Desktop\--main\main2" $file
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bmp.Dispose()
    $font.Dispose()
    $brush.Dispose()
    $format.Dispose()
    $fontSmall.Dispose()
    $brushSmall.Dispose()
}

Write-Host "Placeholders created successfully."
