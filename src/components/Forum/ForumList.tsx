'use client'
import Image from "next/image";
import moment from 'moment';

import Link from "next/link";
import { Package } from "@/types/package";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { getAllPublishedForums, getAllUnpublishedForums } from "@/serivces/forumService";
import { Forum } from "@/types/forum";

const ForumList = () => {
    const { user } = useAuth();

    const { data: forumData, isLoading, error, isError } = useQuery({
        queryKey: ['unpublished_forums'],
        queryFn: getAllUnpublishedForums,
    })

    console.log(isLoading, error, isError, isLoading, forumData?.data);

    return (

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    {console.log("Some Value =============",forumData)}
                    {forumData?.map((forum: Forum, key: number) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                        >
                            <div className="col-span-3 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="relative h-22 w-18 rounded-md">
                                        {(forum.image && forum?.image?.length > 0)?
                                    
                                             <Image
                                                src={forum?.image?.[0] || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.sWCvltMZF_s3mjA5sL-RdgHaE8%26pid%3DApi&f=1&ipt=e28cd914b5e66fe7d48ce2ea62ce3e9a598fd9f8e2b9458cabfd9cad6fcc8679&ipo=images"}
                                                layout="fill"
                                                objectFit="cover"
                                                alt="userData"
                                            />
                                        :
                                        <Image
                                                src={'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.sWCvltMZF_s3mjA5sL-RdgHaE8%26pid%3DApi&f=1&ipt=e28cd914b5e66fe7d48ce2ea62ce3e9a598fd9f8e2b9458cabfd9cad6fcc8679&ipo=images'}
                                                layout="fill"
                                                objectFit="cover"
                                                alt="userData"
                                            />
                                    }
                                    </div>
                                    <Link href={`/forum/chat/${forum._id}`}>
                                        <p className="text-sm font-semibold text-black dark:text-white">
                                            {forum.title}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {/* {console.log("Category", forum?.category)} */}
                                    {forum.subject?.name ?? forum.subject ?? ''}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">
                                    {forum?.user?.fullName || forum?.user?.email }
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {
                    ['Admin', 'Auther'].includes(user.role) && (
                        <Link href="/forum/add" className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4">
                            <FaPlus className="text-xl" />
                            Start a Discussion
                        </Link>
                    )
                }

            </div>
        </div>
    );
};

export default ForumList;
