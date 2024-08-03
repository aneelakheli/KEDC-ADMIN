import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Catalogue } from '@/types/catalogue';

export const getAllFreeCatalogues = async () => {
    try {
        const response = await get('/catalogue/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllPremiumCatalogues = async () => {
    try {
        const response = await get('/catalogue/premium/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getOneCatalogue = async (id: string) => {
    try {
        const response = await get(`/catalogue/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addCatalogue = async (catalogueData: Catalogue) => {
    try {
        console.log(catalogueData);
        const response = await post('/catalogue/', catalogueData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateCatalogue = async (id: string, catalogueData: Catalogue) => {
    try {
        const response = await patch(`/catalogue/${id}`, catalogueData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteCatalogue = async (id: string) => {
    try {
        const response = await del(`/catalogue/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
