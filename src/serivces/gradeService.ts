import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Grade } from '@/types/grade';

export const getAllGrades = async () => {
    try {
        const response = await get('/grade/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneGrade = async (id: string) => {
    try {
        const response = await get(`/grade/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addGrade = async (gradeData: Grade) => {
    try {
        console.log(gradeData);
        const response = await post('/grade/', gradeData, false);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateGrade = async (id: string, gradeData: Grade) => {
    try {
        console.log("Datum:",gradeData);
        const response = await patch(`/grade/${id}`, gradeData, false);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteGrade = async (id: string) => {
    try {
        const response = await del(`/grade/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
