import * as vscode from "vscode";
import { explainError } from "./agent";
import { FixbuggyPanelProvider } from "./panelProvider";

export function activate(context: vscode.ExtensionContext) {
  const panel = new FixbuggyPanelProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(FixbuggyPanelProvider.viewType, panel)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fixbuggy.run", async () => {
      vscode.window.showInformationMessage("🤖 Agent Fi-X-buggy is running...");
      const fakeError = "TypeError: Cannot read properties of undefined (reading 'foo')";
      const explanation = await explainError(fakeError);
      panel.updateContent(explanation);
    })
  );
}
