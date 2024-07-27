import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Contact } from '@/types/contact';

export const getAllContacts = async () => {
    try {
        const response = await get('/contactus/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneContact = async (id: string) => {
    try {
        const response = await get(`/contactus/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addContact = async (contactData: Contact) => {
    try {
        console.log(contactData);
        const response = await post('/contactus/', contactData, false);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateContact = async (id: string, contactData: Contact) => {
    try {
        console.log("Datum:",contactData);
        const response = await patch(`/contactus/${id}`, contactData, true);
        console.log("Response ===================", response);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteContact = async (id: string) => {
    try {
        const response = await del(`/contactus/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
