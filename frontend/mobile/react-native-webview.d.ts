declare module "react-native-webview" {
  import { ComponentType } from "react";
  import { ViewProps } from "react-native";

  export type WebViewProps = ViewProps & {
    originWhitelist?: string[];
    source?: { html?: string };
    javaScriptEnabled?: boolean;
    domStorageEnabled?: boolean;
  };

  export const WebView: ComponentType<WebViewProps>;
}
