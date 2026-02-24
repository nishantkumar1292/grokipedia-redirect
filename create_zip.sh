files=(
    "manifest.json"
    "background.js"
    "popup.html"
    "popup.js"
    "popup.css"
    "icon16.png"
    "icon48.png"
    "icon128.png"
)

zip -r grokipedia-redirect.zip ${files[@]}
