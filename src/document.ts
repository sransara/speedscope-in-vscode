import * as vscode from "vscode";

export class SpeedscopeDocument implements vscode.CustomDocument {
  uri: vscode.Uri;

  constructor(uri: vscode.Uri) {
    this.uri = uri;
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }
}
