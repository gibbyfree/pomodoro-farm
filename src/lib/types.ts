import type { UUID } from "crypto";

export type User = {
    id: UUID;
    username: string;
    email: string;
    profile: any;
    createdAt: Date;
    updatedAt: Date;
}