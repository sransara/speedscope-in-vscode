import * as vscode from "vscode";
import { SpeedscopeDocument } from "@src/document";

// Build with
// ```
// cd exteral/speedscope
// npm install
// npx parcel build assets/index.html --public-url "./vscode-webview-url"
// ```
import * as _speedscopePageContent from "@external/speedscope/dist/index.html?raw";
import {
  WebViewPanelCollection,
  docUriScheme,
  customEditorViewType,
} from "@src/common";

export class SpeedscopeEditorProvider
  implements vscode.CustomReadonlyEditorProvider<SpeedscopeDocument>
{
  private logger: vscode.LogOutputChannel;

  public static register(
    context: vscode.ExtensionContext,
    webviewPanels: WebViewPanelCollection,
  ): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      customEditorViewType,
      new SpeedscopeEditorProvider(context, webviewPanels),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      },
    );
  }

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly webviewPanels: WebViewPanelCollection,
  ) {
    this.logger = vscode.window.createOutputChannel("Speedscope", {
      log: true,
    });
  }

  dispose() {
    this.logger.dispose();
  }

  openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken,
  ): SpeedscopeDocument | Thenable<SpeedscopeDocument> {
    return new SpeedscopeDocument(uri);
  }

  resolveCustomEditor(
    document: SpeedscopeDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken,
  ): void | Thenable<void> {
    // Add webview to the list of webviewPanels
    this.webviewPanels.set(document.uri, webviewPanel);
    webviewPanel.onDidDispose(() => {
      this.webviewPanels.delete(document.uri);
    });

    // Set webview options
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    // Setup initial content for the webview
    let speedscopePageContent = _speedscopePageContent as unknown as string;
    speedscopePageContent = speedscopePageContent.replaceAll(
      /"vscode-webview-url\/(.*?)"/g,
      (match, p1) => {
        return webviewPanel.webview
          .asWebviewUri(
            vscode.Uri.joinPath(
              this.context.extensionUri,
              "external",
              "speedscope",
              "dist",
              p1,
            ),
          )
          .toString();
      },
    );

    webviewPanel.webview.onDidReceiveMessage(async (e) => {
      if (e.type === "ready") {
        this.logger.info(`Speedscope view for ${document.uri} is ready`);
        if (document.uri.scheme === docUriScheme) {
          return;
        }
        this.logger.info(`Trying to load document: ${document.uri}`);
        const docbytes = await vscode.workspace.fs.readFile(document.uri);
        let filename = document.uri.path;
        if (filename.includes("/")) {
          filename = filename.slice(filename.lastIndexOf("/") + 1);
        }
        webviewPanel.webview.postMessage({
          type: "load",
          filename,
          docbytes: new Uint8Array(docbytes),
        });
      } else if (e.type === "console") {
        const prefix = `speedscope view: console.${e.method}:`;
        switch (e.method) {
          case "log":
            this.logger.info(prefix, ...e.args);
            break;
          case "info":
            this.logger.info(prefix, ...e.args);
            break;
          case "warn":
            this.logger.warn(prefix, ...e.args);
            break;
          case "error":
            this.logger.error(prefix, ...e.args);
            break;
        }
      }
    });

    webviewPanel.webview.html = speedscopePageContent;
  }
}
