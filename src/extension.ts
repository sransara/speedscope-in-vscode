import * as vscode from "vscode";
import { SpeedscopeEditorProvider } from "./editor-provider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(SpeedscopeEditorProvider.register(context));
}
