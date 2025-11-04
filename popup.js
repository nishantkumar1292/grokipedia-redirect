document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url) {
        document.getElementById('status').textContent = 'Unable to access page URL';
        return;
    }

    const url = new URL(tab.url);

    if (!url.hostname.includes('wikipedia.org')) {
        document.getElementById('status').textContent = 'Please navigate to a Wikipedia article';
        return;
    }

    const pathParts = url.pathname.split('/');
    const articleTitle = pathParts[pathParts.length - 1];

    if (!articleTitle || articleTitle === '') {
        document.getElementById('status').textContent = 'No article found on this page';
        return;
    }

    const grokipediaUrl = `https://grokipedia.com/page/${articleTitle}`;
    const linkElement = document.getElementById('grokipedia-link');
    linkElement.href = grokipediaUrl;
    linkElement.textContent = `Open "${articleTitle.replace(/_/g, ' ')}" in Grokipedia`;
    linkElement.classList.remove('hidden');
    document.getElementById('status').classList.add('hidden');
});

