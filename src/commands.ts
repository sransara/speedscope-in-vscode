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
      } else if (typeof uri === "string" || uri instanceof String) {
        if (uri.startsWith('.')) {
          // Resolve relative path using workspace folders
          if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage(`No workspace found to resolve relative path: ${uri}`);
            return;
          }
          // Try to find the file in any of the workspace folders
          try {
            uri = await Promise.any(
              vscode.workspace.workspaceFolders.map(async (folder) => {
                const maybeUri = vscode.Uri.joinPath(folder.uri, uri as string);
                await vscode.workspace.fs.stat(maybeUri);
                return maybeUri;
              }),
            );
          }
          catch (e) {
            vscode.window.showErrorMessage(`File not found in any workspace: ${uri}`);
            return;
          }
        }
        else {
          try {
            uri = vscode.Uri.file(uri as string);
            await vscode.workspace.fs.stat(uri);
          } catch (e) {
            vscode.window.showErrorMessage(`File not found: ${uri}`);
            return;
          }
        }
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
