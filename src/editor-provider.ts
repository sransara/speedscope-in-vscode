import * as vscode from "vscode";
import { SpeedscopeDocument } from "./document";

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
          retainContextWhenHidden: false,
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

    const imgURI = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "test-files", "sand.jpg"),
    );

    webviewPanel.webview.html = `Hello ${document.uri.toString()} <img src="${imgURI}" />`;
  }
}
