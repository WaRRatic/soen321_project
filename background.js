// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "callOpenAIAPI") {
        const apiKey = request.apiKey;
        const model = request.model;
        const messages = request.messages;

        // Prepare the API request
        const url = "https://api.openai.com/v1/chat/completions";

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };

        const body = {
            model: model,
            messages: messages,
            temperature: 0.7
        };

        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ success: true, data: data });
        })
        .catch(error => {
            sendResponse({ success: false, error: error.toString() });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
    
    if (request.action === "fetchPrivacyContent") {
        const url = request.url;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                sendResponse({ 
                    success: true,
                    html: html
                });
            })
            .catch(error => {
                console.error('Fetch error:', error);
                sendResponse({ 
                    success: false,
                    error: error.toString()
                });
            });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
