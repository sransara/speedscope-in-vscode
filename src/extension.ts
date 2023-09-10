import * as vscode from "vscode";
import { SpeedscopeEditorProvider } from "@src/editor-provider";
import { PublicApi, docUriScheme, customEditorViewType } from "@src/common";

export function activate(context: vscode.ExtensionContext) {
  const api = new PublicApi();

  context.subscriptions.push(
    SpeedscopeEditorProvider.register(context, api.webviewPanels),
  );

  // register a command that opens a new speedscope view
  let speedscopeViewCounter = 0;
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "speedscope-in-vscode.openNewSpeedscopeView",
      async () => {
        speedscopeViewCounter += 1;
        const docName = `Speedscope-${speedscopeViewCounter}`;
        const uri = vscode.Uri.parse(`${docUriScheme}:${docName}`);
        vscode.commands.executeCommand(
          "vscode.openWith",
          uri,
          customEditorViewType,
        );
      },
    ),
  );

  return api;
}
