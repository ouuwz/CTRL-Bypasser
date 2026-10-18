<div align="center">

<img src="src/ctrl-bypasser.svg" alt="CTRL Bypasser logo" width="120" />

# CTRL Bypasser

**Clipboard shortcut compatibility for web-based code editors**

Copy, cut, and paste compatibility experiments for supported editors, with a small browser-extension popup.

[![Version](https://img.shields.io/badge/version-1.0.1-6d5dfc?style=flat-square)](https://github.com/ouuwz)
[![Manifest](https://img.shields.io/badge/Manifest-V3-20232a?style=flat-square)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Developer](https://img.shields.io/badge/developer-ouuwz-111827?style=flat-square)](https://github.com/ouuwz)

[GitHub](https://github.com/ouuwz) · [Telegram updates](https://t.me/ctrlbypasser)

</div>

---

## What it does

Some web-based code editors handle keyboard shortcuts differently from ordinary text fields. Editor-specific handlers, page scripts, browser permissions, and site settings can all affect clipboard shortcuts.

CTRL Bypasser experiments with ways to improve **Ctrl+C**, **Ctrl+X**, and **Ctrl+V** compatibility in supported editors. Results depend on the browser, editor version, and website implementation. It will not work everywhere.

## Features

- Copy, cut, and paste compatibility handling for supported editors
- Detection of supported editor instances
- Editor-specific integrations and fallback handling
- Site-specific settings where supported by the installed build
- A compact popup for extension controls
- Attempts to avoid conflicts with unrelated keyboard shortcuts
- An uninstall redirect to the developer's GitHub profile

These are best-effort features, not guarantees. The exact options available depend on the build you install.

## Supported editors

| Editor | Integration | Status |
|---|---|---|
| Monaco Editor | Editor-specific integration | Best effort |
| CodeMirror 5 | Editor-specific integration | Best effort |
| CodeMirror 6 | Fallback compatibility handling | Experimental |
| Ace Editor | Editor-specific integration | Best effort |

A site may customize its editor, intercept keyboard events, or place it inside a frame. Those changes can prevent compatibility handling from working.

## Install

CTRL Bypasser can be loaded as an unpacked extension in a compatible Chromium-based browser, if browser policy permits it.

1. Download the project ZIP from the official repository or release.
2. Extract the ZIP.
3. Open `chrome://extensions` in Chrome, or `edge://extensions` in Microsoft Edge.
4. Turn on **Developer mode**.
5. Select **Load unpacked**.
6. Choose the extracted folder that contains `manifest.json`.
7. Pin the extension if you want quick access to its popup.

Choose the folder containing `manifest.json`, not the ZIP file or an unrelated parent folder. Only install a build you trust, and review its code and requested permissions first.

## Use it

1. Open a site where you are allowed to use the extension.
2. Focus a supported code editor and select some sample text.
3. Test the standard copy, cut, and paste shortcuts.
4. Open the popup to review the settings available in your build.
5. If something behaves incorrectly, disable the extension on that site and reload the page.

Test with non-sensitive sample text before using it on important work.

## How it works

At a high level, the extension:

1. Detects supported editor instances where its scripts can run.
2. Observes relevant keyboard interactions.
3. Uses editor-specific APIs or fallback handling when available.
4. Applies supported settings for the current site.
5. Remains subject to browser permissions and clipboard security rules.

Clipboard APIs can require a secure context, permission, or recent user interaction. A shortcut event firing does not prove that the clipboard operation succeeded.

Further reading:
- [Chrome Extensions: Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN: Clipboard access in extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard)

## Settings

Where supported by your installed version:

- Enable compatibility features only on sites that need them.
- Disable the extension on sites where it is unnecessary.
- Review site-specific behavior before working with sensitive content.
- Reset the site's settings if the editor starts behaving unexpectedly.

The exact configuration options vary by build.

## Privacy and security

CTRL Bypasser is intended to run as a local browser-extension utility. Its actual access and behavior depend on the source code, manifest permissions, browser, and site.

Before installing or updating it:

- Review the permissions in `manifest.json`.
- Inspect the content scripts and any external network requests.
- Avoid testing with passwords, tokens, private keys, financial details, or confidential code.
- Re-check permissions and behavior when installing a new version.

Do not assume that a build collects no data or makes no external requests without checking and testing that exact build.

## Responsible use

Use CTRL Bypasser for legitimate usability testing, accessibility experiments, debugging, development, and learning about browser extensions.

Do not use it to circumvent exam or proctoring rules, evade organizational security controls, defeat website protections without authorization, or access information you are not allowed to use. Follow the rules of the website, institution, or organization involved.

## Limitations

- Websites can intercept or override keyboard events.
- Custom editor handlers may conflict with fallback logic.
- Clipboard operations remain subject to browser security policies.
- Cross-origin frames may be inaccessible to content scripts.
- Browser or editor updates may break an integration.
- Dynamically created or customized editors may not be detected.
- Some websites prohibit extensions or interface modifications.
- A shortcut event does not guarantee a successful clipboard operation.

## Troubleshooting

**The extension does not appear**
- Confirm Developer mode is enabled.
- Load the folder containing `manifest.json`.
- Check the extension details page for manifest or script errors.
- Reload the extension after changing its files.

**Copy, cut, or paste still fails**
- Confirm the editor is supported and has focus.
- Select a small amount of sample text.
- Check browser clipboard permissions and security restrictions.
- Inspect the browser console for errors.
- Try a local test page to isolate site-specific behavior.

**The editor starts behaving incorrectly**
- Disable the extension on that site.
- Reset its settings if available.
- Reload the page and reproduce the issue with sample content.

**It stopped working after an update**
- Check for browser or editor changes.
- Review the release notes and reported issues.
- Only test an older version if you can verify its source and safety.

## Development

### Requirements

- A compatible Chromium-based browser
- A code editor
- Basic JavaScript knowledge
- Browser developer tools

### Typical project layout

The exact file names may differ between releases. Check the extracted source for the actual structure.

```text
CTRL-Bypasser/
├── manifest.json
├── popup.html
├── src/
│   ├── background.js
│   └── editor-bridge.js
├── icons/
├── README.md
├── LICENSE
├── PRIVACY.md
└── INSTALL.txt
```

### Suggested workflow

1. Inspect the manifest and declared permissions.
2. Review the popup and editor integration scripts.
3. Load the extension as unpacked.
4. Test on a local page or an authorized development site.
5. Check the page console and extension service-worker logs.
6. Re-test existing behavior after every change.

Do not assume automated tests are included unless they exist in the release.

## Contributing

Bug reports and educational improvements are welcome. When opening an issue, include:

- Browser and version
- Extension version
- Editor framework and version, if known
- Steps to reproduce using non-sensitive sample content
- Expected and actual behavior
- Relevant console errors, with private data removed

Never include passwords, access tokens, private keys, confidential source code, or personal information in an issue.

Keep permissions limited to what the extension needs, and avoid affecting unrelated websites.

## License

See the [`LICENSE`](LICENSE) file for the terms that apply to this project. If the repository does not include a license, clarify reuse and redistribution rights before sharing the code.

## Credits

**CTRL Bypasser** is created and maintained by [ouuwz](https://github.com/ouuwz).

Built as a learning project around browser extensions, JavaScript keyboard events, web-based code editors, and clipboard compatibility.

---

Use responsibly. Test carefully. Respect website policies. You are responsible for how you use the extension.
