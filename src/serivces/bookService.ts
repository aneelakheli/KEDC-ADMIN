import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Book } from '@/types/book';

export const getAllBooks = async () => {
    try {
        const response = await get('/book/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneBook = async (id: string) => {
    try {
        const response = await get(`/book/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addBook = async (bookData: Book) => {
    try {
        console.log(bookData);
        const response = await post('/book/', bookData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateBook = async (id: string, bookData: Book) => {
    try {
        console.log("Datum:",bookData);
        const response = await patch(`/book/${id}`, bookData, true);
        console.log("Response ===================", response);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteBook = async (id: string) => {
    try {
        const response = await del(`/book/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
