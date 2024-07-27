import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Book } from '@/types/book';

export const getAllInquiries = async () => {
    try {
        const response = await get('/inquiry/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneInquiry = async (id: string) => {
    try {
        const response = await get(`/inquiry/${id}`);
        console.log("+++++++++++++ JInquiry response",  response );
        return response.getOneInquiry;
    } catch (error) {
        throw error;
    }
};


export const updateInquiry = async (id: string, bookData: Book) => {
    try {
        const response = await patch(`/book/${id}`, bookData, false);
        return response;
    } catch (error) {
        throw error;
    }
};


export const deleteInquiry = async (id: string) => {
    try {
        const response = await del(`/inquiry/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
