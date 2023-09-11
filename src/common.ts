import * as vscode from "vscode";

export const publisher = "sransara";
export const extensionName = "speedscope-in-vscode";
export const extensionId = `${publisher}.${extensionName}`;

export const customEditorViewType = "speedscope-in-vscode.speedscope";

export class PublicApi {
  webviewPanels = new WebViewPanelCollection();
}

export class WebViewPanelCollection {
  private webviewPanels: Map<string, vscode.WebviewPanel> = new Map();

  get(uri: vscode.Uri): vscode.WebviewPanel | undefined {
    return this.webviewPanels.get(uri.toString());
  }

  set(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel): void {
    this.webviewPanels.set(uri.toString(), webviewPanel);
  }

  delete(uri: vscode.Uri): void {
    this.webviewPanels.delete(uri.toString());
  }
}
