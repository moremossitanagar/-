$folder = "C:\Users\ACER\OneDrive\Desktop\--main\main2"
$files = Get-ChildItem -Path "$folder\*.html"

$sliderHtml = @"
    <!-- Hero Slider / Top Category Navigation -->
    <section class="sticky top-20 z-40 overflow-hidden border-b-4 border-on-background py-4 bg-primary-container">
      <div class="container mx-auto px-margin-mobile md:px-margin-desktop">
        <h3 class="font-display-lg text-headline-md text-on-primary uppercase mb-6 text-center md:text-left">CHOOSE YOUR FLAVOR FIGHTER</h3>
        <div class="flex overflow-x-auto gap-8 pb-4 no-scrollbar snap-x">
          
          <a href="momo.html" class="flex-none w-32 flex flex-col items-center gap-2 snap-center group">
            <div class="rounded-full bg-secondary-container border-4 border-on-background p-2 hard-shadow group-hover:scale-105 w-20 h-20 transition-all duration-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[42px]">rice_bowl</span>
            </div>
            <span class="font-display-lg text-xs uppercase text-on-primary group-hover:text-secondary-fixed transition-colors">Momo Parlour</span>
          </a>
          
          <a href="ramen-thukpa.html" class="flex-none w-32 flex flex-col items-center gap-2 snap-center group">
            <div class="rounded-full bg-secondary-container border-4 border-on-background p-2 hard-shadow group-hover:scale-105 w-20 h-20 transition-all duration-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[42px]">soup_kitchen</span>
            </div>
            <span class="font-display-lg text-xs uppercase text-on-primary group-hover:text-secondary-fixed transition-colors">Ramen & Thukpa</span>
          </a>
          
          <a href="noodles-rice.html" class="flex-none w-32 flex flex-col items-center gap-2 snap-center group">
            <div class="rounded-full bg-secondary-container border-4 border-on-background p-2 hard-shadow group-hover:scale-105 w-20 h-20 transition-all duration-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[42px]">dinner_dining</span>
            </div>
            <span class="font-display-lg text-xs uppercase text-on-primary group-hover:text-secondary-fixed transition-colors">Chowmein & Rice</span>
          </a>
          
          <a href="sides.html" class="flex-none w-32 flex flex-col items-center gap-2 snap-center group">
            <div class="rounded-full bg-secondary-container border-4 border-on-background p-2 hard-shadow group-hover:scale-105 w-20 h-20 transition-all duration-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[42px]">fastfood</span>
            </div>
            <span class="font-display-lg text-xs uppercase text-on-primary group-hover:text-secondary-fixed transition-colors">Sides & Wraps</span>
          </a>
          
          <a href="drinks.html" class="flex-none w-32 flex flex-col items-center gap-2 snap-center group">
            <div class="rounded-full bg-secondary-container border-4 border-on-background p-2 hard-shadow group-hover:scale-105 w-20 h-20 transition-all duration-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[42px]">local_bar</span>
            </div>
            <span class="font-display-lg text-xs uppercase text-on-primary group-hover:text-secondary-fixed transition-colors">Refreshing Drinks</span>
          </a>

          <a href="shakes.html" class="flex-none w-32 flex flex-col items-center gap-2 snap-center group">
            <div class="rounded-full bg-secondary-container border-4 border-on-background p-2 hard-shadow group-hover:scale-105 w-20 h-20 transition-all duration-300 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[42px]">coffee_maker</span>
            </div>
            <span class="font-display-lg text-xs uppercase text-on-primary group-hover:text-secondary-fixed transition-colors">Milkshakes</span>
          </a>

        </div>
      </div>
    </section>
"@

foreach ($file in $files) {
    if ($file.Name -eq "code.html") { continue }
    $content = Get-Content $file.FullName -Raw
    
    if ($file.Name -eq "index.html") {
        # Replace the existing slider to add sticky classes
        $pattern = '(?s)<!-- Hero Slider / Top Category Navigation -->.*?</section>'
        $content = $content -replace $pattern, $sliderHtml
    } else {
        # For all other catalog pages
        if ($content -notmatch "Hero Slider / Top Category Navigation") {
            $mainPattern = '(?s)<main class="mt-20 py-8 px-margin-mobile md:px-margin-desktop max-w-\[1200px\] mx-auto space-y-8">'
            $replacement = "<main class=`"mt-20`">`n$sliderHtml`n    <div class=`"py-8 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto space-y-8`">"
            
            if ($content -match $mainPattern) {
                $content = $content -replace $mainPattern, $replacement
                
                # We need to add closing </div> before </main>
                $content = $content -replace '(?s)(</main>)', "    </div>`n  `$1"
            }
        } else {
            # Update the slider if it was already added but not sticky
            $pattern = '(?s)<!-- Hero Slider / Top Category Navigation -->.*?</section>'
            $content = $content -replace $pattern, $sliderHtml
        }
    }
    
    Set-Content -Path $file.FullName -Value $content -Encoding utf8
}
