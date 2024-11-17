document.addEventListener("DOMContentLoaded", () => {
    let conversationMessages = [];
    let privacyPolicyText = "";

    // Display the URL of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const pageUrlDiv = document.getElementById("page-url");
        if (tabs.length > 0) {
            pageUrlDiv.textContent = `Target website: ${tabs[0].url}`;
        } else {
            pageUrlDiv.textContent = "Unable to fetch the URL.";
        }
    });

    // Search for string on button click
    document.getElementById("find-string").addEventListener("click", () => {
        const searchInput = "Privacy";
        if (searchInput) {
            // Show loading indicator
            document.getElementById("loading-indicator").style.display = "block";

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "findString", searchString: searchInput },
                    (response) => {
                        const resultDiv = document.getElementById("result");
                        // Hide loading indicator
                        document.getElementById("loading-indicator").style.display = "none";

                        if (chrome.runtime.lastError) {
                            console.error('Runtime error:', chrome.runtime.lastError);
                            resultDiv.textContent = "An error occurred while communicating with the content script.";
                            return;
                        }

                        if (response && response.matches && response.matches.length > 0) {
                            // Clear previous results
                            const privacyContentDiv = document.getElementById("privacy-content");
                            privacyContentDiv.innerHTML = ""; // Clear previous content

                            // Process the first match (assuming one privacy policy)
                            const match = response.matches[0];
                            if (match.href) {
                                // Display the link where the policy was pulled
                                document.getElementById("privacy-url").textContent = `Privacy Policy URL: ${match.href}`;

                                // Send message to content script to fetch privacy content
                                chrome.tabs.sendMessage(
                                    tabs[0].id,
                                    { 
                                        action: "fetchPrivacyContent",
                                        url: match.href 
                                    },
                                    (bgResponse) => {
                                        if (chrome.runtime.lastError) {
                                            console.error('Runtime error:', chrome.runtime.lastError);
                                            return;
                                        }

                                        if (bgResponse && bgResponse.success) {
                                            // Display the extracted text
                                            const content = bgResponse.text;
                                            
                                            // Store the privacy policy text
                                            privacyPolicyText = content;

                                            // Display the privacy policy
                                            const pre = document.createElement("pre");
                                            pre.textContent = content;
                                            pre.style.whiteSpace = "pre-wrap";
                                            pre.style.wordWrap = "break-word";
                                            privacyContentDiv.appendChild(pre);

                                            // Display the chat UI
                                            document.getElementById("chat-ui").style.display = "block";

                                            // Initialize conversation messages with system prompt
                                            const systemPrompt = document.getElementById("system-prompt").value;
                                            conversationMessages = [{ role: "system", content: systemPrompt }];
                                        } else {
                                            console.error('Failed to fetch content:', bgResponse ? bgResponse.error : 'No response');
                                        }
                                    }
                                );
                            } else {
                                resultDiv.textContent = "No privacy policy link found.";
                            }
                        } else {
                            resultDiv.textContent = "No matching content found.";
                        }
                    }
                );
            });
        } else {
            alert("Please enter a string to search.");
        }
    });

    // Event listener for the send button
    document.getElementById("send-message").addEventListener("click", () => {
        // Get the system prompt (in case the user modified it)
        const systemPrompt = document.getElementById("system-prompt").value;

        // Update the system prompt in conversationMessages
        if (conversationMessages.length > 0 && conversationMessages[0].role === "system") {
            conversationMessages[0].content = systemPrompt;
        } else {
            conversationMessages.unshift({ role: "system", content: systemPrompt });
        }

        if (conversationMessages.length === 1) {
            // First message, include privacy policy
            // Add the privacy policy as the user's message
            conversationMessages.push({ role: "user", content: privacyPolicyText });

            // Display the user's message in the chat panel
            addMessageToChatPanel("User", "[Privacy Policy Text]");

            // Send the conversation to the assistant
            sendConversationToAssistant();
        } else {
            // Subsequent messages
            const userMessage = document.getElementById("user-message").value.trim();
            if (userMessage === "") {
                alert("Please enter a message.");
                return;
            }

            // Add the user's message to the conversation
            conversationMessages.push({ role: "user", content: userMessage });

            // Clear the input field
            document.getElementById("user-message").value = "";

            // Display the user's message in the chat panel
            addMessageToChatPanel("User", userMessage);

            // Send the conversation to the assistant
            sendConversationToAssistant();
        }
    });

    // Function to add messages to the chat panel
    function addMessageToChatPanel(sender, message) {
        const chatPanel = document.getElementById("chat-panel");
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        const senderStrong = document.createElement("strong");
        senderStrong.textContent = `${sender}:`;
        messageDiv.appendChild(senderStrong);

        const messagePre = document.createElement("pre");
        messagePre.style.whiteSpace = "pre-wrap";
        messagePre.style.wordWrap = "break-word";
        messagePre.textContent = message;
        messageDiv.appendChild(messagePre);

        chatPanel.appendChild(messageDiv);

        // Scroll to the bottom
        chatPanel.scrollTop = chatPanel.scrollHeight;
    }

    // Function to send the conversation to the assistant via the background script
    function sendConversationToAssistant() {
        const apiKey = document.getElementById("api-key").value.trim();
        const model = document.getElementById("model-selection").value;

        if (apiKey === "") {
            alert("Please enter your OpenAI API Key.");
            return;
        }

        // Disable the send button and show loading indicator
        document.getElementById("send-message").disabled = true;
        document.getElementById("loading-indicator").style.display = "block";

        chrome.runtime.sendMessage(
            {
                action: "callOpenAIAPI",
                apiKey: apiKey,
                model: model,
                messages: conversationMessages
            },
            (response) => {
                // Re-enable the send button and hide loading indicator
                document.getElementById("send-message").disabled = false;
                document.getElementById("loading-indicator").style.display = "none";

                if (response && response.success) {
                    const data = response.data;

                    if (data.error) {
                        console.error("API Error:", data.error);
                        alert(`Error: ${data.error.message}`);
                        return;
                    }

                    const assistantMessage = data.choices[0].message.content;

                    // Add the assistant's message to the conversation
                    conversationMessages.push({ role: "assistant", content: assistantMessage });

                    // Display the assistant's message in the chat panel
                    addMessageToChatPanel("Assistant", assistantMessage);
                } else {
                    console.error("Error:", response ? response.error : "No response");
                    alert("An error occurred while communicating with the assistant.");
                }
            }
        );
    }

});
