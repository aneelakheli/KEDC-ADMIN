'use client'
import Image from "next/image";
import moment from 'moment';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package } from "@/types/package";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { getOneBook } from '@/serivces/bookService';
import { deleteInquiry, getOneInquiry } from "@/serivces/inquiryService";

function ErrorComponent({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
      <svg className="inline mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-11.412a.75.75 0 00-1.36 0l-3 6.5a.75.75 0 001.36.64l.784-1.697h3.433l.784 1.696a.75.75 0 001.36-.638l-3-6.5zM9.25 12a.75.75 0 101.5 0 .75.75 0 00-1.5 0z" clipRule="evenodd" />
      </svg>
      {errorMessage}
    </div>
  );
}

function InquiryDetail({ id }) {

  const router = useRouter();
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);

  const { data: inquiryData, isSuccess, isLoading, error, isError } = useQuery({
    queryKey: ['inquiries', id],
    queryFn: () => getOneInquiry(id),
  })
  console.log(isLoading, error, isError, isLoading, inquiryData);

  const handleDelete = async () => {
    setIsDeletionLoading(true);
    try {
      const response = await deleteInquiry(id);

      if (response.success === true) {
        console.log("Inquiry successfully deleted", response.data);
        router.push(`/inquiries`);
      }
      else {
        console.error("Error deleting book", response, "Data:", response.data);
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
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Inquiry Details</h2>
      {isLoading && (
        <div className=" w-full flex justify-center items-center my-16">
          <div className="h-48">
            <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
          </div>
          <div className="text-xl font-semibold my-4 ">Loading <span className="animate-ping">...</span></div>
        </div>

      )}

      {isError && (<ErrorComponent errorMessage={error.message} />)}

      {isSuccess &&
        (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">First Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{inquiryData.firstName}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Last Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{inquiryData.lastName}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{inquiryData.email}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Contact Number:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{inquiryData.contactNo}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{moment(inquiryData.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white my-6">Message</h2>
              <div className="ml-2 text-gray-900 dark:text-white">
                {inquiryData.message}
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
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

          </div>
        )}

    </div>
  )
}

export default InquiryDetail