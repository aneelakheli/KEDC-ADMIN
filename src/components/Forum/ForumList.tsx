'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import moment from 'moment';

import Link from "next/link";
import { Package } from "@/types/package";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle, FaPlus, FaTimesCircle, FaTrash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { approveForum, deleteForum, getAllPublishedForums, getAllUnpublishedForums } from "@/serivces/forumService";
import { ResponseForum } from "@/types/forum";

const ForumList = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [showUnpublished, setShowUnpublished] = useState(false);
    const [forumData, setForumData] = useState<ResponseForum | null>(null)

    const { data: UnpublishedForumData, refetch: RefetchUnpublished, isLoading: isUnpublishedLoading, isSuccess: isUnpublishedSuccess, error: unpublishedError, isError: isUnpublishedError } = useQuery({
        queryKey: ['unpublished_forums'],
        queryFn: getAllUnpublishedForums,
        enabled: showUnpublished
    })


    const { data: PublishedForumData, refetch: RefetchPublished, isLoading: isPublishedLoading, isSuccess: isPublishedSuccess, error: publishedError, isError: isPublishedError } = useQuery({
        queryKey: ['published_forums'],
        queryFn: getAllPublishedForums,
        enabled: !showUnpublished
    })

    useEffect(() => {
        if (showUnpublished && UnpublishedForumData) {
            setForumData(UnpublishedForumData);
        } else if (!showUnpublished && PublishedForumData) {
            setForumData(PublishedForumData);
        }
    }, [showUnpublished, UnpublishedForumData, PublishedForumData]);


    const handleRefetch = () => {
        // if (showUnpublished) {
        //     RefetchUnpublished();
        // }
        queryClient.invalidateQueries({ queryKey: ['unpublished_forums'] })
        queryClient.invalidateQueries({ queryKey: ['published_forums'] })
    }

    const DeleteForumComponent = ({ id: fid, onDelete }: { id: string, onDelete: Function }) => {
        const deleteForumMn = useMutation({
            mutationFn: (id: string) => deleteForum(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['unpublished_forums'] });
                queryClient.invalidateQueries({ queryKey: ['published_forums'] });
            },
        });

        const handleDelete = (id: string) => {
            // console.log()
            if (!deleteForumMn.isPending) {
                deleteForumMn.mutate(id);
                onDelete?.();
            }
        };

        return (
            <div
                className="text-2xl"
            >
                {deleteForumMn.isPending ?
                    (
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                    ) :
                    <FaTrash className="text-lightred" onClick={() => handleDelete(fid)}
                    />
                }

            </div>
        )
    }

    const ApproveForumComponent = ({ id: fid, onApprove }: { id: string, onApprove: Function }) => {

        const toggleApprovalMn = useMutation(
            {
                mutationFn: (id: string) =>
                    approveForum(id),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['unpublished_forums'] });
                    queryClient.invalidateQueries({ queryKey: ['published_forums'] });
                },
            }
        );

        const handleApprove = (id: string) => {
            // if (!toggleApprovalMn.isLoading) {
            toggleApprovalMn.mutate(id);
            onApprove();
            // }
        };

        return (

            <div
                onClick={() => { }}
                className="text-2xl"
            >
                {(toggleApprovalMn.isLoading) ?
                    (
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                            role="status">
                            <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                        </div>
                    ) :
                    <FaCheckCircle className="text-green-500" onClick={() => handleApprove(fid)} />

                }
                {/* {false ? (
                    <FaTimesCircle className="text-blue-500" />
                ) : (
                    <FaCheckCircle className="text-green-500" onClick={() => handleApprove(fid)} />
                )} */}
            </div>

        )
    }

    console.log(forumData, "Forum Data--------")

    return (

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <div>
                    <div className="flex items-center justify-center py-4">
                        <div className="flex border border-lightred rounded-full overflow-hidden">
                            {/* Published Button */}
                            <button
                                className={`px-4 py-2 ${!showUnpublished
                                    ? "bg-lightred text-gray-2"
                                    : "bg-white text-graydark hover:bg-gray-200 hover:bg-gray-2"
                                    }`}
                                onClick={() => setShowUnpublished(false)}
                            >
                                Published
                            </button>

                            {/* Unpublished Button */}
                            <button
                                className={`px-4 py-2 ${showUnpublished
                                    ? "bg-lightred text-gray-2"
                                    : "bg-white text-graydark hover:bg-gray-200 hover:bg-gray-2"
                                    }`}
                                onClick={() => setShowUnpublished(true)}
                            >
                                Unpublished
                            </button>
                        </div>
                    </div>
                </div>
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    {forumData && forumData.map((forum: ResponseForum, key: number) => (
                        <div
                            className="grid grid-cols-8 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                        >
                            <div className="col-span-4 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="relative h-22 w-18 rounded-md">
                                        {(forum.image && forum?.image?.length > 0) ?

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
                                    {forum?.user?.fullName || forum?.user?.email}
                                </p>
                            </div>

                            {
                                ['Admin', 'Author'].includes(user?.role) &&
                                <div className="col-span-1 ml-4 text-2xl flex gap-2 items-center">
                                    {
                                        !forum?.isPublished && <ApproveForumComponent id={forum?._id} onApprove={handleRefetch} />
                                    }

                                    <DeleteForumComponent id={forum?._id} onDelete={handleRefetch} />

                                    <div>
                                        <div className="rounded-full p-2 text-sm bg-gray">30</div>
                                    </div>
                                </div>
                            }


                        </div>
                    ))}
                    {
                        // !!forumData && (
                        //     <div className="flex justify-center items-center mt-4">
                        //         <button
                        //             className="px-4 py-2 mx-1 bg-gray-200 rounded"
                        //         // disabled={currentPage === 1}
                        //         // onClick={() => setCurrentPage((prev) => prev - 1)}
                        //         >
                        //             Previous
                        //         </button>
                        //         <span className="px-4 py-2">
                        //             {/* {currentPage} */}
                        //             3
                        //         </span>
                        //         <button
                        //             className="px-4 py-2 mx-1 bg-gray-200 rounded"
                        //         // disabled={currentPage === Math.ceil((forumData?.length || 0) / itemsPerPage)}
                        //         // onClick={() => setCurrentPage((prev) => prev + 1)}
                        //         >
                        //             Next
                        //         </button>
                        //     </div>
                        // )
                    }
                </div>
                {
                    ['Admin', 'Auther', 'Teacher'].includes(user.role) && (
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
