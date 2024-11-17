//content.js
// Consolidated message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchPrivacyContent") {
        handleFetchPrivacyContent(request.url, sendResponse);
        return true; // Indicates asynchronous response
    } else if (request.action === "findString") {
        handleFindString(request.searchString, sendResponse); // Pass searchString
        return true; // Indicates asynchronous response
    }
});

// Handler for "fetchPrivacyContent"
function handleFetchPrivacyContent(url, sendResponse) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Remove unwanted elements to clean the DOM
            const unwantedElements = doc.querySelectorAll('script, style, noscript, iframe, footer, header, nav, aside, form');
            unwantedElements.forEach(element => element.remove());

            // Use Readability to extract main content
            if (typeof Readability !== 'undefined') {
                const reader = new Readability(doc);
                const article = reader.parse();

                const text = article ? article.textContent : doc.body.innerText;

                sendResponse({ 
                    success: true,
                    text: text
                });
            } else {
                console.error("Readability library is not loaded.");
                sendResponse({ 
                    success: false,
                    error: "Readability library is not loaded."
                });
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            sendResponse({ 
                success: false,
                error: error.toString()
            });
        });
}

// Updated handler for "findString"
function handleFindString(searchString, sendResponse) {
    try {
        const xpath = `//a[contains(translate(text(), 'PRIVACY', 'privacy'), 'privacy')]`;
        const xpathResult = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        const matches = [];
        for (let i = 0; i < xpathResult.snapshotLength; i++) {
            const node = xpathResult.snapshotItem(i);
            matches.push({
                text: node.textContent.trim(),
                href: node.href || null
            });
        }

        console.log('Looking for privacy link...');
        console.log('Found matches:', JSON.stringify(matches, null, 2));

        sendResponse({ matches: matches });
    } catch (error) {
        console.error('Error details:', JSON.stringify({
            message: error.message,
            name: error.name,
            stack: error.stack
        }, null, 2));

        sendResponse({ 
            matches: [], 
            error: error.toString()
        });
    }
}
