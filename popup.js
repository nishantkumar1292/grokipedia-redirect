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

function formatArticleTitle(articleTitle) {
    try {
        return decodeURIComponent(articleTitle).replace(/_/g, ' ');
    } catch (error) {
        return articleTitle.replace(/_/g, ' ');
    }
}

async function isGrokipediaArticleAvailable(articleTitle) {
    try {
        const response = await fetch(getGrokipediaUrl(articleTitle), { method: 'GET' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function initializeAutoRedirectToggle() {
    const toggleElement = document.getElementById('auto-redirect-toggle');
    const storageResult = await chrome.storage.sync.get({ [AUTO_REDIRECT_STORAGE_KEY]: false });
    toggleElement.checked = Boolean(storageResult[AUTO_REDIRECT_STORAGE_KEY]);

    toggleElement.addEventListener('change', async () => {
        await chrome.storage.sync.set({ [AUTO_REDIRECT_STORAGE_KEY]: toggleElement.checked });
    });
}

async function updatePopupForCurrentTab() {
    const statusElement = document.getElementById('status');
    const linkElement = document.getElementById('grokipedia-link');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url) {
        statusElement.textContent = 'Unable to access page URL';
        return;
    }

    const articleTitle = getArticleTitleFromWikipediaUrl(tab.url);
    if (!articleTitle) {
        statusElement.textContent = 'Please navigate to a Wikipedia article';
        return;
    }

    statusElement.classList.remove('hidden');
    statusElement.textContent = 'Checking Grokipedia...';

    const isAvailable = await isGrokipediaArticleAvailable(articleTitle);
    if (!isAvailable) {
        linkElement.classList.add('hidden');
        statusElement.textContent = 'Not Available';
        return;
    }

    linkElement.href = getGrokipediaUrl(articleTitle);
    linkElement.textContent = `Open "${formatArticleTitle(articleTitle)}" in Grokipedia`;
    linkElement.classList.remove('hidden');
    statusElement.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeAutoRedirectToggle();
    await updatePopupForCurrentTab();
});
