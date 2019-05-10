"use strict";
import { ExtensionContext, commands } from "vscode";
import { Slack } from "./Slack";
import { Settings } from "./Settings";

export function activate(context: ExtensionContext) {
    let slack = new Slack();
    context.subscriptions.push(
        commands.registerCommand("slack.sendMessage", () => slack.sendMessage()),
        commands.registerCommand("slack.sendSelection", () => slack.sendSelection()),
        commands.registerCommand("slack.sendCodeSnippet", () => slack.sendCodeSnippet()),
        commands.registerCommand("slack.uploadOpenFile", file => slack.uploadOpenFile(file)),
        commands.registerCommand("slack.uploadSelectedFile", file => slack.uploadSelectedFile(file)),
        commands.registerCommand("slack.setSnooze", () => slack.setSnooze()),
        commands.registerCommand("slack.endSnooze", () => slack.endSnooze()),
        commands.registerCommand("slack.dndInfo", () => slack.dndInfo())
    );
    let settings = new Settings(slack);
    context.subscriptions.push(slack);
    context.subscriptions.push(settings);
}
// this method is called when your extension is deactivated
export function deactivate() { }
