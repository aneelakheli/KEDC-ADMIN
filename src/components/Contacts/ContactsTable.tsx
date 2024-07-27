'use client'
import moment from 'moment';

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { getAllContacts } from "@/serivces/contactService";
import { Contact } from '@/types/contact';

const ContactsTable = () => {
    const { data: userData, isLoading, error, isError } = useQuery({
        queryKey: ['contacts'],
        queryFn: getAllContacts,
    })

    console.log(isLoading, error, isError, isLoading, userData?.data);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="grid grid-cols-6 border-t gap-2 border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Title</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Email</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Contact Number</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Location</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Office Category</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Manager Name</p>
                        </div>
                    </div>

                    {userData?.data?.map((contact: Contact, key: number) => (
                        <div
                            className="grid grid-cols-6 gap-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 break-all"
                            key={key}
                        >
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">
                                    {contact.title}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white break-words">
                                    {contact.email}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{contact.contactNo}</p>
                            </div>
                            <div className="col-span-1 flex items-center break-words">
                                <p className="text-sm text-black dark:text-white break-words">{contact.location}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{contact.officeCategory}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{contact.managerName}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/contacts/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                    <FaPlus className="text-xl" />
                    Add New Contact
                </Link>
            </div>
        </div>
    );
};

export default ContactsTable;
