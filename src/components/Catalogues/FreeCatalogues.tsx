'use client'
import Image from "next/image";
import moment from 'moment';

import Link from "next/link";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from '@/serivces/bookService';
import { FaPlus } from "react-icons/fa";
import { getAllFreeCatalogues } from "@/serivces/catalogueService";
import { Catalogue } from "@/types/catalogue";

const FreeCatalogues = () => {
    const { data: catalogueData, isLoading, error, isError } = useQuery({
        queryKey: ['freeCatalogues'],
        queryFn: getAllFreeCatalogues,
    })

    console.log(isLoading, error, isError, catalogueData?.data);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Free Catalogues
                </h4>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">ID</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Alt Text</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">File</p>
                </div>
               
            </div>

            {catalogueData?.data?.map((catalogue: Catalogue, key: number) => (
                <div
                    className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-3 flex items-center">
                        <Link href={`/catalogues/${catalogue._id}`} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                           {catalogue._id}
                        </Link>
                    </div>
                    <div className="col-span-2 hidden items-center sm:flex">
                        <p className="text-sm text-black dark:text-white">
                            {catalogue.alt}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {catalogue.author}
                        </p>
                    </div>
                   
                </div>
            ))}
        </div>

    );
};

export default FreeCatalogues;
