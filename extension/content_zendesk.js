// --- Add this listener to your existing content_zendesk.js ---

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// Check if the message is the one sent from the popup
	if (request.action === "getEmailFromPage") {
		console.log("Content script received request for email."); // For debugging

		// --- Find the email on the Zendesk page ---
		// Replace this with your actual logic/selectors to find the email address
		let foundEmail = null;
		// Example: Look for a specific element ID or class
		const emailElement = document.querySelector(".customer-email-class"); // Replace with CORRECT selector
		if (emailElement) {
			foundEmail = emailElement.innerText.trim(); // Or .value, .textContent, etc.
		} else {
			console.log("Email element not found with selector."); // Debugging
			// Add more attempts with different selectors if needed
		}
		// --- End finding email ---

		if (foundEmail) {
			console.log("Found email:", foundEmail); // Debugging
			sendResponse({ email: foundEmail });
		} else {
			console.log("Could not find email on page."); // Debugging
			// Respond even if not found, so the popup knows
			sendResponse({ email: null });
		}

		// Return true if sendResponse might be called asynchronously (optional here, but good practice)
		// return true;
	}

	// If you have other message listeners, make sure they don't conflict
	// e.g., for the main role verification workflow initiated by a button on the page
	if (request.action === "startVerification") {
		// Handle verification logic...
	}
});

// --- Rest of your content script logic (adding buttons, etc.) ---
// Make sure you have logic somewhere to add the main verification button too.
