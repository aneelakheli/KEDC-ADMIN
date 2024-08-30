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

export const getOneCatalogue = async (id: String) => {
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

export const updateCatalogue = async (id: String, catalogueData: Catalogue) => {
    try {
        const response = await patch(`/catalogue/${id}`, catalogueData, true);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteCatalogue = async (id: String) => {
    try {
        const response = await del(`/catalogue/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const postComment = async (catId: String, commentData:Comment)=>{
    try{
        const response = await post(`/comment/${catId}`,commentData, false)
        return response;
    }
    catch(error){

    }
}

export const getNewComments = async (catId: String) => {
    try {
        const response = await get(`/comment/${catId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getPublishedComments = async (catId: String) => {
    try {
        const response = await get(`/comment/published/${catId}/`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateCommentStatus = async (catId: String, commentId:String, commentData)=>{
    try{
        const response = await patch(`/comment/${catId}/approved/${commentId}`,commentData, false)
        return response;
    }
    catch(error){
        throw error;
    }
}

export const deleteComment = async (catId: String, commentId:String) => {
    try {
        const response = await del(`/comment/${catId}/${commentId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

