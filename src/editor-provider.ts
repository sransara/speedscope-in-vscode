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
    throw new Error("Method not implemented.");
  }
  resolveCustomEditor(
    document: SpeedscopeDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken,
  ): void | Thenable<void> {
    throw new Error("Method not implemented.");
  }
}
