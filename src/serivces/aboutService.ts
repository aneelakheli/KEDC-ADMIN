import { get, post, put, patch, del } from '@/serivces/apiClient';
import { About } from '@/types/about';

export const getAllAbout = async () => {
    try {
        const response = await get('/aboutus/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneAbout = async (id: string) => {
    try {
        const response = await get(`/aboutus/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addAbout = async (aboutData: About) => {
    try {
        console.log(aboutData);
        const response = await post('/aboutus/', aboutData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateAbout = async (id: string, aboutData: About) => {
    try {
        console.log("Datum:",aboutData);
        const response = await patch(`/aboutus/${id}`, aboutData, true);
        console.log("Response ===================", response);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteAbout = async (id: string) => {
    try {
        const response = await del(`/aboutus/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
