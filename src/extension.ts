import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('p5-project-creator.createP5Project', async () => {
		let data = await vscode.window.showInputBox({
			placeHolder: "Project Name"
		});

		if (vscode.workspace.workspaceFolders && data) {
			const jsfile = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "/sketch.js");
			const htmlfile = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "/index.html");
			const edit = new vscode.WorkspaceEdit();
			let canGo: boolean = true;

			if (fs.existsSync(jsfile.fsPath)) {
				vscode.window.showErrorMessage("sketch.js already exists in current workspace!");
				canGo = false;
			}

			if (fs.existsSync(htmlfile.fsPath)) {
				vscode.window.showErrorMessage("index.html already exists in current workspace!");
				canGo = false;
			}

			if (canGo) {
				edit.createFile(jsfile, { ignoreIfExists: true, overwrite: false });
				edit.insert(jsfile, new vscode.Position(0, 0), "function setup() {\n\tcreateCanvas(400, 400);\n}\n\nfunction draw() {\n\n}\n");

				edit.createFile(htmlfile, { ignoreIfExists: true, overwrite: false });
				edit.insert(htmlfile, new vscode.Position(0, 0), "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"utf-8\">\n\t<title>" + `${data}` + "</title>\n\n\t<script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.js\"></script>\n\n</head>\n\n<body>\n\t<script src=\"sketch.js\"></script>\n</body>\n\n</html>\n");

				vscode.workspace.applyEdit(edit);

				await new Promise(resolve => setTimeout(resolve, 500));

				vscode.workspace.saveAll();

				vscode.window.showInformationMessage("Project Creation Complete");
			}
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
