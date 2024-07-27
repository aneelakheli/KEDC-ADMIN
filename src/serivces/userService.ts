import { get, post, put, del } from '@/serivces/apiClient';

export const getAllUsers = async () => {
    try{
        const response = await get('/user/');
        return response;
    }
    catch(error){
        throw error;
    }
}