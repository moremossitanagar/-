$jsToAdd = @"

/* ==========================================
   COMIC ENHANCEMENTS (JS)
   ========================================== */

// 1. Comic Action Bubbles on Hover
document.querySelectorAll('.catalog-card').forEach(card => {
    const bubble = document.createElement('div');
    const words = ["BAM!", "POW!", "CRUNCH!", "SPICY!", "ZAP!", "BOOM!"];
    const word = words[Math.floor([Math]::random() * words.length)]; // wait, powershell interpolates $.. let's escape it or use literal
"@

$jsToAdd = @"

/* ==========================================
   COMIC ENHANCEMENTS (JS)
   ========================================== */

// 1. Comic Action Bubbles on Hover
document.querySelectorAll('.catalog-card').forEach(card => {
    const bubble = document.createElement('div');
    const words = ["BAM!", "POW!", "CRUNCH!", "SPICY!", "ZAP!", "BOOM!"];
    const word = words[Math.floor(Math.random() * words.length)];
    bubble.innerText = word;
    // Add brutalist classes
    bubble.className = "absolute top-2 right-2 bg-yellow-400 text-black font-display-lg text-2xl px-3 py-1 border-4 border-black rotate-12 opacity-0 transition-all duration-300 pointer-events-none z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
    
    const imgWrapper = card.querySelector('.aspect-\\\\[4\\\\/3\\\\]') || card.querySelector('div.relative');
    if(imgWrapper) {
        imgWrapper.style.position = 'relative';
        imgWrapper.appendChild(bubble);
        card.addEventListener('mouseenter', () => {
            bubble.style.opacity = '1';
            bubble.style.transform = \`rotate(\${Math.random() * 20 - 10}deg) scale(1.2)\`;
        });
        card.addEventListener('mouseleave', () => {
            bubble.style.opacity = '0';
            bubble.style.transform = \`rotate(12deg) scale(1)\`;
        });
    }
});

// 2. Comic-Style Page Transitions (Slider Clicks / Menu Clicks)
const wipeOverlay = document.createElement('div');
wipeOverlay.className = "comic-wipe";
wipeOverlay.innerHTML = '<div class="comic-wipe-text">ZOOOOOM!</div>';
document.body.appendChild(wipeOverlay);

document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only apply to html links that are not just anchors
    if(href && href.endsWith('.html') && href !== window.location.pathname.split('/').pop()) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const words = ["ZOOOOOM!", "SWOOSH!", "WHAM!", "FLIP!", "WAPOW!"];
            wipeOverlay.querySelector('.comic-wipe-text').innerText = words[Math.floor(Math.random() * words.length)];
            wipeOverlay.classList.add('active');
            
            // Navigate after the wipe covers the screen
            setTimeout(() => {
                window.location.href = href;
            }, 500); 
        });
    }
});
"@

$scriptPath = "C:\Users\ACER\OneDrive\Desktop\--main\main2\script.js"
$content = Get-Content $scriptPath -Raw

if ($content -notmatch "COMIC ENHANCEMENTS") {
    $content = $content + "`n" + $jsToAdd
    Set-Content -Path $scriptPath -Value $content -Encoding utf8
}
