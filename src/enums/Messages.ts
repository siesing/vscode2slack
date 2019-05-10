export enum Messages {
    SuccessPostMessage = "$(comment-discussion) Message posted!",
    SuccessFileUpload = "$(cloud-upload) File uploaded!",
    SuccessContentSnippet = "$(cloud-upload) Content Snippet posted!",
    SuccessSetSnooze = "$(clock) Snooze time set!",
    SuccessEndSnooze = "$(clock) Snooze time ended!",
    FailedPostMessage = "$(alert) Post message failed! | Slack Error:",
    FailedFileUpload = "$(alert) File upload failed! | Slack Error: ",
    FailedContentSnippet = "$(alert) Content snippet post failed! | Slack Error: ",
    FailedSetSnooze = "$(alert) Failed to set snooze time! | Slack Error:",
    FailedEndSnooze = "$(alert) Failed to end snooze time! | Slack Error:",
    InfoSnooze = "$(stop) Please enter an Integer value.",
    InfoSelectionTooLong = "$(stop) The selected text is too long (Max 40.000 characters). Consider sending a file instead.",
    MessageTooLong = "$(stop) The message text is too long (Max 40.000 characters).",
    InfoFileEmpty = "$(stop) The file is empty.",
    InfoNoTextSelected = "$(stop) No text is selected",
    MessagePlaceHolder = "Enter Message",
    SnoozePlaceHolder = "Snooze Slack for x Minutes. Max is 1440 (i.e. 24h).",
    SlackTokenError = "Please enter Slack token(s) to use this extension.",
    SelectChannelPlaceHolder = "Select #channel, #group or @user",
    SelectWorkspacePlaceHolder = "Select a Workspace"
}
