import { User } from "./user";

export type Forum = {
    _id?:string;
    title: string;
    description: string;
    subject: string;
    image?: string[];
    imageUrl: string[];
    alt?: string;
    user?: User | string;
}