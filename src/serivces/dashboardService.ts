import { get, post, put, patch, del } from '@/serivces/apiClient';

export const getDashbaord = async () => {
    try {
        const response = await get('/dashboard/');
        return response;
    } catch (error) {
        throw error;
    }
};