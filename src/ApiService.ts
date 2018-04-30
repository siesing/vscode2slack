import { Conversation, ConversationsResponse, FileResponse, MessageResponse, SnoozeResponse, UsersResponse } from "./interfaces/Interfaces";
import { ApiUrls } from "./enums/ApiUrls";
import * as superagent from "superagent";

export class ApiService {
    public async postText(apiUrl: ApiUrls, data: any): Promise<MessageResponse> {
        try {
            const result = await superagent
                .post(ApiUrls.BaseUrl + apiUrl)
                .set("Content-Type", "application/json; charset=utf-8")
                .set("Authorization", "Bearer " + data.token)
                .send(data);

            const response: MessageResponse = JSON.parse(result.text);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async postFile(apiUrl: ApiUrls, data: any): Promise<FileResponse> {
        try {
            const result = await superagent
                .post(ApiUrls.BaseUrl + apiUrl)
                .field("token", data.token)
                .field("filetype", "auto")
                .field("channels", data.channel)
                .field("filename", data.filename)
                .attach("file", data.file);

            const response: FileResponse = JSON.parse(result.text);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async snooze(apiUrl: ApiUrls, data: any): Promise<SnoozeResponse> {
        try {
            let methodUrl = "";
            switch (apiUrl) {
                case ApiUrls.SetSnooze:
                    methodUrl = ApiUrls.SetSnooze;
                    break;
                case ApiUrls.EndSnooze:
                    methodUrl = ApiUrls.EndSnooze;
                    break;
                case ApiUrls.DndInfo:
                    methodUrl = ApiUrls.DndInfo;
                    break;
                default:
                    break;
            }

            const result = await superagent
                .get(ApiUrls.BaseUrl + methodUrl)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .query(data);

            const response: SnoozeResponse = JSON.parse(result.text);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async getChannelList(data: any): Promise<Conversation[]> {
        const channelList: Conversation[] = [];

        try {
            const conversationsPromise = superagent
                .get(ApiUrls.BaseUrl + ApiUrls.Conversations)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .query({
                    token: data.token,
                    exclude_archived: "true",
                    types: "public_channel, private_channel, mpim"
                });

            const usersPromise = superagent
                .get(ApiUrls.BaseUrl + ApiUrls.Users)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .query({
                    token: data.token
                });

            const [conversationsResponse, usersResponse] = await Promise.all([conversationsPromise, usersPromise]);

            let conversations: ConversationsResponse = JSON.parse(conversationsResponse.text);
            let users: UsersResponse = JSON.parse(usersResponse.text);

            if (conversations.ok && conversations.channels.length > 0) {
                //Sort the public and private channels from a-z
                const regularChannels: any[] = conversations.channels
                    .filter(x => x.is_group === false)
                    .sort((a, b) => a.name.localeCompare(b.name));
                const npims: any[] = conversations.channels.filter(x => x.is_group === true);
                const sortedChannels = regularChannels.concat(npims);

                sortedChannels.forEach(channel => {
                    channelList.push({
                        id: channel.id,
                        label: `#${channel.name}`,
                        description: channel.topic.value
                    });
                });
            }

            if (users.ok !== false && users.members.length > 0) {
                const notDeactivatedUsers: any[] = users.members.filter(user => user.deleted !== true);
                notDeactivatedUsers.forEach(user => {
                    channelList.push({
                        id: user.id,
                        label: `@${user.profile.display_name}`,
                        description: user.profile.real_name
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }

        return channelList;
    }
}
