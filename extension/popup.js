document.addEventListener("DOMContentLoaded", function () {
	const emailDisplay = document.getElementById("emailDisplay");
	const copyButton = document.getElementById("copyButton");
	const statusDiv = document.getElementById("status");
	let currentEmail = null; // Variable to store the email

	// Function to update status message
	function updateStatus(message, isError = false) {
		statusDiv.textContent = message;
		statusDiv.style.color = isError ? "red" : "green";
		// Optionally clear the message after a few seconds
		setTimeout(() => {
			statusDiv.textContent = "";
		}, 3000);
	}

	// 1. Query the active tab to send a message to its content script
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (tabs.length === 0) {
			emailDisplay.textContent = "No active tab found.";
			copyButton.disabled = true;
			return;
		}
		const tabId = tabs[0].id;

		// 2. Send a message to the content script asking for the email
		chrome.tabs.sendMessage(
			tabId,
			{ action: "getEmailFromPage" }, // Define a unique action name
			function (response) {
				// 4. Handle the response from the content script
				if (chrome.runtime.lastError) {
					// Handle errors like no content script responding (e.g., not on Zendesk)
					emailDisplay.textContent = "Could not connect. Are you on Zendesk?";
					copyButton.disabled = true;
					console.error(chrome.runtime.lastError.message);
				} else if (response && response.email) {
					currentEmail = response.email;
					emailDisplay.textContent = currentEmail;
					copyButton.disabled = false;
				} else {
					emailDisplay.textContent = "Email not found on page.";
					copyButton.disabled = true;
				}
			}
		);
	});

	// 5. Add click listener to the copy button
	copyButton.addEventListener("click", function () {
		if (currentEmail) {
			navigator.clipboard
				.writeText(currentEmail)
				.then(() => {
					// Success feedback
					updateStatus("Email copied to clipboard!");
				})
				.catch((err) => {
					// Error feedback
					updateStatus("Failed to copy email.", true);
					console.error("Clipboard write failed: ", err);
				});
		}
	});
});
