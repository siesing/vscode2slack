# VS Code 2 Slack - a more personal extension

Ever felt that you're in a flow and don't want to stop coding, but you need to send someone a message or turn off notifications to stay in that flow? Ever felt the need to ask a colleague/friend a question about a certain piece of code? Look no further we've got you covered!

> **_Sends messages and files, as yourself including your user name and avatar, to users, channels and groups with full editing capabilities in Slack._**

This extension is not created by, affiliated with, or supported by Slack Technologies, Inc or by Microsoft Corp.

**Enjoy! :+1:**

*   [Features](#features)
*   [Installation](#installation)
*   [Extension Settings](#extension-settings)
*   [Keyboard Shortcuts](#keyboard-shortcuts)
*   [Screenshots](#screenshots)

## Features

Sends messages and files, as yourself including your user name and avatar, to users, channels and groups with full editing capabilities in Slack.

#### Send Messages Based On:

*   User input.
*   Text selection.

#### Uplod Files:

*   Files from File Explorer.
*   Current open file in editor.

#### Notifications:

*   Set new or change existing snooze time.
*   End snoozing of notifications.
*   Check the snooze status.

## Installation

Install by openening Visual Studio Code and press `Ctrl+Shift+X` or `Cmd+Shift+X` to open the Extensions pane.

## Extension Settings

Set your custom settings under User Settings `(File > Preferences > User Settings)` or by pressing `Ctrl+,` or `Cmd+,`.

```
"slack.token": "<your token>",
"slack.actionNotificationDisplayTime": <time in ms>
```

Settings:

*   `slack.token *(required)*` You find your token here [https://api.slack.com/custom-integrations/legacy-tokens](https://api.slack.com/custom-integrations/legacy-tokens "Get your Slack token.").
*   `slack.actionNotificationDisplayTime` Notifications display time in ms. Default is **_5000_**, i.e. 5 sec.

## Keyboard Shortcuts

| Action              | Windows  | Mac     |
| ------------------- | -------- | ------- |
| Send Message        | ctrl+u m | cmd+u m |
| Send Selection      | ctrl+u s | cmd+u s |
| Set/Change Snooze   | ctrl+u z | cmd+u z |
| End Snooze          | ctrl+u e | cmd+u e |
| Check Snooze Status | ctrl+u d | cmd+u d |

## Screenshots

Post a message.

![Usage](images/postmessage.gif)

Post a selection.

![Usage](images/postselection.gif)

Post file from File Explorer.

![Usage](images/postfile.gif)

Set and check snooze.

![Usage](images/snoozeset.gif)
