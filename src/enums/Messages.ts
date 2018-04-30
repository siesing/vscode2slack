export enum Messages {
    SuccessPostMessage = "$(comment-discussion) Message posted!",
    SuccessFileUpload = "$(cloud-upload) File uploaded!",
    SuccessSetSnooze = "$(clock) Snooze time set!",
    SuccessEndSnooze = "$(clock) Snooze time ended!",
    FailedPostMessage = "$(alert) Post message failed! | Slack Error:",
    FailedFileUpload = "$(alert) File upload failed! | Slack Error: ",
    FailedSetSnooze = "$(alert) Failed to set snooze time! | Slack Error:",
    FailedEndSnooze = "$(alert) Failed to end snooze time! | Slack Error:",
    InfoSnooze = "$(stop) Please enter an Integer value.",
    InfoSelectionTooLong = "$(stop) The selected text is too long (Max 40.000 characters). Consider sending a file instead.",
    MessageTooLong = "$(stop) The message text is too long (Max 40.000 characters).",
    InfoFileEmpty = "$(stop) The file is empty.",
    InfoNoTextSelected = "$(stop) No text is selected",
    PromptMessage = "Enter Message",
    PromptSnooze = "Snooze Slack for x Minutes. Max 1440 (i.e. 24h).",
    SlackToken = "Please enter a Slack token to use this extension."
}
