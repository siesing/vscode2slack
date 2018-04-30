import { workspace, Disposable } from "vscode";
import { Slack } from "./Slack";

export class Settings {
    private slack: Slack;
    private disposable: Disposable;

    constructor(slack: Slack) {
        this.slack = slack;
        this.disposable = workspace.onDidChangeConfiguration(this.reloadConfiguration, this);
        this.slack.updateSettings();
    }

    dispose() {
        this.disposable.dispose();
    }

    private reloadConfiguration(): void {
        this.slack.updateSettings();
    }
}
