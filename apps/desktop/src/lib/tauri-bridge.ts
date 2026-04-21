type TauriInvoke = <T>(
  command: string,
  args?: Record<string, unknown>
) => Promise<T>;

const tauriCore = (
  window as Window & {
    __TAURI__?: {
      core?: {
        invoke?: TauriInvoke;
      };
    };
  }
).__TAURI__?.core;

if (tauriCore?.invoke) {
  const invoke = tauriCore.invoke;

  window.arcApi = {
    sendRequest: (payload) =>
      invoke<ArcDesktopResponsePayload>("send_request", { payload }),
    openExternal: (url) => invoke<void>("open_external", { url }),
  };

  window.arcWindow = {
    minimize: () => invoke<void>("window_minimize"),
    maximizeToggle: () => invoke<boolean>("window_maximize_toggle"),
    isMaximized: () => invoke<boolean>("window_is_maximized"),
    close: () => invoke<void>("window_close"),
  };
}
