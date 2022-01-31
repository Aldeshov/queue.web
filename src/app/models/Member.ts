import { User } from "./User";

export interface Member {
    plcae: number;
    user: User;
    active: boolean;
    comment: string;
}