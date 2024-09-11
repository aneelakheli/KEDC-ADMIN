'use client'
import moment from 'moment';

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { getAllAbout } from '@/serivces/aboutService';
import { About } from '@/types/about';

const AboutTable = () => {
    const { data: aboutData, isLoading, error, isError } = useQuery({
        queryKey: ['contacts'],
        queryFn: getAllAbout,
    })

    console.log(isLoading, error, isError, isLoading, aboutData?.data);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="grid grid-cols-2 border-t gap-2 border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Title</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">Alt Text</p>
                        </div>
                    </div>

                    {aboutData?.data?.map((about: About, key: number) => (
                        <div
                            className="grid grid-cols-2 gap-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 break-all"
                            key={key}
                        >
                            <Link href={`/about/edit/${about._id}`} className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">
                                    {about.title}
                                </p>
                            </Link>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white break-words">
                                    {about.alt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/dashboard/about/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                    <FaPlus className="text-xl" />
                    Add New
                </Link>
            </div>
        </div>
    );
};

export default AboutTable;
