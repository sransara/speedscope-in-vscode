import * as assert from "assert";
import * as path from "path";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { extensionId, PublicApi, extensionName } from "../../common";

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

    // Open the file in a custom editor
    // Test if the custom editor provider works
    await vscode.commands.executeCommand(
      `${extensionName}.openSpeedscope`,
      docUri,
    );

    // Testing if the extension activated
    const extensionApi: PublicApi =
      vscode.extensions.getExtension(extensionId)!.exports;

    // Check if the webview panel is visible
    const webviewPanel = extensionApi.webviewPanels.get(docUri);
    assert.strictEqual(webviewPanel?.visible, true);

    // Check if speedscope successfully loaded the file
    const success = await new Promise((resolve) => {
      webviewPanel.webview.onDidReceiveMessage((e) => {
        // TODO: handle race condition where ready message is sent before
        // (e.question === "error" && e.answer === "yes")
        if (e.clientEvent === "opennedFile") {
          resolve(true);
        } else if (e.clientEvent === "error") {
          resolve(false);
        }
      });
    });
    assert.strictEqual(success, true);
  });

  // openSpeedscope command should accept string argument as well as Uri
  // this is necessary to support adding keybindings for example
  test("Test openSpeedscope command with string argument", async () => {
    const filePath = path.join(workspaceUri.path, "simple.prof");
    await vscode.commands.executeCommand(
      `${extensionName}.openSpeedscope`,
      filePath,
    );

    // Testing if the extension activated
    const extensionApi: PublicApi =
      vscode.extensions.getExtension(extensionId)!.exports;
  });
});
