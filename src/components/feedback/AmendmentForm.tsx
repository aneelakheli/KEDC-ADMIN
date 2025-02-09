'use client'

import { useQuery } from "@tanstack/react-query";
import { addAmendment, getOneAmendment, updateAmendment } from '@/serivces/amendmentService';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import ReactQuill from "react-quill";
import notify from "@/utils/notify";
import { Event } from "@/types/event";
import { Amendment, IAmendmentForm } from "@/types/amendment";

interface AmendmentErrors {
    title?: string,
    pageNo?: string,
    description?: string,
    misconstrue?: string,
    amendment?: string,
    bookId?: string,
}

function AmendmentForm() {
    const router = useRouter();
    const params = useSearchParams();
    const amendmentId = params.get('amendmentId');
    const bookId = params.get('bookId');
    const [isLoading, setIsLoading] = useState(false);
    const { data: amendmentData, isLoading: isQueryLoading, error: queryError, isError: isQueryError } = useQuery({
        queryKey: ['amendment', amendmentId],
        queryFn: () => getOneAmendment(amendmentId!),
        enabled: !!amendmentId,
    });

    const [formData, setFormData] = useState<IAmendmentForm>({
        title: '',
        pageNo: '',
        description: '',
        misconstrue: '',
        amendment: '',
        bookId: ''
    });

    const [errors, setErrors] = useState<AmendmentErrors>({});

    useEffect(() => {
        if (amendmentData) {
            setFormData(amendmentData);
        }
    }, [amendmentData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleDescriptionChange = (value: string) => {
        setFormData({ ...formData, description: value });
        setErrors({ ...errors, description: '' });
    };

    const validateForm = () => {
        const newErrors: AmendmentErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.pageNo) newErrors.pageNo = 'Page number is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.misconstrue) newErrors.misconstrue = 'Misconstrue is required';
        if (!formData.amendment) newErrors.amendment = 'Amendment is required';
        if (!formData.bookId) newErrors.bookId = 'Book ID is required';

        return newErrors;
    };

    const handleCreate = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setIsLoading(true);
            try {
                const response = await addAmendment(formData);
                if (response.success) {
                    notify("Amendment successfully created", "success");
                    router.push('/dashboard/amendments');
                } else {
                    notify("Failed to create amendment", "error");
                }
            } catch (error) {
                notify("Failed to create amendment", "error");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setIsLoading(true);
            try {
                const response = await updateAmendment(amendmentId!, formData);
                if (response.success) {
                    notify("Amendment successfully updated", "success");
                } else {
                    notify("Failed to update amendment", "error");
                }
            } catch (error) {
                notify("Failed to update amendment", "error");
            } finally {
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
    };

    const LoadingComponent = () => {
        return (
            <div className="w-full flex justify-center items-center my-16">
                <div className="h-48">
                    <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
                </div>
                <div className="text-xl font-semibold my-4">Loading <span className="animate-ping">...</span></div>
            </div>
        );
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {amendmentId && isQueryLoading ?
                (<LoadingComponent />) :
                (amendmentId && isQueryError) ?
                    (<ErrorComponent errorMessage={`Error fetching amendment: ${queryError.message}`} />) :
                    (<form className="max-w-full overflow-x-auto flex flex-col gap-5.5 p-6.5" onSubmit={amendmentId ? handleEdit : handleCreate}>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Amendment Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.title && <p className="text-red text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Page Number
                            </label>
                            <input
                                type="text"
                                name="pageNo"
                                placeholder="Page Number"
                                value={formData.pageNo}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.pageNo && <p className="text-red text-xs mt-1">{errors.pageNo}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
                            <ReactQuill theme="snow" value={formData.description} onChange={handleDescriptionChange} />
                            {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Misconstrue</label>
                            <textarea
                                name="misconstrue"
                                value={formData.misconstrue}
                                onChange={handleInputChange}
                                placeholder="Misconstrue..."
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                rows={3}
                            />
                            {errors.misconstrue && <p className="text-red-500 text-xs mt-2">{errors.misconstrue}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Amendment</label>
                            <textarea
                                name="amendment"
                                value={formData.amendment}
                                onChange={handleInputChange}
                                placeholder="Amendment..."
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                rows={3}
                            />
                            {errors.amendment && <p className="text-red-500 text-xs mt-2">{errors.amendment}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Book ID
                            </label>
                            <input
                                type="text"
                                name="bookId"
                                placeholder="Book ID"
                                disabled
                                value={formData.bookId}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.bookId && <p className="text-red text-xs mt-1">{errors.bookId}</p>}
                        </div>
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
                            {amendmentId ? 'Update' : 'Create'}
                        </button>
                    </form>)}
        </div>
    );
}

export default AmendmentForm;