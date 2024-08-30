import { postComment } from '@/serivces/catalogueService';
import notify from '@/utils/notify';
import React, { useState } from 'react'

function CommentForm({ catalogueId }: { catalogueId: String }) {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        errors: {}
    })
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required ';
        if (!formData.description) newErrors.description = 'Description is required';
        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        else {
            try {
                const response = await postComment(catalogueId, formData);
                if (response.success === true) {
                    console.log("Comment saved!", response.data);
                    notify("Comment saved", "success");
                }
                else {
                    console.error("Error posting comment", response, "Data:", response.data);
                }
            }
            catch (error) {
                console.error("Caught Error", error.response.status, error.response.data.error);
                return;
            }
            finally {
                setIsLoading(false);
            }

        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Post a Comment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Comment Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.title && <p className="text-red text-xs mt-1">{errors.title}</p>}
                </div>
                <div className="my-4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Comment Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 text-gray-900 border-stroke dark:text-white bg-gray-100 rounded border border-gray-300 dark:border-gray-700" />
                </div>
                {isLoading ? (
                    <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                        Post
                    </button>
                ) : (
                    <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
                        Post
                    </button>
                )}
            </form>
        </div>
    )
}

export default CommentForm