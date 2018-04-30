import { window, Disposable } from "vscode";
import { ApiUrls } from "./enums/ApiUrls";
import { Result, SnoozeResponse } from "./interfaces/Interfaces";
import { Messages } from "./enums/Messages";
import * as moment from "moment";

export class SetStatusBarMessage {
    private disposable: Disposable;
    private readonly actionNotificationDisplayTime: number;

    constructor(actionNotificationDisplayTime: number) {
        this.actionNotificationDisplayTime = actionNotificationDisplayTime;
    }

    public setStatusMessage(apiMethod: string, result: Result): void {
        let statusbarMessage: string;
        if (result.ok) {
            switch (apiMethod) {
                case ApiUrls.PostText:
                    statusbarMessage = Messages.SuccessPostMessage;
                    break;
                case ApiUrls.UploadFiles:
                    statusbarMessage = Messages.SuccessFileUpload;
                    break;
                case ApiUrls.SetSnooze:
                    statusbarMessage = Messages.SuccessSetSnooze;
                    break;
                case ApiUrls.EndSnooze:
                    statusbarMessage = Messages.SuccessEndSnooze;
                    break;
                case ApiUrls.DndInfo:
                    statusbarMessage = this.setSnoozeMessage(result);
                    break;
                default:
                    statusbarMessage = "";
                    break;
            }
        } else {
            switch (apiMethod) {
                case ApiUrls.PostText:
                    statusbarMessage = Messages.FailedPostMessage + " " + result.error;
                    break;
                case ApiUrls.UploadFiles:
                    statusbarMessage = Messages.FailedFileUpload + " " + result.error;
                    break;
                case ApiUrls.SetSnooze:
                    statusbarMessage = Messages.FailedSetSnooze + " " + result.error;
                    break;
                case ApiUrls.EndSnooze:
                    statusbarMessage = Messages.FailedEndSnooze + " " + result.error;
                    break;
                default:
                    statusbarMessage = "";
                    break;
            }
        }
        this.showStatusBarMessage(statusbarMessage);
    }

    public setInfoMessage(message: string): void {
        this.showStatusBarMessage(message);
    }

    private setSnoozeMessage(dnd: SnoozeResponse): string {
        if (dnd.snooze_enabled) {
            let end = moment.unix(dnd.snooze_endtime);
            let now = moment();
            let timedifference = moment.duration(end.diff(now));
            let hoursDiff = timedifference.get("hours");
            let minutesDiff = timedifference.get("minutes");
            let secondsDiff = timedifference.get("seconds");

            if (hoursDiff >= 1) {
                return (
                    "Snoozing for another " + hoursDiff + " hour(s) and " + minutesDiff + " minute(s) and " + secondsDiff + " second(s)."
                );
            }
            if (minutesDiff < 1 && hoursDiff === 0) {
                return secondsDiff + " second(s) of snoozing left. Enjoy!";
            }

            if (hoursDiff < 1) {
                return "Snoozing for another " + minutesDiff + " minute(s) and " + secondsDiff + " second(s).";
            }
        } else {
            return "Snooze is not currently activated.";
        }
    }

    private showStatusBarMessage(message: string): void {
        this.disposable = window.setStatusBarMessage(message, this.actionNotificationDisplayTime);
    }

    dispose() {
        this.disposable.dispose();
    }
}
