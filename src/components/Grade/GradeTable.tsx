'use client'
import Image from "next/image";

import Link from "next/link";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from '@/serivces/bookService';
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { deleteSubject, getAllSubjects } from "@/serivces/subjectService";
import { Category } from "@/types/category";
import AddSubjectModal from "../Subject/AddSubjectModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import notify from "@/utils/notify";
import { deleteGrade, getAllGrades } from "@/serivces/gradeService";
import AddGradeModal from "./AddGradeModal";


const DeleteGradeComponent = ({ subjectId, refetch }: { subjectId: String }) => {

    const router = useRouter();
    const [isDeletionLoading, setIsDeletionLoading] = useState(false);
    
    const [showGradeModal, setShowGradeModal] = useState(false);
    const toggleGradeModal = () => setShowGradeModal(!showGradeModal)

    const handleDelete = async () => {
        setIsDeletionLoading(true);
        try {
            const response = await deleteGrade(subjectId);

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
                    <MdDelete />
                </button>
            ) : (
                <button className="px-4 py-2 text-white bg-red rounded hover:bg-red" onClick={handleDelete}>
                    <MdDelete />
                </button>
            )}
        </div>
    )
}


const GradeTable = () => {
    const { user } = useAuth();

    const [showGradeModal, setShowGradeModal] = useState(false);
    const toggleGradeModal = () => setShowGradeModal(!showGradeModal)

    const { data: userData, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['grade'],
        queryFn: getAllGrades,
    })

    console.log(isLoading, error, isError, isLoading, userData?.data);

    return (

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="grid grid-cols-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Subject Name</p>
                        </div>
                    </div>

                    {userData?.data?.map((subject: Category, key: number) => (
                        <div
                            className="flex justify-between border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                        >
                            <div className="col-span-3 flex items-center">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <p className="text-sm font-semibold text-black dark:text-white">
                                        {subject.name}
                                    </p>
                                </div>
                            </div>
                            {['Admin'].includes(user.role) && (
                                <DeleteGradeComponent subjectId={subject._id} refetch={refetch} />
                            )}
                        </div>
                    ))}
                </div>
                {
                    ['Admin', 'Auther'].includes(user.role) && (
                        <div className="flex flex-col gap-2 justify-center items-center border border-stroke font-medium py-4 my-4" onClick={() => toggleGradeModal()}>
                            <FaPlus className="text-xl" />
                            Add New Grade
                        </div>
                    )
                }

            </div>
            <AddGradeModal showModal={showGradeModal} toggleShowModal={toggleGradeModal} />
        </div>
    );
};

export default GradeTable;
