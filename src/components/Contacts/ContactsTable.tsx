'use client'
import moment from 'moment';
import { useState } from 'react';
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { deleteContact, getAllContacts } from "@/serivces/contactService";
import { Contact } from '@/types/contact';
import notify from '@/utils/notify';

const ContactsTable = () => {
    const { data: userData, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['contacts'],
        queryFn: getAllContacts,
    })

    console.log(isLoading, error, isError, isLoading, userData?.data);

    const DeleteContactComponent = ({ contactId }: { contactId: String }) => {

        const router = useRouter();
        const [isDeletionLoading, setIsDeletionLoading] = useState(false);

        const handleDelete = async () => {
            setIsDeletionLoading(true);
            try {
                console.log("dlakjfkl", contactId);
                const response = await deleteContact(contactId);

                if (response.success === true) {
                    console.log("Contact successfully deleted", response.data);
                    notify("Contact successfully deleted!", "success");
                    refetch();
                }
                else {
                    console.error("Error deleting Contact", response, "Data:", response.data);
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
                    <button className="px-2 flex justify-center items-center gap-2 py-2 text-red bg-white rounded hover:text-white hover:bg-red">
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                        <MdDelete className='text-xl' />
                    </button>
                ) : (
                    <button className="px-2 py-2 text-red bg-white rounded hover:text-white hover:bg-red" onClick={handleDelete}>
                        <MdDelete className='text-xl' />
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="grid grid-cols-7 border-t gap-2 border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
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
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Action</p>
                        </div>
                    </div>

                    {userData?.data?.map((contact: Contact, key: number) => (
                        <div
                            className="grid grid-cols-7 gap-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 break-all"
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
                            <div className="col-span-1 flex items-center">
                                <span className="text-sm text-black dark:text-white"><DeleteContactComponent contactId={contact._id} /></span>
                                <span className="text-sm text-black dark:text-white"><Link href={`/contacts/edit/${contact._id}`}><MdEdit className='text-xl' /></Link></span>
                            </div>

                        </div>
                    ))}
                </div>
                <Link href="/dashboard/contacts/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                    <FaPlus className="text-xl" />
                    Add New Contact
                </Link>
            </div>
        </div>
    );
};

export default ContactsTable;
