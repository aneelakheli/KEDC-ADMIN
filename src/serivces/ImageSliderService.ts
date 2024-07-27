import { get, post, put, patch, del } from '@/serivces/apiClient';
import { SliderImage } from '@/types/sliderImage';

export const getAllImages = async () => {
    try {
        const response = await get('/sliderimage/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneImage = async (id: string) => {
    try {
        const response = await get(`/sliderimage/${id}`);
        return response.getOneInquiry;
    } catch (error) {
        throw error;
    }
};


export const addImage = async (imageData: SliderImage) => {
    try {
        const response = await post('/sliderimage/', imageData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteImage = async (id: string) => {
    try {
        console.log("Deleting image", id);
        const response = await del(`/sliderimage/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
