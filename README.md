<div align="center">

<img src="src/ctrl-bypasser.svg" alt="CTRL Bypasser logo" width="120" />

# CTRL Bypasser

**Clipboard shortcut support for web-based code editors**

Having trouble with copy, cut, or paste in a web editor? CTRL Bypasser is an experimental browser extension that tries to improve shortcut compatibility in supported editors.

[![Version](https://img.shields.io/badge/version-1.0.2-8bcf68?style=flat-square)](https://github.com/ouuwz)
[![Manifest](https://img.shields.io/badge/Manifest-V3-8bcf68?style=flat-square)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Developer](https://img.shields.io/badge/developer-ouuwz-8bcf68?style=flat-square)](https://github.com/ouuwz)

[![GitHub](https://img.shields.io/badge/GitHub-ouuwz-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ouuwz)
[![Telegram](https://img.shields.io/badge/Telegram-Updates-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/ctrlbypasser)

</div>

---

## What it does

Copy, cut, and paste usually work with no fuss in a text field. Some online code editors handle these shortcuts differently because they use their own keyboard handlers or page-level scripts.

CTRL Bypasser tests ways to make those shortcuts work more consistently in supported editors. Whether it works depends on the website, browser, editor version, and permissions available to the extension.

## Features

- **Copy, cut, and paste support** for compatible editor setups
- **Editor detection** to identify supported editor instances
- **Editor integrations** with fallback handling where available
- **Site-specific settings** in builds that support them
- **Popup controls** for quick access to extension settings
- **Shortcut conflict handling** intended to avoid affecting unrelated keys
- **Uninstall redirect** to the developer's GitHub profile

These features are best-effort. The extension cannot guarantee that every shortcut will work on every website.

## Supported editors

| Editor | Integration | Compatibility |
|---|---|---|
| Monaco Editor | Editor-specific handling | Best effort |
| CodeMirror 5 | Editor-specific handling | Best effort |
| CodeMirror 6 | Fallback handling | Experimental |
| Ace Editor | Editor-specific handling | Best effort |

Websites can customize editors, intercept keyboard events, or embed them in frames. Any of these can affect whether the extension works.

## Installation

You can load CTRL Bypasser as an unpacked extension in a compatible Chromium-based browser, as long as your browser or organization allows it.

1. Download the project ZIP from the official repository or release.
2. Extract the ZIP file.
3. Open `chrome://extensions` in Chrome, or `edge://extensions` in Microsoft Edge.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted folder that contains `manifest.json`.
7. Pin the extension if you want to open its popup quickly.

Make sure you select the folder containing `manifest.json`, not the ZIP file itself. Before installing, review the source code and permissions of the build you're using.

## How to use it

1. Open a website where you are allowed to use the extension.
2. Click inside a supported code editor.
3. Select a small piece of sample text.
4. Try `Ctrl+C`, `Ctrl+X`, and `Ctrl+V`.
5. Open the extension popup to check the available settings.

If the editor starts behaving strangely, disable the extension for that site and reload the page. Test with sample text before relying on it for important work.

## How it works

The extension looks for supported editors and uses editor-specific handling or fallback logic where available. It can also apply site settings in builds that include those options.

Clipboard access still follows the browser's security rules. Some operations require permission, a secure context, or a recent user action. Seeing a keyboard event fire does not necessarily mean the clipboard operation succeeded.

Useful background reading:

- [Chrome Extensions: Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN: Clipboard access in extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard)

## Settings

If your version includes site-specific settings, these are good starting points:

- Enable the extension only on sites where you need it.
- Turn it off on sites where it isn't useful.
- Check the behavior before using it with sensitive content.
- Reset the site's settings if an editor starts acting up.

Available settings depend on the build you're using.

## Privacy and security

CTRL Bypasser is intended to work as a local browser-extension utility. What it can access depends on its code, manifest permissions, browser, and the website it's running on.

Before installing a build, check `manifest.json` and review the scripts that run on webpages. If you're updating the extension, check for changes to permissions or network requests too.

Avoid testing with passwords, access tokens, private keys, financial information, or confidential code. Don't assume a build collects no data or makes no external requests until you've checked the actual source.

## Responsible use

Use CTRL Bypasser for development, debugging, accessibility experiments, and learning how browser extensions and web editors handle keyboard shortcuts.

Don't use it to break exam or proctoring rules, evade an organization's security controls, or bypass website protections without permission. Always follow the rules that apply to the website or system you're using.

## Known limitations

- A website may intercept or override keyboard events.
- Custom editor shortcuts can conflict with fallback handling.
- Clipboard access may be blocked by browser security rules.
- Content scripts may not be able to access cross-origin frames.
- Browser or editor updates can break an integration.
- Dynamically created or heavily customized editors may not be detected.
- Some websites do not allow extensions or interface changes.
- A keyboard shortcut firing does not guarantee that the clipboard changed.

## Troubleshooting

### The extension doesn't appear

- Check that Developer mode is enabled.
- Load the folder containing `manifest.json`.
- Look for errors on the extension details page.
- Reload the extension after changing its files.

### Copy, cut, or paste still doesn't work

- Make sure the editor is supported and has focus.
- Select a small piece of test text.
- Check the browser's clipboard permissions and security settings.
- Look for errors in the browser console.
- Try a local test page to see whether the problem is specific to the website.

### The editor starts behaving strangely

- Disable the extension on that site.
- Reset its settings if that option is available.
- Reload the page and test again with sample content.

### It stopped working after an update

- Check whether the browser or editor has changed.
- Review the release notes and reported issues.
- Use an older version only if you can verify its source and safety.

## Development

### Requirements

- A compatible Chromium-based browser
- A code editor
- Basic JavaScript knowledge
- Browser developer tools

### Example project structure

The layout below is an example. File names and folders may differ in the actual release.

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

### Development workflow

1. Check the manifest and its permissions.
2. Read through the popup and editor integration scripts.
3. Load the extension as an unpacked extension.
4. Test it on a local page or a site where you have permission.
5. Check the page console and extension service-worker logs.
6. Retest existing behavior after making changes.

An automated test suite is not assumed to be included. Check the actual repository to see what tests are available.

## Contributing

Found a bug or want to improve something? Contributions and useful bug reports are welcome.

When reporting a problem, include:

- Browser and version
- Extension version
- Editor framework and version, if known
- Steps to reproduce the issue with sample text
- What you expected and what happened instead
- Relevant console errors, with private information removed

Please don't post passwords, access tokens, private keys, confidential code, or personal information in issues. Keep permissions limited to what the extension needs.

## License

See the [`LICENSE`](LICENSE) file for the license terms that apply to this project. If the repository has no license file, clarify the terms before reusing or redistributing the code.

## Credits

CTRL Bypasser is maintained by [ouuwz](https://github.com/ouuwz).

The project explores browser-extension development, JavaScript keyboard events, web-based code editors, and clipboard compatibility.

---

Use the extension only where you're allowed to. Test carefully, and keep a copy of important work.
