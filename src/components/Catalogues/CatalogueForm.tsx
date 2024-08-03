'use client'

import { useQuery } from "@tanstack/react-query";
import { addBook, updateBook } from '@/serivces/bookService';
import React, { useState, useEffect } from 'react';
import { getOneBook } from '@/serivces/bookService';
import { useRouter } from 'next/navigation'
import { FaRegFileAlt } from "react-icons/fa";
import { addCatalogue } from "@/serivces/catalogueService";

function CatalogueForm({ catalogueId }) {
    const router = useRouter();
    const { data: catalogueData, isLoading: isQueryLoading, error: queryError, isError: isQueryError } = useQuery({
        queryKey: ['catalogue', catalogueId],
        queryFn: () => getOneBook(catalogueId),
        enabled: !!catalogueId,
    });

    const [formData, setFormData] = useState({
        alt: '',
        type: '',
        catalogue: null,
        fileUrl: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (catalogueData) {
            setFormData(catalogueData);
        }
    }, [catalogueData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setFormData({ ...formData, catalogue: file, fileUrl });
            setErrors({ ...errors, file: '' });
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, catalogue: null, fileUrl: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.alt) newErrors.alt = 'Catalogue file alternative text is required ';
        if (!formData.type) newErrors.type = 'Catalogue Type is required';
        if (!formData.catalogue) newErrors.catalogue = 'File is required';

        return newErrors;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        console.log("Adding");
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        else {
            try {
                const response = await addCatalogue(formData);
console.log('==============================');
                if (response.success === true) {
                    console.log("Catalogue successfully added", response.data);
                    router.push(`/catalogues`);
                }
                else {
                    console.error("Error uploading book", response, "Data:", response.data);
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
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        else {
            try {
                const response = await updateBook(catalogueId, formData);
                console.log("Response status", response.success, response.success === true, response.success == true);
                if (response.success === true) {
                    console.log("Book successfully Updated");
                }
                else {
                    console.error("Error Updating book", response.status, "Data:", response.data);
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
    };

    const ErrorComponent = ({ errorMessage }: { errorMessage: string }) => {
        return (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                <svg className="inline mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-11.412a.75.75 0 00-1.36 0l-3 6.5a.75.75 0 001.36.64l.784-1.697h3.433l.784 1.696a.75.75 0 001.36-.638l-3-6.5zM9.25 12a.75.75 0 101.5 0 .75.75 0 00-1.5 0z" clipRule="evenodd" />
                </svg>
                {errorMessage}
            </div>
        );
    }

    const LoadingComponent = () => {
        return (
            <div className=" w-full flex justify-center items-center my-16">
                <div className="h-48">
                    <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
                </div>
                <div className="text-xl font-semibold my-4 ">Loading <span className="animate-ping">...</span></div>
            </div>
        )
    }


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {catalogueId && isQueryLoading ?
                (<LoadingComponent />) :
                (catalogueId && isQueryError) ?
                    (<ErrorComponent errorMessage={`Error fetching book: ${queryError.message}`} />) :
                    (<form className="max-w-full overflow-x-auto flex flex-col gap-5.5 p-6.5" onSubmit={catalogueId? handleEdit:handleCreate}>
                        <div className='flex flex-col justify-center items-center'>
                            <div className="w-full md:w-1/2 relative grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-gray-100 rounded-lg select-none">
                                <div className="rounded-l-lg p-4 bg-gray-200 flex flex-col justify-center items-center border-0 border-r border-gray-300">
                                    <label className="cursor-pointer hover:opacity-80 inline-flex items-center text-center justify-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        Select file
                                        <input id="restaurantImage" name="catalogue" className="text-sm cursor-pointer w-36 hidden" type="file" onChange={handleImageChange} accept="file/*"/>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        remove file
                                    </button>
                                </div>
                                <div className="relative order-first md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover" >
                                    {(!formData.fileUrl && !formData.catalogue)? (
                                        <FaRegFileAlt className="text-gray-400 opacity-75 text-4xl"/>
                                    ):(
                                        <div className="break-all p-4">
                                            {formData.catalogue.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.catalogue && <p className="text-red text-xs mt-1">{errors.catalogue}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Alt Text
                            </label>
                            <input
                                type="text"
                                name="alt"
                                placeholder="Alt Text"
                                value={formData.alt}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.alt && <p className="text-red text-xs mt-1">{errors.alt}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Office Category
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                                <option value="">Select Category</option>
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
                            </select>
                            {errors.type && <p className="text-red text-xs mt-1">{errors.type}</p>}
                        </div>
                        
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
                            {catalogueId ? 'Update' : 'Create'}
                        </button>
                    </form>)}
        </div>
    );
}

export default CatalogueForm;
