import type { UUID } from "crypto";

export type User = {
    id: UUID;
    username: string;
    email: string;
    profile: any;
    createdAt: Date;
    updatedAt: Date;
    doro: number;
    xp: number;
}

export type Timer = {
    end?: Date,
    setting: TimerType,
    done: boolean,
}

export enum TimerType {
    DORO,
    COOLDOWN,
}