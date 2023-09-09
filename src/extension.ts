import * as vscode from "vscode";
import { SpeedscopeEditorProvider } from "./editor-provider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(SpeedscopeEditorProvider.register(context));

  // register a command that opens a new speedscope view
  let speedscopeViewCounter = 0;
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "speedscope-in-vscode.openNewSpeedscopeView",
      async () => {
        speedscopeViewCounter += 1;
        const docName = `Speedscope-${speedscopeViewCounter}`;
        const uri = vscode.Uri.parse(
          `${SpeedscopeEditorProvider.docScheme}:${docName}`,
        );
        vscode.commands.executeCommand(
          "vscode.openWith",
          uri,
          SpeedscopeEditorProvider.viewType,
        );
      },
    ),
  );
}
