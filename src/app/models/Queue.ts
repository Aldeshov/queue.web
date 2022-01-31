import { User } from "./User";

export interface Queue {
    title: string;
    code: number;
    owner: User;
    quantity: number;
}