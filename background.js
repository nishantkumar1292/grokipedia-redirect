const AUTO_REDIRECT_STORAGE_KEY = 'autoRedirectEnabled';
const WIKIPEDIA_PATH_PREFIX = '/wiki/';

function isWikipediaHost(hostname) {
    return hostname === 'wikipedia.org' || hostname.endsWith('.wikipedia.org');
}

function getArticleTitleFromWikipediaUrl(rawUrl) {
    let url;

    try {
        url = new URL(rawUrl);
    } catch (error) {
        return null;
    }

    if (!isWikipediaHost(url.hostname) || !url.pathname.startsWith(WIKIPEDIA_PATH_PREFIX)) {
        return null;
    }

    const articleTitle = url.pathname.slice(WIKIPEDIA_PATH_PREFIX.length);
    return articleTitle || null;
}

function getGrokipediaUrl(articleTitle) {
    return `https://grokipedia.com/page/${articleTitle}`;
}

async function isGrokipediaArticleAvailable(articleTitle) {
    try {
        const response = await fetch(getGrokipediaUrl(articleTitle), { method: 'GET' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function maybeRedirectToGrokipedia(tabId, sourceUrl) {
    const articleTitle = getArticleTitleFromWikipediaUrl(sourceUrl);

    if (!articleTitle) {
        return;
    }

    const storageResult = await chrome.storage.sync.get({ [AUTO_REDIRECT_STORAGE_KEY]: false });
    const isAutoRedirectEnabled = Boolean(storageResult[AUTO_REDIRECT_STORAGE_KEY]);

    if (!isAutoRedirectEnabled) {
        return;
    }

    const isAvailable = await isGrokipediaArticleAvailable(articleTitle);
    if (!isAvailable) {
        return;
    }

    let tab;
    try {
        tab = await chrome.tabs.get(tabId);
    } catch (error) {
        return;
    }

    if (tab.url !== sourceUrl) {
        return;
    }

    await chrome.tabs.update(tabId, { url: getGrokipediaUrl(articleTitle) });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (typeof changeInfo.url !== 'string') {
        return;
    }

    maybeRedirectToGrokipedia(tabId, changeInfo.url);
});
