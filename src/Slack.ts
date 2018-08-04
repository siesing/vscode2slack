"use strict";
import { workspace, window } from "vscode";
import { ApiUrls } from "./enums/ApiUrls";
import { ApiService } from "./ApiService";
import { Result, Workspace } from "./interfaces/Interfaces";
import { Messages } from "./enums/Messages";
import { SetStatusBarMessage } from "./SetStatusBarMessage";
import * as fs from "fs";

export class Slack {
  private api: ApiService;
  private status: SetStatusBarMessage;
  private token: string;
  private workspaces: Workspace[];
  private workspace: Workspace;

  public async sendMessage(): Promise<void> {
    if (!this.isTokenPresent()) {
      return;
    }

    window
      .showInputBox({ placeHolder: Messages.MessagePlaceHolder })
      .then(async message => {
        if (message) {
          if (message.length > 40000) {
            this.status.setInfoMessage(Messages.MessageTooLong);
            return;
          }

          const data = {
            text: message,
            ...(await this.getWorkspace())
          };
          this.chooseAction(ApiUrls.PostText, data);
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

      const data = {
        text: selectedText,
        ...(await this.getWorkspace())
      };
      this.chooseAction(ApiUrls.PostText, data);
    } else {
      this.status.setInfoMessage(Messages.InfoNoTextSelected);
    }
  }

  public async setSnooze(): Promise<void> {
    if (!this.isTokenPresent()) {
      return;
    }

    window
      .showInputBox({ placeHolder: Messages.SnoozePlaceHolder })
      .then(async minutes => {
        if (Number(minutes)) {
          if (Number(minutes) > 1440) {
            return;
          }

          const data = {
            num_minutes: minutes,
            ...(await this.getWorkspace())
          };

          this.chooseAction(ApiUrls.SetSnooze, data);
        } else {
          this.status.setInfoMessage(Messages.InfoSnooze);
        }
      });
  }

  public async endSnooze(): Promise<void> {
    if (!this.isTokenPresent()) {
      return;
    }
    this.chooseAction(ApiUrls.EndSnooze, await this.getWorkspace());
  }

  public async dndInfo() {
    if (!this.isTokenPresent()) {
      return;
    }

    this.chooseAction(ApiUrls.DndInfo, await this.getWorkspace());
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
    this.workspace = config.get("workspace");
    this.workspaces = config.get("workspaces");

    if (this.isTokenPresent()) {
      const actionNotificationDisplayTime: number = config.get(
        "actionNotificationDisplayTime",
        5000
      );

      if (this.api || this.status) {
        this.api = null;
        this.status = null;
      }

      this.api = new ApiService();
      this.status = new SetStatusBarMessage(actionNotificationDisplayTime);
    }
  }

  private async getWorkspace(): Promise<Workspace> {
    let workspace: Workspace = {
      token: "",
      includedChannels: [],
      includedUsers: []
    };

    if (this.workspace) {
      workspace = this.workspace;
    } else if (this.token) {
      workspace.token = this.token;
    } else if (this.workspaces.length === 1) {
      workspace = this.workspaces[0];
    } else {
      await window
        .showQuickPick(await this.api.getTeams(this.workspaces), {
          matchOnDescription: true,
          placeHolder: Messages.SelectWorkspacePlaceHolder
        })
        .then(team => {
          if (!team) {
            return {};
          }

          workspace = team.workspace;
        });
    }
    return workspace;
  }

  private async chooseAction(apiUrl: ApiUrls, data: any): Promise<void> {
    if (apiUrl === ApiUrls.PostText || apiUrl === ApiUrls.UploadFiles) {
      this.pickChannel(apiUrl, data);
    } else {
      this.post(apiUrl, data);
    }
  }

  private async pickChannel(apiUrl: ApiUrls, data: any): Promise<void> {
    window
      .showQuickPick(
        await this.api.getChannelList({
          token: data.token,
          includedChannels: data.includedChannels,
          includedUsers: data.includedUsers
        }),
        {
          matchOnDescription: true,
          placeHolder: Messages.SelectChannelPlaceHolder
        }
      )
      .then(channel => {
        if (!channel) {
          return;
        }

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
      case ApiUrls.SetSnooze:
        result = await this.api.snooze(ApiUrls.SetSnooze, data);
        break;
      case ApiUrls.EndSnooze:
        result = await this.api.snooze(ApiUrls.EndSnooze, data);
        break;
      case ApiUrls.DndInfo:
        result = await this.api.snooze(apiUrl, data);
        break;
    }

    this.status.setStatusMessage(apiUrl, result);
  }

  private async postFile(filenameWithPath: string): Promise<void> {
    if (this.checkFilesizeInBytes(filenameWithPath)) {
      const fileName = filenameWithPath.substring(
        filenameWithPath.lastIndexOf("\\") + 1
      );
      const file = fs.createReadStream(filenameWithPath);
      const data = {
        filename: fileName,
        file: file,
        ...(await this.getWorkspace())
      };

      this.chooseAction(ApiUrls.UploadFiles, data);
    } else {
      this.status.setInfoMessage(Messages.InfoFileEmpty);
    }
  }

  private isTokenPresent(): boolean {
    if (!this.token && this.workspaces.length < 1) {
      window.showErrorMessage(Messages.SlackTokenError);
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
