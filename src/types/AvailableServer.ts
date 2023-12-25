import { Guild } from "discordoo";

export interface AvailableServer {
    guild: Guild
    invite: string;
    availablePlaces: number
}