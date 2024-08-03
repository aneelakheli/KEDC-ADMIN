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

const BookTable = () => {
    const { data: userData, isLoading, error, isError } = useQuery({
        queryKey: ['books'],
        queryFn: getAllBooks,
    })

    console.log(isLoading, error, isError, isLoading, userData?.data);

    return (

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="px-4 py-6 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Books
                        </h4>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-3 flex items-center">
                            <p className="font-medium">Book Name</p>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Category</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Author</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Grade</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Publication</p>
                        </div>
                    </div>

                    {userData?.data?.map((book: Book, key: number) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                        >
                            <div className="col-span-3 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="relative h-22 w-18 rounded-md">
                                        <Image
                                            src={book.image}
                                            layout="fill"
                                            objectFit="cover"
                                            alt="userData"
                                        />
                                    </div>
                                    <Link href={`/books/${book._id}`}>
                                        <p className="text-sm text-black dark:text-white">
                                            {book.name}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {book.category}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">
                                    {book.author}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{book.grade}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{book.publication}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/books/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                    <FaPlus className="text-xl"/>
                    Add New Book
                </Link>

            </div>
        </div>
    );
};

export default BookTable;
