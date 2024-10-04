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
import { deleteInquiry, getAllInquiries } from "@/serivces/inquiryService";
import { Inquiry } from "@/types/inquiry";
import { useRouter } from "next/navigation";
import { useState } from "react";
import notify from "@/utils/notify";

const InquiryTable = () => {
    const { data: userData, isLoading, error, isError, refetch: refetchInquiries } = useQuery({
        queryKey: ['inquiries'],
        queryFn: getAllInquiries,
    })

    console.log(isLoading, error, isError, isLoading, userData?.data);

    const DeleteInquiryComponent = ({ inquiryId }: { inquiryId: string }) => {

        const router = useRouter();
        const [isDeletionLoading, setIsDeletionLoading] = useState(false);
    
        const handleDelete = async () => {
          setIsDeletionLoading(true);
          try {
            console.log("dlakjfkl", inquiryId);
            const response = await deleteInquiry(inquiryId);
    
            if (response.success === true) {
              console.log("Inquiry successfully deleted", response.data);
              notify("Inquiry successfully deleted!", "success");
              refetchInquiries();
            }
            else {
              console.error("Error deleting Inquiry", response, "Data:", response.data);
              notify("Failed to delete inquiry!", "error");
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
              <button className="px-4 flex justify-center items-center gap-2 py-2 text-white bg-red rounded hover:bg-red">
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
              <button className="px-4 py-2 text-white bg-red rounded hover:bg-red" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        )
      }
    

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="grid grid-cols-10 border-t gap-2 border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
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
                <div className="col-span-2 flex items-center">
                </div>
            </div>

            {userData?.data?.map((inquiry: Inquiry, key: number) => (
                <div
                    className="grid grid-cols-10 gap-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 break-all"
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
                        <p className="text-sm text-black dark:text-white break-words">{inquiry.message}</p>
                    </div>
                    <div className="flex items-center break-words">
                        <DeleteInquiryComponent inquiryId={inquiry._id} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InquiryTable;
