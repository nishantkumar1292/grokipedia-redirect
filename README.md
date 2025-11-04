Grokipedia Redirect

This repo is a chrome extension that creates redirect links to Grokipedia pages for Wikipedia articles.

## What does the extension do?
When you are on a Wikipedia article, it creates a link to the Grokipedia page for that article, and shows up when you click the extension icon on your browser.

## Grokipedia URL structure

Example Wikipedia article: https://en.wikipedia.org/wiki/Sun-synchronous_orbit
Corresponding Grokipedia article: https://grokipedia.com/page/Sun-synchronous_orbit

## Steps to publish to Chrome
1. Create a zip file. Run `./create_zip.sh` to create a zip file.
2. Create a Chrome Web Store developer account
    - Go to https://chrome.google.com/webstore/devconsole/
    - Sign in with your Google account
    - Pay the one-time $5 registration fee (if you haven't already)
3. Create a new item. Fill in the details, and click "Submit for Review"
