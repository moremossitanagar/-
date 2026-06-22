$folder = "C:\Users\ACER\OneDrive\Desktop\--main\main2"
$files = Get-ChildItem -Path "$folder\*.html"
$reportPath = "C:\Users\ACER\OneDrive\Desktop\Image_Updates_Report.txt"
"Menu Image Update Report`r`n========================`r`n" | Out-File $reportPath -Encoding utf8

$processedNames = @{}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    $matches = [regex]::Matches($content, '<img[^>]*alt="([^"]+)"[^>]*>')
    foreach ($m in $matches) {
        $imgTag = $m.Groups[0].Value
        $altText = $m.Groups[1].Value
        
        if ($altText -match "Logo" -or $altText -eq "MORE MO'S") { continue }
        
        $newName = ($altText -replace '\s+', '').ToLower() + ".png"
        
        if (-not $processedNames.ContainsKey($altText)) {
            $processedNames[$altText] = $newName
            "$altText -> $newName" | Out-File -Append $reportPath -Encoding utf8
        }
        
        $newImgTag = $imgTag -replace 'src="[^"]+"', "src=`"$newName`""
        
        $comment = "<!-- # here to chnage $altText png -->`n          "
        
        # Only replace if not already commented
        if ($content -notmatch "here to chnage $altText png") {
            $content = $content.Replace($imgTag, $comment + $newImgTag)
        } else {
            $content = $content.Replace($imgTag, $newImgTag)
        }
    }
    
    $btnMatches = [regex]::Matches($content, '<(?:button|a)[^>]*data-name="([^"]+)"[^>]*>')
    foreach ($m in $btnMatches) {
        $btnTag = $m.Groups[0].Value
        $dataName = $m.Groups[1].Value
        $newName = ($dataName -replace '\s+', '').ToLower() + ".png"
        
        $newBtnTag = $btnTag -replace 'data-image="[^"]+"', "data-image=`"$newName`""
        $content = $content.Replace($btnTag, $newBtnTag)
    }
    
    if ($content -cne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding utf8
    }
}
