# Privacy Policy — CTRL Bypasser

**Last updated:** 2026-10-13  
**Maintainer:** [ouuwz](https://github.com/ouuwz)

CTRL Bypasser has no analytics, advertising, telemetry, remote code, or network requests.

## Clipboard handling

When a user invokes copy, cut, or paste in a supported editor on an explicitly enabled site, the extension's page-world adapter may read or write the selected clipboard text through the browser Clipboard API. Clipboard contents are not saved to extension storage, logged, or transmitted.

## Local settings

The extension stores the list of enabled site origins in `chrome.storage.local`. The hidden self-test reports editor integration status and clipboard API availability; it never reads clipboard contents.

## Permissions

- `activeTab`: interact with the tab after the user opens the extension popup.
- `scripting`: inject editor adapters on a site after explicit user action or on later navigations to an origin the user enabled.
- `storage`: save enabled origins locally.
- `clipboardRead` and `clipboardWrite`: declare clipboard capabilities used by the extension's editor helpers.
- Optional HTTP/HTTPS host permissions: requested for the specific origin only when the user enables it.

## User control

The extension is off by default. Users can disable a site from the popup or remove the extension. Reload a page after disabling to remove already installed page-level editor handlers completely.

## Contact

For questions or security reports, use the maintainer's GitHub profile: https://github.com/ouuwz
