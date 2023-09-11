import * as vscode from "vscode";
import { SpeedscopeEditorProvider } from "@src/editor-provider";
import { Commands } from "@src/commands";
import { PublicApi } from "@src/common";

export function activate(context: vscode.ExtensionContext) {
  const api = new PublicApi();

  context.subscriptions.push(SpeedscopeEditorProvider.register(context, api));

  context.subscriptions.push(Commands.registerOpenSpeedscope(context, api));

  return api;
}
