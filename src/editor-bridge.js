(() => {
  "use strict";
  const GLOBAL = "__ctrlBypasser";
  if (window[GLOBAL]?.version === "1.0.1") {
    window[GLOBAL].enabled = true;
    window[GLOBAL].scan?.();
    return;
  }

  const state = {
    version: "1.0.1",
    enabled: true,
    detected: new Set(),
    installed: new Set(),
    notes: new Set(),
    errors: new Set(),
    observer: null,
    interval: null,
    scanCount: 0
  };
  window[GLOBAL] = state;

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  const readClipboard = () => navigator.clipboard.readText();
  const writeClipboard = text => navigator.clipboard.writeText(text);
  const safe = promise => Promise.resolve(promise).catch(() => {});
  const isEnabled = () => state.enabled;

  function setupMonaco() {
    const monaco = window.monaco;
    const editors = monaco?.editor?.getEditors?.() || [];
    if (!editors.length) return;
    state.detected.add("Monaco");

    for (const editor of editors) {
      if (editor.__ctrlBypasser_1_0_1) continue;
      const model = editor.getModel?.();
      if (!model || editor.getOption?.(monaco.editor.EditorOption.readOnly)) continue;

      const missing = id => !editor.getAction?.(id);
      const actions = [
        {
          id: "editor.action.clipboardCopyAction",
          customId: "ctrl-bypasser.copy",
          label: "Copy",
          key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC,
          run: async ed => {
            if (!isEnabled()) return;
            const m = ed.getModel(), range = ed.getSelection();
            if (!m || !range || range.isEmpty()) return;
            await writeClipboard(m.getValueInRange(range));
          }
        },
        {
          id: "editor.action.clipboardCutAction",
          customId: "ctrl-bypasser.cut",
          label: "Cut",
          key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX,
          run: async ed => {
            if (!isEnabled()) return;
            const m = ed.getModel(), range = ed.getSelection();
            if (!m || !range || range.isEmpty()) return;
            await writeClipboard(m.getValueInRange(range));
            ed.executeEdits("ctrl-bypasser-cut", [{ range, text: "", forceMoveMarkers: true }]);
          }
        },
        {
          id: "editor.action.clipboardPasteAction",
          customId: "ctrl-bypasser.paste",
          label: "Paste",
          key: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
          run: async ed => {
            if (!isEnabled()) return;
            const text = await readClipboard();
            const range = ed.getSelection();
            if (!range) return;
            ed.executeEdits("ctrl-bypasser-paste", [{ range, text, forceMoveMarkers: true }]);
          }
        }
      ];

      let count = 0;
      for (const action of actions) {
        // Conflict protection: preserve the editor's native action when present.
        if (!missing(action.id) || editor.getAction?.(action.customId)) continue;
        editor.addAction({
          id: action.customId,
          label: action.label + " (CTRL Bypasser)",
          keybindings: [action.key],
          run: action.run
        });
        count++;
      }
      editor.__ctrlBypasser_1_0_1 = true;
      if (count) state.installed.add("Monaco: " + count + " fallback action(s)");
    }
  }

  function setupCodeMirror5() {
    for (const wrapper of document.querySelectorAll(".CodeMirror")) {
      const cm = wrapper.CodeMirror;
      if (!cm || cm.__ctrlBypasser_1_0_1) continue;
      state.detected.add("CodeMirror 5");
      const activeMaps = cm.state?.keyMaps || [];
      const hasCustomBinding = key => activeMaps.some(map => map && map[key] !== undefined);
      const map = {};
      const addIfUnmapped = (key, handler) => {
        if (!hasCustomBinding(key)) map[key] = handler;
      };
      const copy = () => {
        if (!isEnabled()) return false;
        const text = cm.getSelection();
        if (text) safe(writeClipboard(text));
        return true;
      };
      const cut = () => {
        if (!isEnabled()) return false;
        const text = cm.getSelection();
        if (text) safe(writeClipboard(text).then(() => cm.replaceSelection("")));
        return true;
      };
      const paste = () => {
        if (!isEnabled()) return false;
        safe(readClipboard().then(text => cm.replaceSelection(text)));
        return true;
      };
      const prefix = isMac ? "Cmd-" : "Ctrl-";
      addIfUnmapped(prefix + "C", copy);
      addIfUnmapped(prefix + "X", cut);
      addIfUnmapped(prefix + "V", paste);
      if (Object.keys(map).length) {
        cm.addKeyMap(map);
        state.installed.add("CodeMirror 5: fallback keymap");
      } else {
        state.notes.add("CodeMirror 5: existing keymaps preserved");
      }
      cm.__ctrlBypasser_1_0_1 = true;
    }
  }

  function setupAce() {
    if (!window.ace?.edit) return;
    for (const node of document.querySelectorAll(".ace_editor")) {
      let ed;
      try { ed = window.ace.edit(node); } catch { continue; }
      if (!ed || ed.__ctrlBypasser_1_0_1) continue;
      state.detected.add("Ace");
      const byName = ed.commands?.byName || {};
      const commandDefs = [
        {
          name: "ctrlBypasserCopy",
          nativeNames: ["copy"],
          bindKey: { win: "Ctrl-C", mac: "Command-C" },
          readOnly: true,
          exec: editor => {
            if (!isEnabled()) return;
            const text = editor.getCopyText?.() ?? editor.session.getTextRange(editor.getSelectionRange());
            if (text) safe(writeClipboard(text));
          }
        },
        {
          name: "ctrlBypasserCut",
          nativeNames: ["cut"],
          bindKey: { win: "Ctrl-X", mac: "Command-X" },
          exec: editor => {
            if (!isEnabled()) return;
            const range = editor.getSelectionRange();
            const text = editor.session.getTextRange(range);
            if (text) safe(writeClipboard(text).then(() => editor.session.remove(range)));
          }
        },
        {
          name: "ctrlBypasserPaste",
          nativeNames: ["paste"],
          bindKey: { win: "Ctrl-V", mac: "Command-V" },
          exec: editor => {
            if (!isEnabled()) return;
            safe(readClipboard().then(text => editor.insert(text)));
          }
        }
      ];
      let count = 0;
      for (const cmd of commandDefs) {
        if (cmd.nativeNames.some(name => byName[name]) || byName[cmd.name]) continue;
        ed.commands.addCommand(cmd);
        count++;
      }
      ed.__ctrlBypasser_1_0_1 = true;
      if (count) state.installed.add("Ace: " + count + " fallback command(s)");
      else state.notes.add("Ace: native clipboard commands preserved");
    }
  }

  // CodeMirror 6 best-effort fallback. It uses the focused contenteditable and
  // browser editing commands, rather than guessing at private EditorView internals.
  function setupCodeMirror6() {
    const roots = document.querySelectorAll(".cm-editor");
    if (!roots.length) return;
    state.detected.add("CodeMirror 6");
    for (const root of roots) {
      if (root.__ctrlBypasser_1_0_1) continue;
      root.__ctrlBypasser_1_0_1 = true;
      root.addEventListener("keydown", event => {
        if (!isEnabled() || !(isMac ? event.metaKey : event.ctrlKey) || event.altKey) return;
        const key = event.key.toLowerCase();
        if (!["c", "x", "v"].includes(key)) return;
        // Leave native editor shortcuts alone if the app has already handled them.
        if (event.defaultPrevented) return;
        const content = root.querySelector(".cm-content");
        if (!content || document.activeElement !== content) return;

        if (key === "c" || key === "x") {
          const selection = window.getSelection();
          const text = selection?.toString() || "";
          if (!text) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          safe(writeClipboard(text).then(() => {
            if (key === "x" && isEnabled()) document.execCommand("delete");
          }));
        } else if (key === "v") {
          event.preventDefault();
          event.stopImmediatePropagation();
          safe(readClipboard().then(text => {
            if (isEnabled()) document.execCommand("insertText", false, text);
          }));
        }
      }, true);
      state.installed.add("CodeMirror 6: contenteditable fallback");
    }
  }

  function scan() {
    if (!state.enabled) return;
    state.scanCount++;
    try { setupMonaco(); } catch (e) { state.errors.add("Monaco integration error"); }
    try { setupCodeMirror5(); } catch (e) { state.errors.add("CodeMirror 5 integration error"); }
    try { setupAce(); } catch (e) { state.errors.add("Ace integration error"); }

  }
  state.scan = scan;
  scan();


})();
