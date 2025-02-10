'use client'
import moment from 'moment';

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import notify from "@/utils/notify";
import { Amendment } from "@/types/amendment";
import { MdDelete, MdEdit } from "react-icons/md";
import { deleteAmendment, getAllAmendments } from "@/serivces/amendmentService";
import { useAuth } from '@/context/AuthContext';

const AmendmentTable = ({ bookId }: { bookId: string }) => {
  const { data: userData, isLoading, error, isError, refetch: refetchInquiries } = useQuery({
    queryKey: ['inquiries'],
    queryFn: () => getAllAmendments(bookId),
    enabled: !!bookId
  })
  const authData = useAuth();

  const router = useRouter();
  console.log(isLoading, error, isError, isLoading, userData?.data);

  const DeleteAmendmentComponent = ({ amendmentId }: { amendmentId: string }) => {

    const [isDeletionLoading, setIsDeletionLoading] = useState(false);

    const handleDelete = async () => {
      setIsDeletionLoading(true);
      try {
        const response = await deleteAmendment(amendmentId);

        if (response.success === true) {
          console.log("Amendment successfully deleted", response.data);
          notify("Amendment successfully deleted!", "success");
          refetchInquiries();
        }
        else {
          console.error("Error deleting Amendment", response, "Data:", response.data);
          notify("Failed to delete amendment!", "error");
        }
      }
      catch (error: any) {
        console.error("Caught Error", error);
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
          <button className="px-4 py-2 hover:text-white text-red rounded hover:bg-red" onClick={handleDelete}>
            <MdDelete />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex my-4 px-8 justify-between items-center">
        <div className='flex items-center'>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Book Amendments</h2>
        </div>
        <div>
          <Link href={`/amendments/add?bookId=${bookId}`} className="flex flex-col gap-2 justify-center items-center font-medium ">
            <FaPlus className="text-xl" />
            Add New Amendment
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-12 border-t gap-2 border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Date</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Title</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Page</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Mistake</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Correction</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Description</p>
        </div>
        <div className="col-span-2 flex items-center">
        </div>
      </div>

      {userData?.data?.map((amendment: Amendment, key: number) => (
        <div
          className="grid grid-cols-12 gap-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 break-all"
          key={key}
        >
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {moment(amendment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <div className="flex">

              <Link href={`/inquiries/${amendment._id}`}>
                <p className="text-sm text-black dark:text-white">
                  {amendment?.title}
                </p>
              </Link>
            </div>
          </div>
          <div className="col-span-1 flex items-center break-words">
            <p className="text-sm text-black dark:text-white break-words">
              {amendment.pageNo}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{amendment.misconstrue}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{amendment.amendment}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{amendment.description}</p>
          </div>
          {authData?.user?.role && ['Admin', 'Author'].includes(authData?.user?.role) && (
            <div className="flex items-center break-words">
              <DeleteAmendmentComponent amendmentId={amendment._id} />
              <button className="px-4 py-2 hover:text-white text-graydark rounded hover:bg-graydark" onClick={() => router.push(`/amendments/add?amendmentId=${amendment._id}`)}>
                <MdEdit />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AmendmentTable;
