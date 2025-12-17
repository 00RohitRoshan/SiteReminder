chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  const origin = new URL(tab.url).origin;

  chrome.storage.local.get(origin, (data) => {
    document.getElementById("reminder").value =
      data[origin]?.reminder || "";
  });

  document.getElementById("save").onclick = () => {
    const reminder = document.getElementById("reminder").value;

    chrome.storage.local.get(origin, (data) => {
      const entry = data[origin] || {};
      entry.reminder = reminder;

      chrome.storage.local.set({ [origin]: entry }, () => {
        document.getElementById("status").textContent = "Saved!";
      });
    });
  };
});
