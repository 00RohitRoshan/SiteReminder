chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url).origin;

    chrome.storage.local.get(url, (data) => {
      const entry = data[url] || {};
      entry.lastVisited = new Date().toISOString();

      chrome.storage.local.set({ [url]: entry });
    });
  }
});
