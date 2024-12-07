'use client'

import { useQuery } from "@tanstack/react-query";
import { addBook, updateBook } from '@/serivces/bookService';
import React, { useState, useEffect } from 'react';
import { getOneBook } from '@/serivces/bookService';
import { useRouter } from 'next/navigation';
import { getAllSubjects } from "@/serivces/subjectService";
import { FaPlus } from "react-icons/fa";
import AddSubjectModal from "../Subject/AddSubjectModal";
import Tooltip from "../Tooltip";
import notify from "@/utils/notify";
import { addForum, addForumReply, getOneForum } from "@/serivces/forumService";
import Image from "next/image";

function ForumForm({ forumId }: { forumId: string }) {
    const router = useRouter();
    // const { data: forumData, isLoading: isQueryLoading, error: queryError, isError: isQueryError } = useQuery({
    //     queryKey: ['forum', forumId],
    //     queryFn: () => getOneForum(forumId),
    //     enabled: !!forumId,
    // });

    const [changed, setChanged] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: [],
        imageUrl: [],
        alt: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({});


    // Category(Subject) Field Options
    // const [showSubjectModal, setShowSubjectModal] = useState(false);
    // const toggleShowModal = () => setShowSubjectModal(!showSubjectModal)

    // const { data: subjectData, isLoading: isSubjectLoading, error: subjectError, isError: isSubjectError } = useQuery({
    //     queryKey: ['subject'],
    //     queryFn: () => getAllSubjects(),
    // });

    // Grade Field Options
    // const [showGradeModal, setShowGradeModal] = useState(false);
    // const toggleGradeModal = () => setShowGradeModal(!showGradeModal)

    // useEffect(() => {
    //     if (forumData) {
    //         setFormData({ ...forumData, gradeId: forumData.grade?._id || '', subject: forumData.category?._id || '' });
    //         console.log("data loading lkajflkdjas+++++++", forumData.grade?._id, forumData.category?._id)
    //         setChanged(false);
    //     }
    // }, [forumData]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setChanged(true);
    };

    const handleImageChange = (e: any) => {
        console.log("Image Home", formData.image?.length > 0 && formData.image[0]);
        const file = e.target.files[0];
        if (file && !(formData?.image?.includes(file))) {
            const imageUrl = URL.createObjectURL(file);
            setFormData({ ...formData, image: [...formData.image, file], imageUrl: [...formData.imageUrl, imageUrl] });
            setErrors({ ...errors, image: '' });
            setChanged(true);
        }

    };

    const handleRemoveImageUrl = (urlToRemove: string) => {
        console.log(formData, "Removing URL=========", urlToRemove);
        setFormData({ ...formData, imageUrl: formData.imageUrl.filter(url => url !== urlToRemove), image: formData.image.filter((img, index) => img) });
        setChanged(true);
    };

    const handleRemoveAllImages = () => {
        setFormData({ ...formData, image: [], imageUrl: [] });
        setChanged(true);

    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';

        return newErrors;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        else {
            try {
                console.log("Forum Data", formData);
                const response = await addForumReply(forumId,formData);
                if (response.success === true) {
                    notify("Forum Uploaded Successfully", "success")
                    router.push(`/forum/${response.data._id}`);
                }
                else {
                    console.error("Error posting reply", response, "Data:", response.data);
                }
            }
            catch (error) {
                notify(error.response.data.error, "error")
                // console.error("Caught Error", error.response.status, error.response.data.error);
                return;
            }
            finally {
                setIsLoading(false);
            }

        }
    };

    // const handleEdit = async (e) => {
    //     e.preventDefault();
    //     const newErrors = validateForm();
    //     if (Object.keys(newErrors).length > 0) {
    //         setErrors(newErrors);
    //         return;
    //     }
    //     else {
    //         try {
    //             const response = await updateBook(forumId, formData);
    //             console.log("Response status", response.success, response.success === true, response.success == true);
    //             if (response.success === true) {
    //                 console.log("Forum successfully Updated");
    //                 notify("Forum successfully Updated", "success");
    //             }
    //             else {
    //                 console.error("Error Updating book", response.status, "Data:", response.data);
    //                 notify("Error Updating book", "error");
    //             }
    //         }
    //         catch (error) {
    //             console.error("Caught Error", error.response.status, error.response.data.error);
    //             return;
    //         }
    //         finally {
    //             setIsLoading(false);
    //         }

    //     }
    // };

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
        <div className="rounded-lg mt-4 border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {(forumId) &&
                (<form className="max-w-full overflow-x-auto flex flex-col gap-5.5 p-6.5" onSubmit={handleCreate}>
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Reply Title"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.title && <p className="text-red text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            rows="3"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <div className="w-full relative grid grid-cols-1 min-h-96 border border-gray-300 bg-gray-100 rounded-lg select-none p-4">
                            <div className="relative min-h-32 h-auto border border-black border-dashed w-full rounded-md grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                                {/* {
                                    formData?.images?.length > 0 && formData?.images?.map((image) => (
                                        <div className="flex justify-center items-center">
                                            <div className="relative w-40 h-32 sm:w-48 sm:h-36 md:w-60 md:h-48 p-4 z-10 text-danger bg-danger" >
                                                <div className="p-1 border-white border justify-center items-center bg-[rgba(255,255,255,0.5)] absolute z-50 left-1 top-1">x</div>
                                                <Image src={image} fill={true} alt="forum image" /></div>
                                        </div>
                                    ))
                                } */}

                                {
                                    formData?.imageUrl?.length > 0 && formData?.imageUrl?.map((image) => (
                                        <div className="flex justify-center items-center">
                                            <div className="relative w-40 h-32 sm:w-48 sm:h-36 md:w-60 md:h-48 p-4 z-10 text-danger bg-danger">
                                                <div className="p-1 border-white border justify-center items-center bg-[rgba(255,255,255,0.5)] absolute z-50 left-1 top-1" onClick={() => handleRemoveImageUrl(image)}>x</div>
                                                <Image src={image} fill={true} alt="forum image" /></div>
                                        </div>
                                    ))
                                }

                            </div>
                            <div className="rounded-l-lg p-2 bg-gray-200 flex flex-col justify-center items-center border-gray-300">
                                <label className="cursor-pointer hover:opacity-80 inline-flex items-center text-center justify-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                    Select images
                                    <input id="restaurantImage" name="image" className="text-sm cursor-pointer w-36 hidden" type="file" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <button
                                    type="button"
                                    onClick={handleRemoveAllImages}
                                    className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                    remove all images
                                </button>
                            </div>

                        </div>
                        {errors.image && <p className="text-red text-xs mt-1">{errors.image}</p>}
                    </div>
                    <div>
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Image Alternative Text
                        </label>
                        <input
                            type="text"
                            name="alt"
                            placeholder="Conversation Title"
                            value={formData.alt}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.alt && <p className="text-red text-xs mt-1">{errors.alt}</p>}
                    </div>
                    <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
                        {'Post Reply'}
                    </button>
                </form>)}
            {/* <AddSubjectModal showModal={showSubjectModal} toggleShowModal={toggleShowModal} /> */}

        </div>
    );
}

export default ForumForm;
