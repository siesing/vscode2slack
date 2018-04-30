"use strict";
import { workspace, window } from "vscode";
import { ApiUrls } from "./enums/ApiUrls";
import { ApiService } from "./ApiService";
import { Result } from "./interfaces/Interfaces";
import { Messages } from "./enums/Messages";
import { SetStatusBarMessage } from "./SetStatusBarMessage";
import * as fs from "fs";

export class Slack {
    private api: ApiService;
    private status: SetStatusBarMessage;
    private token: string;

    public async sendMessage(): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }

        window.showInputBox({ prompt: Messages.PromptMessage }).then(message => {
            if (message) {
                if (message.length > 40000) {
                    this.status.setInfoMessage(Messages.MessageTooLong);
                    return;
                }

                const data = { text: message };
                this.pickChannel(ApiUrls.PostText, data);
            }
        });
    }

    public async sendSelection(): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }

        const editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = window.activeTextEditor.selection;
        if (!selection.isEmpty) {
            const selectedText = "```" + editor.document.getText(selection) + "```";

            if (selectedText.length > 40000) {
                this.status.setInfoMessage(Messages.InfoSelectionTooLong);
                return;
            }

            const data = { text: selectedText };
            this.pickChannel(ApiUrls.PostText, data);
        } else {
            this.status.setInfoMessage(Messages.InfoNoTextSelected);
        }
    }

    public async setSnooze(): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }

        window.showInputBox({ prompt: Messages.PromptSnooze }).then(async minutes => {
            if (Number(minutes)) {
                if (Number(minutes) > 1440) {
                    return;
                }

                const data = {
                    num_minutes: minutes,
                    token: this.token
                };

                this.status.setStatusMessage(ApiUrls.SetSnooze, await this.api.snooze(ApiUrls.SetSnooze, data));
            } else {
                this.status.setInfoMessage(Messages.InfoSnooze);
            }
        });
    }

    public async endSnooze(): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }
        this.status.setStatusMessage(ApiUrls.EndSnooze, await this.api.snooze(ApiUrls.EndSnooze, { token: this.token }));
    }

    public async dndInfo(): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }
        this.status.setStatusMessage(ApiUrls.DndInfo, await this.api.snooze(ApiUrls.DndInfo, { token: this.token }));
    }

    public async uploadSelectedFile(uri): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }
        this.postFile(uri.fsPath);
    }

    public async uploadOpenFile(uri): Promise<void> {
        if (!this.isTokenPresent()) {
            return;
        }
        this.postFile(uri.fsPath);
    }

    public updateSettings(): void {
        const config = workspace.getConfiguration("slack");
        this.token = config.get("token");

        if (this.isTokenPresent()) {
            const actionNotificationDisplayTime: number = config.get("actionNotificationDisplayTime", 5000);

            if (this.api || this.status) {
                this.api = null;
                this.status = null;
            }

            this.api = new ApiService();
            this.status = new SetStatusBarMessage(actionNotificationDisplayTime);
        }
    }

    private async pickChannel(apiUrl: ApiUrls, data: any): Promise<void> {
        window.showQuickPick(await this.api.getChannelList({ token: this.token })).then(channel => {
            if (!channel) {
                return;
            }

            data["token"] = this.token;
            data["as_user"] = "true";
            data["channel"] = channel.id;

            this.post(apiUrl, data);
        });
    }

    private async post(apiUrl: ApiUrls, data: any): Promise<void> {
        let result: Result;
        switch (apiUrl) {
            case ApiUrls.UploadFiles:
                result = await this.api.postFile(apiUrl, data);
                break;
            case ApiUrls.PostText:
                result = await this.api.postText(apiUrl, data);
                break;
        }
        this.status.setStatusMessage(apiUrl, result);
    }

    private async postFile(filenameWithPath: string): Promise<void> {
        if (this.checkFilesizeInBytes(filenameWithPath)) {
            const fileName = filenameWithPath.substring(filenameWithPath.lastIndexOf("\\") + 1);
            const file = fs.createReadStream(filenameWithPath);
            const data = {
                filename: fileName,
                file: file
            };

            this.pickChannel(ApiUrls.UploadFiles, data);
        } else {
            this.status.setInfoMessage(Messages.InfoFileEmpty);
        }
    }

    private isTokenPresent(): boolean {
        if (!this.token) {
            window.showErrorMessage(Messages.SlackToken);
            return false;
        }
        return true;
    }

    private checkFilesizeInBytes(filePath: string): boolean {
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats["size"];
        return fileSizeInBytes > 0;
    }

    dispose() {}
}
