'use client'
import Image from "next/image";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { deleteSubject, getAllSubjects } from "@/serivces/subjectService";
import { Category } from "@/types/category";
import AddSubjectModal from "../Subject/AddSubjectModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import notify from "@/utils/notify";
import { deleteEvent, getAllEvents } from "@/serivces/eventService";
import { Event } from "@/types/event";

const DeleteEventComponent = ({ eventId, refetch }: { eventId: String }) => {

    const router = useRouter();
    const [isDeletionLoading, setIsDeletionLoading] = useState(false);

    const handleDelete = async () => {
        setIsDeletionLoading(true);
        try {
            const response = await deleteEvent(eventId);

            if (response.success === true) {
                console.log("Subject successfully deleted", response.data);
                notify("Subject successfully deleted!", "success");
                refetch();
            }
            else {
                console.error("Error deleting Book", response, "Data:", response.data);
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
                    <MdDelete/>
                </button>
            ) : (
                <button className="px-4 py-2 text-white bg-red rounded hover:bg-red" onClick={handleDelete}>
                    <MdDelete/>
                </button>
            )}
        </div>
    )
}

const EventsTable = () => {
    const { user } = useAuth();

    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const toggleShowModal = () => setShowSubjectModal(!showSubjectModal)

    const { data: eventsData, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: getAllEvents,
    })

    console.log(isLoading, error, isError, isLoading, eventsData?.data);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-3 hidden items-center sm:flex">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-3 flex items-center">
                            <p className="font-medium">Description</p>
                        </div>
                    </div>

                    {eventsData?.data?.map((subject: Event, key: number) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                        >
                            <div className="col-span-4 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="relative h-22 w-18 rounded-md">
                                        <Image
                                            src={subject.image}
                                            layout="fill"
                                            objectFit="cover"
                                            alt="eventsData"
                                        />
                                    </div>
                                    <Link href={`/books/${subject._id}`}>
                                        <p className="text-sm font-semibold text-black dark:text-white">
                                            {subject.name}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">{subject.description}</p>
                            </div>
                            {['Admin'].includes(user.role) && (
                                <DeleteEventComponent subjectId={subject._id} refetch={refetch}/>
                            )}
                        </div>
                    ))}
                </div>
                {
                    ['Admin'].includes(user.role) && (
                        <div className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4" onClick={() => toggleShowModal()}>
                            <FaPlus className="text-xl" />
                            Add New Event
                        </div>
                    )
                }

            </div>
            <AddSubjectModal showModal={showSubjectModal} toggleShowModal={toggleShowModal} />

        </div>
    );
};

export default EventsTable;
