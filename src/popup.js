const originEl = document.getElementById("origin");
const statusEl = document.getElementById("status");
const toggleBtn = document.getElementById("toggle");
const versionBtn = document.getElementById("version");
const siteManager = document.getElementById("siteManager");
const siteList = document.getElementById("siteList");
const devPanel = document.getElementById("devPanel");
const selfTestBtn = document.getElementById("selfTest");
const selfTestResult = document.getElementById("selfTestResult");

const RELEASE_STAGE = 1;
let currentTab;
let currentOrigin;
let enabled = false;
let versionClicks = 0;

function supportedOrigin(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.origin : null;
  } catch { return null; }
}

async function getEnabledOrigins() {
  const data = await chrome.storage.local.get({ enabledOrigins: [] });
  return data.enabledOrigins;
}

async function setEnabledOrigin(origin, value) {
  const origins = new Set(await getEnabledOrigins());
  if (value) origins.add(origin);
  else origins.delete(origin);
  await chrome.storage.local.set({ enabledOrigins: [...origins] });
}

async function injectBridge(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId }, world: "MAIN", files: ["src/editor-bridge.js"]
  });
}

async function disableBridge(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId }, world: "MAIN",
      func: () => { if (window.__ctrlBypasser) window.__ctrlBypasser.enabled = false; }
    });
  } catch {}
}

async function renderSites() {
  if (RELEASE_STAGE < 3) return;
  const origins = await getEnabledOrigins();
  siteManager.hidden = false;
  siteList.replaceChildren();
  if (!origins.length) {
    const empty = document.createElement("div");
    empty.className = "empty-sites";
    empty.textContent = "No sites enabled yet.";
    siteList.append(empty);
    return;
  }
  for (const origin of origins.sort()) {
    const row = document.createElement("div");
    row.className = "site-row";
    const name = document.createElement("div");
    name.className = "site-name";
    name.textContent = origin;
    const remove = document.createElement("button");
    remove.className = "remove-site";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Disable " + origin);
    remove.addEventListener("click", async () => {
      remove.disabled = true;
      await setEnabledOrigin(origin, false);
      if (origin === currentOrigin) {
        enabled = false;
        toggleBtn.textContent = "Enable on this site";
        statusEl.textContent = "Disabled for this site.";
        await disableBridge(currentTab?.id);
      }
      await renderSites();
    });
    row.append(name, remove);
    siteList.append(row);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  currentOrigin = supportedOrigin(tab?.url || "");
  if (!tab?.id || !currentOrigin) {
    originEl.textContent = "Unavailable on this page";
    statusEl.textContent = "Open a regular HTTP or HTTPS website.";
    toggleBtn.disabled = true;
    return;
  }

  originEl.textContent = currentOrigin;
  enabled = (await getEnabledOrigins()).includes(currentOrigin);
  statusEl.textContent = enabled
    ? "Enabled on this site."
    : "Off by default. Enable only on sites you're authorized to modify.";
  toggleBtn.textContent = enabled ? "Disable on this site" : "Enable on this site";
  toggleBtn.disabled = false;

  toggleBtn.addEventListener("click", async () => {
    toggleBtn.disabled = true;
    try {
      if (enabled) {
        await setEnabledOrigin(currentOrigin, false);
        await disableBridge(currentTab.id);
        enabled = false;
        statusEl.textContent = "Disabled. Reload to remove any active editor helpers.";
      } else {
        const granted = await chrome.permissions.request({ origins: [currentOrigin + "/*"] });
        if (!granted) {
          statusEl.textContent = "Site permission was not granted.";
          return;
        }
        await setEnabledOrigin(currentOrigin, true);
        await injectBridge(currentTab.id);
        enabled = true;
        statusEl.textContent = "Enabled. Focus the code editor to use clipboard shortcuts.";
      }
      toggleBtn.textContent = enabled ? "Disable on this site" : "Enable on this site";
      await renderSites();
    } catch {
      statusEl.textContent = "Couldn't update this site. Check permissions and try again.";
    } finally { toggleBtn.disabled = false; }
  });

  if (RELEASE_STAGE >= 3) await renderSites();

  if (RELEASE_STAGE >= 5) {
    versionBtn.addEventListener("click", () => {
      versionClicks++;
      if (versionClicks >= 5) {
        devPanel.hidden = false;
        versionClicks = 0;
      }
    });
    selfTestBtn.addEventListener("click", async () => {
      selfTestResult.hidden = false;
      selfTestResult.textContent = "Running…";
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: currentTab.id }, world: "MAIN",
          func: () => {
            const s = window.__ctrlBypasser;
            if (!s?.selfTest) return { bridgeLoaded: false, hint: "Enable the site or reload it, then run the self-test again." };
            return { bridgeLoaded: true, ...s.selfTest() };
          }
        });
        selfTestResult.textContent = JSON.stringify(results?.[0]?.result ?? {}, null, 2);
      } catch { selfTestResult.textContent = "Self-test unavailable on this page."; }
    });
  }
});
