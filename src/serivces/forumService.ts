import { get, post, put, patch, del } from '@/serivces/apiClient';
import { Forum, ForumReply } from '@/types/forum';

// Get all published forums
export const getAllPublishedForums = async () => {
    try {
        const response = await get('/forum/published');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all unpublished forums
export const getAllUnpublishedForums = async () => {
    try {
        const response = await get('/forum/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get one forum by ID
export const getOneForum = async (id: string) => {
    try {
        const response = await get(`/forum/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add a new forum post
export const addForum = async (forumData: Forum) => {
    try {
        const formData = new FormData();
        formData.append('title', forumData.title);
        formData.append('description', forumData.description);
        formData.append('subject', forumData.subject);
        if (forumData.image) {
            forumData.image?.forEach((file: File | string) => formData.append('image', file));
        }
        const response = await post('/forum/', formData, false, true);  // true for multipart/form-data
        return response;
    } catch (error) {
        throw error;
    }
};

// Update a forum post
export const updateForum = async (id: string, forumData: Forum) => {
    try {
        const formData = new FormData();
        formData.append('title', forumData.title);
        formData.append('description', forumData.description);
        formData.append('subject', forumData.subject);
        if (forumData.image) {
            forumData.image?.forEach((file: File | string) => formData.append('image', file));
        }

        const response = await patch(`/forum/${id}`, formData, false, true);  // true for multipart/form-data
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete a forum post
export const deleteForum = async (id: string) => {
    try {
        const response = await del(`/forum/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add a reply to a forum post
export const addForumReply = async (forumId: string, replyData: ForumReply) => {
    try {
        const formData = new FormData();

        formData.append('title', replyData.title);
        formData.append('description', replyData.description);
        if (replyData.image) {
            replyData.image?.forEach((file: File | string) => formData.append('image', file));
        }

        const response = await post(`/forum/${forumId}/replies`, formData, false, true);  // true for multipart/form-data
        return response;
    } catch (error) {
        throw error;
    }
};

// Get all replies for a forum post
export const getAllForumReplies = async (forumId: string) => {
    try {
        const response = await get(`/forum/${forumId}/replies`);
        console.log("Forum Replies Response +++++++++", response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update a forum reply
export const updateForumReply = async (forumId: string, replyId: string, replyData: ForumReply) => {
    try {
        const formData = new FormData();
        formData.append('title', replyData.title);
        formData.append('description', replyData.description);

        if (replyData.image) {
            replyData.image.forEach((file: File) => formData.append('image', file));
        }

        const response = await patch(`/forum/${forumId}/replies/${replyId}`, formData, false, true);  // true for multipart/form-data
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete a forum reply
export const deleteForumReply = async (forumId: string, replyId: string) => {
    try {
        const response = await del(`/forum/${forumId}/replies/${replyId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
