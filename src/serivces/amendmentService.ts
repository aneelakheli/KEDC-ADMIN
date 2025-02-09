import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Amendment, IAmendmentForm } from '@/types/amendment';
import { Book } from '@/types/book';

export const getAllAmendments = async (bookId: string) => {
    try {
        const response = await get(`/bookamendment/${bookId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const addAmendment = async (payload: IAmendmentForm) => {
    try {
        const response = await post('/bookamendment/amendment/', payload, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneAmendment = async (id: string) => {
    try {
        const response = await get(`/bookamendment/amendment/${id}`);
        return response.getOneInquiry;
    } catch (error) {
        throw error;
    }
};


export const updateAmendment = async (id: string, payload: IAmendmentForm) => {
    try {
        const response = await patch(`/bookamendment/amendment/${id}`, payload, false);
        return response;
    } catch (error) {
        throw error;
    }
};


export const deleteAmendment = async (id: string) => {
    try {
        const response = await del(`/bookamendment/amendment/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
