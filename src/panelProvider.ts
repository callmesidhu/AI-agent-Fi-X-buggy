import * as vscode from "vscode";

export class FixbuggyPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "fixbuggy.panel";
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = view;
    view.webview.options = { enableScripts: true };

    const htmlUri = vscode.Uri.joinPath(this.context.extensionUri, "media", "panel.html");
    vscode.workspace.fs.readFile(htmlUri).then((data) => {
      view.webview.html = Buffer.from(data).toString("utf8");
    });
  }

  public updateContent(message: string) {
    this._view?.show?.(true);
    this._view?.webview.postMessage({ explanation: message });
  }
}
