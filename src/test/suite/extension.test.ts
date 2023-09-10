import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { extensionId, customEditorViewType, PublicApi } from "../../common";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");
  const workspaceUri = vscode.workspace.workspaceFolders![0].uri;

  test("Hello world test", async () => {
    const document = await vscode.workspace.openTextDocument(
      vscode.Uri.joinPath(workspaceUri, "hello-world.txt"),
    );
    const editor = vscode.window.showTextDocument(document);
    assert.strictEqual(document.getText(), "Hello World\n");
  });

  test("Integrated test with simple.prof", async () => {
    const docUri = vscode.Uri.joinPath(workspaceUri, "simple.prof");
    await vscode.commands.executeCommand(
      "vscode.openWith",
      docUri,
      customEditorViewType,
    );
    const extensionApi: PublicApi =
      vscode.extensions.getExtension(extensionId)!.exports;
    const webviewPanel = extensionApi.webviewPanels.get(docUri);
    assert.strictEqual(webviewPanel?.visible, true);
    const success = await new Promise((resolve) => {
      webviewPanel.webview.onDidReceiveMessage((e) => {
        if (
          e.type === "ready" ||
          false
          // TODO: handle race condition where ready message is sent before
          // (e.question === "ready" && e.answer === "yes")
        ) {
          resolve(true);
        }
      });
    });
    assert.strictEqual(success, true);
  });
});
