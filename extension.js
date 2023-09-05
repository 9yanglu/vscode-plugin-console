// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("插件已被激活！");
  /**
   * 删除所选区域的console.xxx()
   */
  const removeConsole = vscode.commands.registerTextEditorCommand(
    "console.delete",
    () => {
      // vscode窗口对象
      const global = vscode.window;
      // vscode当前编辑页面的editor对象
      const editor = global.activeTextEditor;

      if (!editor) {
        console.log("请选择");
        return;
      }
      // vscode文档对象
      const document = editor.document;
      // 获取用户选中的文本信息
      let txt = document.getText(editor.selection);
      // 文本信息正则替换，去掉console.xxx()
      txt = txt.replace(/\s+console.(log|info|error|tabel)\((.*)\);?/g, "");
      // 替换后的文本在编辑器里生效
      editor.edit((edit) => {
        edit.replace(editor.selection, txt);
      });
      // 弹出信息，提示删除成功
      global.showInformationMessage("已删除console");
    }
  );
  // 订阅注册命令
  context.subscriptions.push(removeConsole);
  /**
   * 在下一行插入console.log
   */
  const insertConsole = vscode.commands.registerTextEditorCommand(
    "console.insert",
    () => {
      // 获取当前编辑器
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // 没有活动编辑器
      }

      // 获取所选文本范围
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      // 获取所选文本的起始位置
      const startPosition = selection.start;

      // 插入代码段
      const insertTxt = `console.log('${selectedText}:',${selectedText});`;
      const codeToInsert = `\n${insertTxt}\n`;
      const range = new vscode.Range(selection.start, selection.end);

      editor.edit((editBuilder) => {
        editBuilder.replace(range, codeToInsert);
      });

      // 移动光标到插入代码后的位置
      const newPosition = new vscode.Position(startPosition.line, 0);
      const newSelection = new vscode.Selection(newPosition, newPosition);
      editor.selection = newSelection;
    }
  );
  context.subscriptions.push(insertConsole);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
