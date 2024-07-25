import * as vscode from "vscode";
import { extensionName, customEditorViewType, PublicApi } from "@src/common";

export class Commands {
  public static registerOpenSpeedscope(
    context: vscode.ExtensionContext,
    api: PublicApi,
  ) {
    const commandName = `${extensionName}.openSpeedscope`;

    const handler = async (uri?: vscode.Uri | string) => {
      if (!uri) {
        const uris = await vscode.window.showOpenDialog({
          canSelectFiles: true,
          // TODO: Add support for folders
          canSelectFolders: false,
          canSelectMany: false,
        });
        if (!uris) {
          return;
        }
        uri = uris[0];
      }
      if (typeof uri === "string") {
        uri = vscode.Uri.file(uri);
      }
      await vscode.commands.executeCommand(
        "vscode.openWith",
        uri,
        customEditorViewType,
      );
    };

    return vscode.commands.registerCommand(commandName, handler);
  }
}
