<div align="center">

<img src="src/ctrl-bypasser.svg" alt="CTRL Bypasser logo" width="120" />

# CTRL Bypasser

**Clipboard shortcut support for web-based code editors**

CTRL Bypasser helps with copy, cut, and paste shortcuts in supported web editors. Editor integrations run only on sites you enable. For pages that block text selection or copying, the optional **Selection Assist** lets you arm the helper and click the pane you want to use.

[![Version](https://img.shields.io/badge/version-1.0.2-8bcf68?style=flat-square)](https://github.com/ouuwz/CTRL-Bypasser/releases)
[![Manifest](https://img.shields.io/badge/Manifest-V3-8bcf68?style=flat-square)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Developer](https://img.shields.io/badge/developer-ouuwz-8bcf68?style=flat-square)](https://github.com/ouuwz)

[![GitHub](https://img.shields.io/badge/GitHub-ouuwz-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ouuwz/CTRL-Bypasser)
[![Telegram](https://img.shields.io/badge/Telegram-Updates-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/ctrlbypasser)

</div>

---

## What it does

Some browser-based editors handle clipboard shortcuts through their own event handlers. Other sites block text selection or intercept copy and paste events. CTRL Bypasser provides editor-specific clipboard helpers and an optional page-selection helper for cases where the normal behavior fails.

Compatibility depends on the site, browser, editor implementation, and its permissions. It is not guaranteed to work everywhere.

## Features

- **Editor clipboard helpers** for supported editor instances.
- **Selection Assist** for pages that block text selection or copying.
- **Pane-focused activation:** enable Selection Assist, then click the pane you want to use. The extension attempts to keep other editor panes separate where it can detect them.
- **Per-site enable/disable** controls in the popup.
- **Opt-in site access:** the extension is off for a site until you enable it.
- **Local settings:** site preferences are stored in browser extension storage.

Selection Assist is experimental. Some websites use custom layouts or event handlers that it cannot reliably isolate.

## Supported editors

| Editor | Support |
|---|---|
| Monaco Editor | Editor-specific clipboard handling; best effort |
| CodeMirror 5 | Editor-specific handling; best effort |
| CodeMirror 6 | Experimental / best effort |
| Ace Editor | Editor-specific handling; best effort |

A website may modify its editor, embed it in a frame, or intercept keyboard events. That can affect compatibility. Cross-origin frames cannot be directly modified by page scripts running in another origin.

## Installation

1. Download the ZIP from the [GitHub releases page](https://github.com/ouuwz/CTRL-Bypasser/releases) or the project repository.
2. Extract the ZIP.
3. Open `chrome://extensions` in Chrome or `edge://extensions` in Microsoft Edge.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `ctrl-bypasser` folder containing `manifest.json`.
7. Pin the extension if you want quick access to its popup.

Review the source code and requested permissions before installing. Do not select the ZIP itself; select the extracted folder containing `manifest.json`.

## How to use it

1. Open a site where you are allowed to change clipboard behavior.
2. Click the CTRL Bypasser icon.
3. Choose **Enable on this site**.
4. Test `Ctrl+C`, `Ctrl+X`, and `Ctrl+V` with non-sensitive sample text in a supported editor.
5. If the page blocks selection or copying, open the popup and choose **Enable Selection Assist**.
6. With Selection Assist armed, click the pane where text selection or copying is blocked, then test again.
7. When finished, return to the popup and choose **Disable Selection Assist**. You can also disable CTRL Bypasser for the site.

Selection Assist stays off until you enable it. It is designed to target the pane you click, but pane detection is heuristic and may not work with every layout. If another pane or shortcut starts behaving strangely, disable Selection Assist and reload the page.

## How it works

CTRL Bypasser detects supported editor instances and applies editor-specific clipboard handling where available. Selection Assist is a separate, opt-in helper for pages that block text selection or copying. It is armed from the popup and activated by clicking the intended pane.

The browser still controls clipboard permissions and security requirements. A keyboard event firing does not prove that clipboard content was read or changed. Some operations may require a secure context, permission, or a user gesture.

Useful references:

- [Chrome Extensions: Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN: Clipboard access in extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard)

## Privacy and permissions

The extension requests `activeTab`, `scripting`, `storage`, `clipboardRead`, and `clipboardWrite`, and asks for optional access to HTTP and HTTPS sites when you enable it there. Review `manifest.json`, `PRIVACY.md`, and the scripts before use.

Site settings are stored locally. Clipboard text is handled when you invoke clipboard shortcuts; do not use the extension with passwords, access tokens, private keys, financial details, or confidential code while testing. Check the current source and permissions rather than relying on assumptions about any build.

## Responsible use

Use CTRL Bypasser for development, debugging, accessibility testing, and learning about browser extensions and web editors. Do not use it to violate exam or proctoring rules, evade organizational controls, or bypass website protections without permission. Follow the rules that apply to the site and system.

## Known limitations

- Site scripts may intercept or override keyboard and clipboard events.
- Clipboard access can be restricted by browser security settings.
- Selection Assist may affect page behavior and may not isolate panes perfectly.
- Cross-origin iframe contents cannot be directly modified by the helper.
- Browser or editor updates may break compatibility.
- Custom or dynamically created editors may not be detected.
- CodeMirror 6 support is experimental.
- A shortcut firing does not guarantee the clipboard operation succeeded.

## Troubleshooting

### The extension does not appear

- Confirm Developer mode is enabled.
- Load the extracted folder that contains `manifest.json`.
- Check the extension details page for errors.
- Reload the extension after changing its files.

### Copy, cut, or paste still does not work

- Make sure CTRL Bypasser is enabled for the current site.
- Click inside the editor and select a small piece of sample text.
- Check browser clipboard permissions and the page console for errors.
- If the page blocks selection, try Selection Assist and click the affected pane.

### Another pane or shortcut stops working

- Disable Selection Assist in the popup.
- Reload the page and test again.
- Keep Selection Assist off on sites where it causes interference.

### It stopped working after an update

- Check whether the browser or editor changed.
- Review the release notes and report reproducible issues with private information removed.

## Development

Requirements:

- A Chromium-based browser that supports Manifest V3
- A code editor and browser developer tools
- Basic JavaScript knowledge

Typical workflow:

1. Review `manifest.json` and its permissions.
2. Read the popup, background, and editor integration scripts.
3. Load the project as an unpacked extension.
4. Test on a local page or a site where you have permission.
5. Check the page console and extension service-worker logs.
6. Retest both the target pane and any other editor panes after changes.

Check the repository for the current file layout and available tests; a test suite is not guaranteed to be included.

## Bug reports

When reporting a problem, include:

- Browser and version
- CTRL Bypasser version
- Editor framework, if known
- Steps to reproduce using sample text
- Which pane was tested and what happened
- Relevant console errors with private information removed

Do not post passwords, tokens, private keys, confidential code, or personal information in issues.

## License

See [`LICENSE`](LICENSE) for the terms that apply to this project. Third-party components remain subject to their own licenses.

## Credits

Maintained by [ouuwz](https://github.com/ouuwz).

---

Use the extension only where you have permission, test with sample text, and keep a copy of important work.
