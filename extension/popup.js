document.addEventListener("DOMContentLoaded", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const currentTab = tabs[0];
		if (currentTab && currentTab.url.includes("wikipedia.org")) {
			chrome.scripting.executeScript(
				{
					target: { tabId: currentTab.id },
					files: ["content.js"],
				},
				() => {
					chrome.runtime.onMessage.addListener(
						(request, sender, sendResponse) => {
							if (request.headings) {
								displayHeadings(request.headings);
							}
						}
					);
					chrome.tabs.sendMessage(currentTab.id, { action: "getHeadings" });
				}
			);
		} else {
			document.getElementById("headings-list").innerHTML =
				"<li>Not a Wikipedia page.</li>";
		}
	});

	function displayHeadings(headings) {
		const headingsList = document.getElementById("headings-list");
		headingsList.innerHTML = "";
		headings.forEach((heading) => {
			const listItem = document.createElement("li");
			listItem.innerHTML = `
        <span class="heading-text">${heading}</span>
        <button class="copy-button">Copy</button>
        <button class="search-button">Search</button>
      `;
			headingsList.appendChild(listItem);

			const copyButton = listItem.querySelector(".copy-button");
			copyButton.addEventListener("click", () => {
				navigator.clipboard.writeText(heading);
			});

			const searchButton = listItem.querySelector(".search-button");
			searchButton.addEventListener("click", () => {
				const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
					heading
				)}`;
				chrome.tabs.create({ url: googleSearchUrl });
			});
		});
	}
});
