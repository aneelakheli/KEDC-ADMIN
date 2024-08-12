import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Category } from '@/types/category';

export const getAllSubjects = async () => {
    try {
        const response = await get('/category/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const addSubject = async (subjectData: Category) => {
    try {
        const response = await post('/category/', subjectData, true);
        return response;
    } catch (error) {
        throw error;
    }
};