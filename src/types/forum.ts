import { Category } from "./category";
import { User } from "./user";

export type Forum = {
    _id?:string;
    title: string;
    description: string;
    subject: Category;
    image?: string[];
    imageUrl: string[];
    alt?: string;
    user?: User | string;
}


export type ResponseForum = {
    _id:string;
    title: string;
    description: string;
    subject: Category;
    image?: string[];
    imageUrl: string[];
    alt?: string;
    user?: User | string;
    isPublished:false;
}