chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getHeadings") {
		const headingsElements = document.querySelectorAll(
			".mw-heading.mw-heading2"
		);
		const headings = Array.from(headingsElements).map(
			(element) => element.textContent
		);
		chrome.runtime.sendMessage({ headings: headings });
	}
});
