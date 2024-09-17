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
import { getAllGrades } from "@/serivces/gradeService";
import AddGradeModal from "../Grade/AddGradeModal";
import notify from "@/utils/notify";

function BookForm({ bookId }:{bookId?:string}) {
    const router = useRouter();
    const { data: bookData, isLoading: isQueryLoading, error: queryError, isError: isQueryError } = useQuery({
        queryKey: ['book', bookId],
        queryFn: () => getOneBook(bookId),
        enabled: !!bookId,
    });

    const [formData, setFormData] = useState({
        name: '',
        author: '',
        categoryId: '',
        publication: '',
        description: '',
        editor: '',
        price: '',
        gradeId: '',
        image: null,
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({});
    

    // Category(Subject) Field Options
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const toggleShowModal = () => setShowSubjectModal(!showSubjectModal)

    const { data: subjectData, isLoading: isSubjectLoading, error: subjectError, isError: isSubjectError } = useQuery({
        queryKey: ['subject'],
        queryFn: () => getAllSubjects(),
    });

    // Grade Field Options
    const [showGradeModal, setShowGradeModal] = useState(false);
    const toggleGradeModal = () => setShowGradeModal(!showGradeModal)

    const { data: gradeData, isLoading: isGradeLoading, error: gradeError, isError: isGradeError } = useQuery({
        queryKey: ['grade'],
        queryFn: () => getAllGrades(),
    });

    useEffect(() => {
        if (bookData) {
            setFormData({...bookData, gradeId:bookData.grade?._id || '', categoryId:bookData.category?._id || ''});
            console.log("data loading lkajflkdjas+++++++", bookData.grade?._id, bookData.category?._id)
        }
    }, [bookData]);

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleImageChange = (e:any)=> {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData({ ...formData, image: file, imageUrl });
            setErrors({ ...errors, image: '' });
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: null, imageUrl: '' });
    };
    

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Title is required';
        if (!formData.author) newErrors.author = 'Author is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.publication) newErrors.publication = 'Publication is required';
        if (!formData.editor) newErrors.editor = 'Editor is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (isNaN(formData.price)) newErrors.price = 'Price shoule be a valid number';
        if (!formData.gradeId) newErrors.gradeId = 'Grade is required';
        if (!formData.image) newErrors.image = 'Image is required';

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
                const response = await addBook(formData);

                if (response.success === true) {
                    console.log("Book successfully uploaded", response.data);
                    notify("Book Uploaded Successfully", "success")
                    router.push(`/books/${response.data._id}`);
                }
                else {
                    console.error("Error uploading book", response, "Data:", response.data);
                }
            }
            catch (error) {
                console.log(error, error.message || error.response || error.data);
                // console.error("Caught Error", error.response.status, error.response.data.error);
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
                const response = await updateBook(bookId, formData);
                console.log("Response status", response.success, response.success === true, response.success == true);
                if (response.success === true) {
                    console.log("Book successfully Updated");
                    notify("Book successfully Updated","success");
                }
                else {
                    console.error("Error Updating book", response.status, "Data:", response.data);
                    notify("Error Updating book","error");
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
            {bookId && isQueryLoading ?
                (<LoadingComponent />) :
                (bookId && isQueryError) ?
                    (<ErrorComponent errorMessage={`Error fetching book: ${queryError.message}`} />) :
                    (<form className="max-w-full overflow-x-auto flex flex-col gap-5.5 p-6.5" onSubmit={bookId ? handleEdit : handleCreate}>
                        <div className='flex flex-col justify-center items-center'>
                            <div className="w-full md:w-1/2 relative grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-gray-100 rounded-lg select-none">
                                <div className="rounded-l-lg p-4 bg-gray-200 flex flex-col justify-center items-center border-0 border-r border-gray-300">
                                    <label className="cursor-pointer hover:opacity-80 inline-flex items-center text-center justify-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        Select image
                                        <input id="restaurantImage" name="image" className="text-sm cursor-pointer w-36 hidden" type="file" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        remove image
                                    </button>
                                </div>
                                <div className="relative order-first md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover" style={{ backgroundImage: `url(${formData.imageUrl || formData.image || ''})` }}>
                                    {!formData.imageUrl && !formData.image && (
                                        <span className="text-gray-400 opacity-75">
                                            <svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.7" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </div>
                            {errors.image && <p className="text-red text-xs mt-1">{errors.image}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Book Title"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.name && <p className="text-red text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Author"
                                value={formData.author}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.author && <p className="text-red text-xs mt-1">{errors.author}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Subject
                            </label>
                            <div className="flex items-center gap-2">
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-4/5 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select Subject</option>
                                    {subjectData?.data?.map((subject:any, key:string) =>
                                        <option value={subject._id} key={key}>{subject.name}</option>
                                    )}
                                </select>
                                <Tooltip content="Add New Category" className="">
                                    <button type="button" className="h-12 bg-red p-1 px-2 text-white rounded-md" onClick={() => toggleShowModal()}>
                                        <FaPlus className="text-lg" />
                                    </button>
                                </Tooltip>
                            </div>

                            {errors.categoryId && <p className="text-red text-xs mt-1">{errors.categoryId}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Publication
                            </label>
                            <input
                                type="text"
                                name="publication"
                                placeholder="Publication"
                                value={formData.publication}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.publication && <p className="text-red text-xs mt-1">{errors.publication}</p>}
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
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Grade
                            </label>
                            <div className="flex items-center gap-2">
                                <select
                                    name="gradeId"
                                    value={formData.gradeId}
                                    onChange={handleInputChange}
                                    className="w-4/5 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select Grade</option>
                                    {gradeData?.data?.map((grade:any, key:string) =>
                                        <option value={grade._id}>{grade.name}</option>
                                    )}
                                </select>
                                <Tooltip content="Add New Grade" className="">
                                    <button type="button" className="h-12 bg-red p-1 px-2 text-white rounded-md" onClick={() => toggleGradeModal()}>
                                        <FaPlus className="text-lg" />
                                    </button>
                                </Tooltip>
                            </div>

                            {errors.gradeId && <p className="text-red text-xs mt-1">{errors.gradeId}</p>}
                        </div>

                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Editor
                            </label>
                            <input
                                type="text"
                                name="editor"
                                placeholder="Editor"
                                value={formData.editor}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.editor && <p className="text-red text-xs mt-1">{errors.editor}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Rs."
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.price && <p className="text-red text-xs mt-1">{errors.price}</p>}
                        </div>
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
                            {bookId ? 'Update' : 'Create'}
                        </button>
                    </form>)}
            <AddSubjectModal showModal={showSubjectModal} toggleShowModal={toggleShowModal} />
            <AddGradeModal showModal={showGradeModal} toggleShowModal={toggleGradeModal} />

        </div>
    );
}

export default BookForm;
