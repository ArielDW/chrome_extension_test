document.getElementById("getTitleButton").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		// Get current tab
		if (tabs && tabs.length > 0) {
			const currentTab = tabs[0];
			chrome.scripting.executeScript(
				{
					target: { tabId: currentTab.id }, // Use target instead of tabId
					function: () => {
						return document.title;
					},
				},
				(results) => {
					if (chrome.runtime.lastError) {
						console.error("Error:", chrome.runtime.lastError);
						document.getElementById("titleDisplay").textContent =
							"Error getting title.";
						return;
					}
					if (results && results.length > 0) {
						// Check if results exist
						const title = results[0].result;
						document.getElementById("titleDisplay").textContent = title;
					} else {
						document.getElementById("titleDisplay").textContent =
							"Could not retrieve title.";
					}
				}
			);
		} else {
			console.error("No active tab found.");
			document.getElementById("titleDisplay").textContent =
				"No active tab found.";
		}
	});
});
