import * as vscode from "vscode";
import { SpeedscopeDocument } from "@src/document";

// Build with
// ```
// cd exteral/speedscope
// npm install
// npx parcel build assets/index.html --public-url "./vscode-webview-url"
// ```
import * as _speedscopePageContent from "@external/speedscope/dist/index.html?raw";

export class SpeedscopeEditorProvider
  implements vscode.CustomReadonlyEditorProvider<SpeedscopeDocument>
{
  private static readonly viewType = "speedscope-in-vscode.speedscope";

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      SpeedscopeEditorProvider.viewType,
      new SpeedscopeEditorProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      },
    );
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

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
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };

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

    webviewPanel.webview.html = speedscopePageContent;
  }
}
