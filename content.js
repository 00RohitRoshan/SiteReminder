const origin = location.origin;

const btn = document.createElement("div");
btn.id = "visit-marker-btn";
btn.innerHTML = "🕘";
document.body.appendChild(btn);

const tooltip = document.createElement("div");
tooltip.id = "visit-marker-tooltip";
document.body.appendChild(tooltip);

let hideTimeout = null;

function showTooltip() {
  clearTimeout(hideTimeout);

  chrome.storage.local.get(origin, (data) => {
    const entry = data[origin] || {};
    const last = entry.prevVisited || entry.lastVisited;

    tooltip.innerHTML = `
      <div class="vm-title">Site Info</div>
      <div class="vm-row">
        <strong>Last visit:</strong><br>
        ${last ? new Date(last).toLocaleString() : "First visit"}
      </div>
      ${
        entry.reminder
          ? `<div class="vm-row"><strong>Reminder:</strong><br>${entry.reminder}</div>`
          : `<div class="vm-row vm-muted">No reminder</div>`
      }
      <div class="vm-actions">
        <button id="vm-edit">✏️ Edit</button>
        <button id="vm-clear">❌ Clear</button>
      </div>
    `;

    const rect = btn.getBoundingClientRect();
    tooltip.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    tooltip.style.right = `20px`;
    tooltip.style.display = "block";

    document.getElementById("vm-edit").onclick = () => {
      const text = prompt("Edit reminder:", entry.reminder || "");
      if (text !== null) {
        entry.reminder = text;
        chrome.storage.local.set({ [origin]: entry });
      }
    };

    document.getElementById("vm-clear").onclick = () => {
      delete entry.reminder;
      chrome.storage.local.set({ [origin]: entry });
      tooltip.style.display = "none";
    };
  });
}

function scheduleHide() {
  hideTimeout = setTimeout(() => {
    tooltip.style.display = "none";
  }, 200); // delay allows cursor to move
}

btn.addEventListener("mouseenter", showTooltip);
btn.addEventListener("mouseleave", scheduleHide);

tooltip.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
});

tooltip.addEventListener("mouseleave", scheduleHide);
