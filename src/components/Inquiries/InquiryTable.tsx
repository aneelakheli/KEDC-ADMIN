'use client'
import Image from "next/image";
import moment from 'moment';

import Link from "next/link";
import { Package } from "@/types/package";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from '@/serivces/bookService';
import { FaPlus } from "react-icons/fa";
import { getAllInquiries } from "@/serivces/inquiryService";
import { Inquiry } from "@/types/inquiry";

const InquiryTable = () => {
    const { data: userData, isLoading, error, isError } = useQuery({
        queryKey: ['inquiries'],
        queryFn: getAllInquiries,
    })

    console.log(isLoading, error, isError, isLoading, userData?.data);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-9 border-t gap-2 border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Date</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Full Name</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Email</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Contact Number</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Message</p>
                </div>
            </div>

            {userData?.data?.map((inquiry: Inquiry, key: number) => (
                <div
                    className="grid grid-cols-9 gap-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 break-all"
                    key={key}
                >
                    <div className="col-span-2 hidden items-center sm:flex">
                        <p className="text-sm text-black dark:text-white">
                            {moment(inquiry.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                        </p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <div className="flex">

                            <Link href={`/inquiries/${inquiry._id}`}>
                                <p className="text-sm text-black dark:text-white">
                                    {inquiry?.firstName + ' ' + inquiry?.lastName}
                                </p>
                            </Link>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center break-words">
                        <p className="text-sm text-black dark:text-white break-words">
                            {inquiry.email}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{inquiry.contactNo}</p>
                    </div>
                    <div className="col-span-2 flex items-center break-words">
                        <p className="text-sm text-black dark:text-white break-words">{inquiry.message} ajdf lkdfjalks djflkadjf kladjf klasdj fkljd lkfjalk;d jf kldjlk</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InquiryTable;
