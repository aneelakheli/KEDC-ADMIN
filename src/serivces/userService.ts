import { get, post, put, del, patch } from '@/serivces/apiClient';
import {User} from "@/types/user";

export const getAllUsers = async () => {
    try{
        const response = await get('/user/');
        return response;
    }
    catch(error){
        throw error;
    }
}

export const getOneUser = async (id:string)=>{
    try{
        const response = await get(`/user/${id}`);
        return response;
    }
    catch(error){
        throw error;
    }
}

export const updateUser = async (id: string, userData: User) => {
    try {
        const response = await patch(`/user/${id}`, userData, false);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await del(`/user/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const approveUser = async (id: string, userData: User) => {
    try {
        const response = await patch(`/user/approve/${id}`, userData, false);
        return response;
    } catch (error) {
        throw error;
    }
};
