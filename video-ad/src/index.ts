import "./index.css";
if (typeof window !== "undefined") {
  // Ignora erros vindos do MetaMask/Chrome extensions para limpar o console do Remotion
  const ignoreExtensionError = (errorMsg: string | undefined, stack: string | undefined) => {
    const isMetaMask = errorMsg?.includes("MetaMask") || stack?.includes("MetaMask");
    const isExtension = stack?.includes("chrome-extension://") || errorMsg?.includes("chrome-extension://");
    return isMetaMask || isExtension;
  };

  window.addEventListener("error", (event) => {
    if (ignoreExtensionError(event.message, event.error?.stack || event.filename)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg = reason?.message || (typeof reason === "string" ? reason : "");
    const stack = reason?.stack || "";
    if (ignoreExtensionError(msg, stack)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
