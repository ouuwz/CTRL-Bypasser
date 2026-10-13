const BRIDGE_FILE = "src/editor-bridge.js";

function getOrigin(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.origin : null;
  } catch {
    return null;
  }
}

async function isOriginEnabled(origin) {
  if (!origin) return false;
  const { enabledOrigins = [] } = await chrome.storage.local.get({ enabledOrigins: [] });
  if (!enabledOrigins.includes(origin)) return false;
  return chrome.permissions.contains({ origins: [origin + "/*"] });
}

async function injectBridge(tabId, url) {
  const origin = getOrigin(url);
  if (!origin || !(await isOriginEnabled(origin))) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      files: [BRIDGE_FILE]
    });
  } catch {
    // Silent by design: restricted browser pages and navigations can reject injection.
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab?.url) {
    void injectBridge(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab?.url) await injectBridge(tabId, tab.url);
  } catch {
    // Ignore closed tabs and browser-internal pages.
  }
});

chrome.runtime.onInstalled.addListener(() => {
  // No telemetry or network activity.
});


// Browser opens this page when the extension is uninstalled.
chrome.runtime.setUninstallURL("https://github.com/ouuwz");
