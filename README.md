# soen321_project
 
# Loading the plugin into Chrome

## Access Chrome's Extensions Page:
Open Chrome and navigate to chrome://extensions/.

## Enable Developer Mode:
In the top-right corner of the Extensions page, toggle the "Developer mode" switch to the "on" position.

## Load Your Unpacked Extension:
Click the "Load unpacked" button.
In the dialog that appears, browse to and select the directory containing your extension files.

## Verify Extension Installation:
After loading, your extension should appear in the list on the Extensions page.
If your extension includes a browser action (an icon next to the address bar), it should now be visible in the Chrome toolbar.

# Using plugin

## Load a web-site

Note that not all of the web-sites can be parsed by the plug-in due to the high variation in the way that privacy policy is presented in the HTML and Javascript. It's very hard to create a script which would parse every possible way that a privacy policy would be served, neither it is the goal of the assignment.

Tested web-sites on which plug-in works are:
- https://www.canada.ca/en.html
- https://www.quebec.ca/en
- https://www.github.com
- https://openai.com/
- https://www.anthropic.com/
- https://www.netflix.com/ca/
- https://www.samsung.com/ca/
- https://www.amazon.ca/
- https://www.ikea.com/ca/en/
- https://www.symbolab.com/

## Find the privacy policy

1. Click on the "Find Privacy Policy"
2. The policy should be found and loaded under the "Privacy Policy Content" section. Expand that section to make sure it was loaded.

## Chat configuration overview
The plug-in will be making API calls to OpenAI API endpoint:
https://api.openai.com/v1/chat/completions

Insert the API Key into the "OpenAI API Key" input. You can obtain by registering with OpenAI and buying $5 worth of credits.

The default model which does a good job is "gpt-4o-mini", but it can be switched to the more expensive "gpt-4o" in the "Select model" dropdown

The system prompt is provided by default, but can be changed.
View more on the role of system messages [here](https://platform.openai.com/docs/guides/text-generation#system-messages)


## Current system prompt, for easy reference:

You are an expert in privacy policy analysis and consumer rights. Your task is to review the privacy policy from a website and provide an educational summary for the user. Focus on helping the user understand their rights and how the policy affects them. Structure your analysis under the following headings:

***Potential Concerns or Red Flags***

Highlight ambiguous or concerning language.
Explain how these could impact user rights or privacy.

***Educational Insights for the User***

Provide practical advice on how users can protect their rights based on the policy.
Suggest questions or actions users might take if they are concerned.
Use clear and accessible language. Ensure the summary is actionable and empowers the user to make informed decisions about their privacy.

***Other Important Areas of Analysis***

*Data Collection Practices*
- What types of data are collected (e.g., personal, financial, behavioural)?
- Is the data collection necessary for the service, or is it excessive?

*Data Usage*
- How is the collected data used (e.g., for services, marketing, third-party sharing)?
- Are there any unexpected uses of the data?

*Third-Party Sharing and Transfers*
- Does the policy specify sharing data with third parties or transferring it internationally?
- Are these transfers governed by adequate safeguards (e.g., GDPR compliance)?

*User Rights*
- What rights does the policy grant to users (e.g., access, rectification, deletion, opt-out)?
- How easy is it for users to exercise these rights?

*Retention Policies*
- How long is the data retained?
- Are there provisions for automatic deletion after a certain period?

*Security Measures*
- What security measures are mentioned to protect user data?
- Are there any red flags suggesting insufficient safeguards?

*Cookies and Tracking*
- What does the policy say about cookies, trackers, or other monitoring technologies?
- Are there opt-out options for non-essential tracking?

*Jurisdiction and Governing Laws*
- Which country's laws govern the policy?
- Are there implications for cross-border users?

## Chat with the privacy policy
Once the OpenAI API key is provided, you can click the "Send" button.
This will initiate the call, with the following context:

System prompt: as described in the previous section
User prompt: "Privacy policy text extracted from the website"

You will see the User message "Privacy Policy Text" appear. After 10 seconds, the model will reply back with the analysis of the privacy policy.

At this point, you can chat in the same way as you do with ChatGPT - you will be sending API calls to the OpenAI with the context which includes the previous message, plus your new message.

This creates the multi-turn conversation, on which you can view more details [here](https://platform.openai.com/docs/guides/text-generation#conversations-and-context)






