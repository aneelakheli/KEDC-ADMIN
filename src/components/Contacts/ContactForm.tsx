'use client'

import { useQuery } from "@tanstack/react-query";
import { addBook, updateBook } from '@/serivces/bookService';
import React, { useState, useEffect } from 'react';
import { getOneBook } from '@/serivces/bookService';
import { useRouter } from 'next/navigation'
import { addContact } from "@/serivces/contactService";
import notify from "@/utils/notify";

function ContactForm({ bookId }) {
    const router = useRouter();
    const { data: contactData, isLoading: isQueryLoading, error: queryError, isError: isQueryError } = useQuery({
        queryKey: ['contact', bookId],
        queryFn: () => getOneBook(bookId),
        enabled: !!bookId,
    });

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        email: [''],
        officeCategory: '',
        managerName: '',
        contactNo: [''],
    });
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (contactData) {
            setFormData(contactData);
        }
    }, [contactData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleContactChange = (e, index) => {
        const newContacts = [...formData.contactNo];
        newContacts[index] = e.target.value;
        setFormData({ ...formData, contactNo: newContacts });
    };

    const addContactField = () => {
        setFormData({ ...formData, contactNo: [...formData.contactNo, ''] });
    };

    const handleAddEmail = () => {
        setFormData((prevData) => ({ ...prevData, email: [...prevData.email, ''] }));
    };

    const handleEmailChange = (index, value) => {
        const updatedEmails = [...formData.email];
        updatedEmails[index] = value;
        setFormData((prevData) => ({ ...prevData, email: updatedEmails }));
    };

    const handleRemoveEmail = (index) => {
        const updatedEmails = formData.email.filter((_, i) => i !== index);
        setFormData((prevData) => ({ ...prevData, email: updatedEmails }));
    };


    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.contactNo) newErrors.contactNo = 'Contact number is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.officeCategory) newErrors.officeCategory = 'Office category is required';
        if (!formData.managerName) newErrors.managerName = 'Manager name is required';

        return newErrors;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            try {
                const response = await addContact(formData);

                if (response.success === true) {
                    console.log("Contact successfully added", response.data);
                    notify("Contact successfully added", "success");
                    router.push(`/contacts/`);
                } else {
                    notify("Contact successfully added", "success");
                    console.error("Error adding contact", response, "Data:", response.data);
                }
            } catch (error) {
                console.error("Caught Error", error.response.status, error?.response?.data?.error?.message);
                return;
            } finally {
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
        } else {
            try {
                const response = await updateBook(bookId, formData);
                console.log("Response status", response.success, response.success === true, response.success == true);
                if (response.success === true) {
                    console.log("Book successfully Updated");
                } else {
                    console.error("Error Updating book", response.status, "Data:", response.data);
                }
            } catch (error) {
                console.error("Caught Error", error.response.status, error.response.data.error);
                return;
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
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.title && <p className="text-red text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.location && <p className="text-red text-xs mt-1">{errors.location}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Contact Numbers
                            </label>
                            {formData.contactNo.map((contact, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name={`contactNo-${index}`}
                                    placeholder={`Contact Number ${index + 1}`}
                                    value={contact}
                                    onChange={(e) => handleContactChange(e, index)}
                                    className="w-full my-2 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            ))}
                            {errors.contactNo && <p className="text-red text-xs mt-1">{errors.contactNo}</p>}
                            <button type="button" onClick={addContactField}>Add More</button>
                        </div>
                        {formData.email.map((mail, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="email"
                                    value={mail}
                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                    placeholder="Email"
                                    className="border-stroke p-2 mr-2"
                                />
                                <button type="button" onClick={() => handleRemoveEmail(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddEmail}>Add Email</button>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Office Category
                            </label>
                            <select
                                name="officeCategory"
                                value={formData.officeCategory}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                                <option value="">Select Office Category</option>
                                <option value="INSIDE">INSIDE</option>
                                <option value="OUTSIDE">OUTSIDE</option>
                                <option value="HEAD_OFFICE">HEAD_OFFICE</option>
                            </select>
                            {errors.officeCategory && <p className="text-red text-xs mt-1">{errors.officeCategory}</p>}
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Manager Name
                            </label>
                            <input
                                type="text"
                                name="managerName"
                                placeholder="Manager Name"
                                value={formData.managerName}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.managerName && <p className="text-red text-xs mt-1">{errors.managerName}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-opacity-90 rounded-lg p-3 text-white transition dark:bg-primary dark:hover:bg-opacity-90"
                            disabled={isLoading}
                        >
                            {bookId ? 'Update Contact' : 'Create Contact'}
                        </button>
                    </form>)
            }
        </div>
    );
}

export default ContactForm;
