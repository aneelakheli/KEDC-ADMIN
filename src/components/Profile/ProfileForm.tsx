'use client'
import { updateAbout } from '@/serivces/aboutService';
import { getOneUser, updateUser, deleteUser, approveUser } from '@/serivces/userService';
import notify from '@/utils/notify';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { getAllSubjects } from "@/serivces/subjectService";
import { useAuth } from "@/context/AuthContext";
import { CiCircleCheck } from 'react-icons/ci';
import { MdOutlinePendingActions } from 'react-icons/md';

function ProfileForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState();
    const { data: userData, isLoading: isQueryLoading, error: queryError, isError: isQueryError } = useQuery({
        queryKey: ['book', user.id],
        queryFn: () => getOneUser(user.id),
        enabled: !!user.id,
    });

    const { data: subjectData, isLoading: isSubjectLoading, error: subjectError, isError: isSubjectError } = useQuery({
        queryKey: ['subject'],
        queryFn: () => getAllSubjects(),
    });

    const [formData, setFormData] = useState({
        fullName: '',
        contactNo: '',
        email: '',
        schoolName: '',
    });
    // const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userData) {
            setFormData(userData.data);
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, type, value, options } = e.target;

        let inputValue;
        if (type === 'select-multiple') {
            inputValue = Array.from(options).filter(option => option.selected).map(option => option.value);
        } else {
            inputValue = value;
        }

        setFormData({
            ...formData,
            [name]: inputValue
        });

        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const handleImageChange = (e) => {
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
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.contactNo) newErrors.contactNo = 'Contact Number is required';

        return newErrors;
    };

    const DeleteUserComponent = ({ userId }: { userId: String }) => {
        const router = useRouter();
        const [isDeletionLoading, setIsDeletionLoading] = useState(false);

        const handleDelete = async (e) => {
            e.preventDefault();
            setIsDeletionLoading(true);
            try {
                const response = await deleteUser(userId);

                if (response.success === true) {
                    notify("User successfully deleted!", "success");
                    router.push(`/users/`);
                }
                else {
                    console.error("Error deleting User", response, "Data:", response.data);
                }
            }
            catch (error) {
                console.error("Caught Error", error.response.status, error.response.data.error);
                return;
            }
            finally {
                setIsDeletionLoading(false);
            }
        }

        return (
            <div className="flex justify-center items-center">
                {isDeletionLoading ? (
                    <button type="button" className="px-4 flex justify-center items-center gap-2 py-2 text-white bg-red rounded hover:bg-red">
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                        Delete
                    </button>
                ) : (
                    <button type="button" className="px-4 py-2 text-white bg-red rounded hover:bg-red" onClick={handleDelete}>
                        Delete
                    </button>
                )}
            </div>
        )
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        else {
            try {
                const response = await updateUser(user.id, formData);
                console.log("Response status", response.success, response.success === true, response.success == true);
                if (response.success === true) {
                    console.log("res", response.data);
                    notify("User successfully Updated", "success")
                }
                else {
                    console.error("Error Updating the User", response.status, "Data:", response.data);
                    notify("Failed Uploading User", "error")
                }
            }
            catch (error) {
                console.error("Caught Error", error.status, error);
                notify("Failed Uploading User", "error")
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
        <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Personal Information
                    </h3>
                </div>
                <div className="p-7">
                    {user.id && isQueryLoading ?
                        (<LoadingComponent />) :
                        (user.id && isQueryError) ?
                            (<ErrorComponent errorMessage={`Error fetching user: ${queryError.message}`} />) :
                            (<form onSubmit={handleEdit}>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full sm:w-1/2">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="fullName"
                                        >
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4.5 top-4">
                                                <svg
                                                    className="fill-current"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                                            fill=""
                                                        />
                                                    </g>
                                                </svg>
                                            </span>
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                name="fullName"
                                                id="fullName"
                                                placeholder="Devid Jhon"
                                                value={formData?.fullName}
                                                onChange={handleInputChange}
                                            />
                                            {errors.fullName && <p className="text-red text-xs mt-1">{errors.fullName}</p>}
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="phoneNumber"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            type="text"
                                            name="contactNo"
                                            id="contactNo"
                                            value={formData?.contactNo}
                                            onChange={handleInputChange}
                                        />
                                        {errors.contactNo && <p className="text-red text-xs mt-1">{errors.contactNo}</p>}

                                    </div>
                                </div>

                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="emailAddress"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4.5 top-4">
                                            <svg
                                                className="fill-current"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.8">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                                                        fill=""
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData?.email}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                        {errors.email && <p className="text-red text-xs mt-1">{errors.email}</p>}

                                    </div>
                                </div>

                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="schoolName"
                                    >
                                        School Name
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        name="schoolName"
                                        id="schoolName"
                                        value={formData?.schoolName}
                                        onChange={handleInputChange}
                                        disabled = {formData.isAccepted?true:false}
                                    />
                                    {errors.schoolName && <p className="text-red text-xs mt-1">{errors.schoolName}</p>}

                                </div>
                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Subjects
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            name="allowedSubjects"
                                            value={formData?.allowedSubjects}
                                            onChange={handleInputChange}
                                            multiple
                                            disabled
                                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        >
                                            {subjectData?.data?.map((category) =>
                                                <option value={category._id}>{category.name}</option>
                                            )}
                                        </select>
                                    </div>

                                    {errors.allowedSubjects && <p className="text-red text-xs mt-1">{errors.allowedSubjects}</p>}


                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Role
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            name="role"
                                            value={formData?.role}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        >
                                            <option value="">Select Subject</option>
                                            <option value='Admin'>Admin</option>
                                            <option value='Author'>Author</option>
                                            <option value='Teacher'>Teacher</option>
                                        </select>
                                    </div>

                                    {errors.role && <p className="text-red text-xs mt-1">{errors.role}</p>}
                                </div>

                                <div className="my-8">
                                    {formData.isAccepted ? (
                                        <div className='flex items-center gap-2 text-2xl text-green-500'>
                                            <CiCircleCheck className='text-4xl'/> Approved
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2 text-2xl text-red'>
                                            <MdOutlinePendingActions /> Not Approved
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4.5 mt-8">
                                    {/* <DeleteUserComponent userId={user.id} /> */}
                                    <button
                                        className="flex justify-center rounded bg-green-600 px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>)}
                </div>
            </div>
        </div>
    )
}

export default ProfileForm