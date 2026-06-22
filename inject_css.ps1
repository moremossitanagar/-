$folder = "C:\Users\ACER\OneDrive\Desktop\--main\main2"
$htmlFiles = Get-ChildItem -Path "$folder\*.html"

$cssToAdd = @"
    /* COMIC ENHANCEMENTS */
    body {
      background-image: radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px);
      background-size: 16px 16px;
      cursor: crosshair !important;
    }
    a, button, .catalog-card {
      cursor: pointer !important;
    }
    @keyframes jitter {
      0% { transform: rotate(0deg) translate(0px, 0px); }
      25% { transform: rotate(1deg) translate(1px, -1px); }
      50% { transform: rotate(0deg) translate(-1px, 1px); }
      75% { transform: rotate(-1deg) translate(-1px, -1px); }
      100% { transform: rotate(0deg) translate(1px, 1px); }
    }
    .add-to-cart-btn:hover, #btn-whatsapp-order:hover, #menu-trigger:hover, .cart-trigger:hover {
      animation: jitter 0.2s infinite;
    }
    .catalog-card {
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
    }
    .catalog-card:hover {
      transform: scale(1.03) translateY(-5px);
      box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
      z-index: 10;
    }
    @keyframes pageEntrance {
      0% { opacity: 0; transform: translateY(30px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    main {
      animation: pageEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .comic-wipe {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: var(--primary);
      z-index: 99999;
      transform: scaleY(0);
      transform-origin: bottom;
      transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .comic-wipe.active {
      transform: scaleY(1);
      pointer-events: all;
    }
    .comic-wipe-text {
      font-family: 'Anton', sans-serif;
      color: white;
      font-size: 8rem;
      text-transform: uppercase;
      text-shadow: 8px 8px 0 #000;
      opacity: 0;
      transform: scale(0.5) rotate(-10deg);
      transition: all 0.3s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .comic-wipe.active .comic-wipe-text {
      opacity: 1;
      transform: scale(1) rotate(-5deg);
    }
"@

foreach ($file in $htmlFiles) {
    if ($file.Name -eq "code.html") { continue }
    $content = Get-Content $file.FullName -Raw
    
    # Check if we already injected CSS
    if ($content -notmatch "\/\* COMIC ENHANCEMENTS \*\/") {
        $content = $content -replace "(</style>)", "`n$cssToAdd`n`$1"
        Set-Content -Path $file.FullName -Value $content -Encoding utf8
    }
}
