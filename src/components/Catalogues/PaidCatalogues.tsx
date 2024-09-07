'use client'
import Image from "next/image";
import moment from 'moment';

import Link from "next/link";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from '@/serivces/bookService';
import { FaPlus } from "react-icons/fa";
import { getAllPremiumCatalogues } from "@/serivces/catalogueService";
import { Catalogue } from "@/types/catalogue";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const PaidCatalogues = () => {
    const { data: catalogueData, isLoading, error, isError } = useQuery({
        queryKey: ['premiumCatalogues'],
        queryFn: getAllPremiumCatalogues,
    })

    console.log("Premium Catalogue", isLoading, error, isError, catalogueData?.data);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {catalogueData?.data?.length > 0 && (
                <div className="px-4 py-6 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Premium Catalogues
                    </h4>
                </div>
            )}

            <div className="grid grid-cols-1 xsm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 m-2">

                {catalogueData?.data?.map((catalogue: Catalogue, key: number) => (

                    <div
                        className="rounded-sm border border-stroke bg-black shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col items-center"
                        key={key}
                    >
                        <a href="#" className="bg-white">
                            <div className="relative w-full">
                                <img
                                    alt="Cards"
                                    loading="lazy"
                                    decoding="async"
                                    src={catalogue.image}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </a>
                        <div className="px-6 py-2 bg-black w-full flex">
                            <div className="w-4/5">
                                <h4 className="mb-1 text-xl font-semibold text-white hover:text-primary dark:text-white dark:hover:text-primary">
                                    <Link href={`/catalogues/${catalogue._id}`}>{catalogue.title}</Link>
                                </h4>
                                <p className="text-gray">{catalogue.category.name}</p>
                            </div>
                            <div className="text-green-500 w-1/5 flex justify-center items-center">
                                <MdOutlineWorkspacePremium className="text-3xl" />
                            </div>
                        </div>

                    </div>

                ))}
            </div>

        </div >

    );
};

export default PaidCatalogues;
