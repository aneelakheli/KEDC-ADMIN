import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Event } from '@/types/event';

export const getAllEvents = async () => {
    try {
        const response = await get('/upcommingevent/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneEvent = async (id: string) => {
    try {
        const response = await get(`/upcommingevent/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addEvent = async (eventData: Event) => {
    try {
        const response = await post('/upcommingevent/', eventData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateEvent = async (id: string, eventData: Event) => {
    try {
        const response = await patch(`/upcommingevent/${id}`, eventData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteEvent = async (id: string) => {
    try {
        const response = await del(`/upcommingevent/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
