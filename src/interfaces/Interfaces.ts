export interface Result {
    ok: boolean;
    error?: string;
}
export interface Conversation {
    id: string;
    label: string;
    description: string;
}
export interface ConversationsResponse extends Result {
    channels: any[];
    responseMetadata: object;
}
export interface FileResponse extends Result {
    file: object;
}
export interface MessageResponse extends Result {
    channel: string;
    ts: number;
    message: object;
}
export interface SnoozeResponse extends Result {
    snooze_enabled?: boolean;
    snooze_endtime?: number;
    snooze_remaining?: number; //seconds
    dnd_enabled?: boolean;
    next_dnd_start_ts?: number;
    next_dnd_end_ts?: number;
}
export interface UsersResponse extends Result {
    members: any[];
    cache_ts: number;
    responseMetadata: object;
}
