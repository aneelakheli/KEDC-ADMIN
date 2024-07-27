'use client'
import Image from "next/image";
import moment from 'moment';

import Link from "next/link";
import { Package } from "@/types/package";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { getOneBook } from '@/serivces/bookService';

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

function BookDetail({ id }) {
  const { data: bookData, isSuccess, isLoading, error, isError } = useQuery({
    queryKey: ['books', id],
    queryFn: () => getOneBook(id),
  })
  console.log(isLoading, error, isError, isLoading, bookData?.data);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book Details</h2>
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
              <div className="flex flex-col items-center">
                <img
                  src={bookData.image}
                  alt="Book Image"
                  className="rounded-lg shadow-lg cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Title:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{bookData.name}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Author:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{bookData.author}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Category:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{bookData.category}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Publication:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{bookData.publication}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Editor:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{bookData.editor}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Price:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">Rs. {bookData.price}</span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Grade:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{bookData.grade}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white my-6">Book Description</h2>
              <div className="ml-2 text-gray-900 dark:text-white">
                {bookData.description} Some random description here
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <Link href={`/books/edit/${id}`} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                Edit
              </Link>
              <button className="px-4 py-2 text-white bg-red rounded hover:bg-red">
                Delete
              </button>
            </div>
          </div>
        )}

    </div>
  )
}

export default BookDetail