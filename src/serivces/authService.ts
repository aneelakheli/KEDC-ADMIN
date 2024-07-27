import { get, post, put, del } from '@/serivces/apiClient';

interface RegisterUserPayload {
    email: string;
    fullName: string;
    password: string;
    contactNo: string;
    schoolName: string;
    role: string;
}

export const registerUser = async (payload:RegisterUserPayload) => {
    try{
        console.log(payload);
        const response = await post('/user/register',payload);
        return response;
    }
    catch(error){
        throw error;
    }
}

interface LoginUserPayload {
    email: string;
    password: string;
}

export const loginUser = async (payload:LoginUserPayload) => {
    try{
        console.log(payload);
        const response = await post('/user/login',payload);
        return response;
    }
    catch(error){
        throw error;
    }
}