'use client'
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { deleteBook, getAllBooks, getOneBook } from '@/serivces/bookService';
import { useState } from "react";
import notify from "@/utils/notify";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { getAllForumReplies, getOneForum } from "@/serivces/forumService";
import ForumCommentForm from "./ForumCommentForm";
import ForumForm from "./ForumForm";

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

function ForumDetail({ id }) {
  const { user } = useAuth();

  const { data: forumData, isSuccess, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['forumDetail', id],
    queryFn: () => getOneForum(id),
  })
  console.log(isLoading, error, isError, isLoading, forumData?.data);

  const { data: commentsData, isLoading: isCommentLoading, error: isCommentError, refetch: refetchComments } = useQuery({
    queryKey: ['forumComments', id],
    queryFn: () => getAllForumReplies(id),
  })

  const DeleteBookComponent = ({ bookId }: { bookId: String }) => {

    const router = useRouter();
    const [isDeletionLoading, setIsDeletionLoading] = useState(false);

    const handleDelete = async () => {
      setIsDeletionLoading(true);
      try {
        // console.log("dlakjfkl", bookId);
        const response = await deleteBook(bookId);

        if (response.success === true) {
          console.log("Book successfully deleted", response.data);
          notify("Book successfully deleted!", "success");
          // refetchBooks();
          router.push(`/books/`);
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
            Delete
          </button>
        ) : (
          <button className="px-4 py-2 text-white bg-red rounded hover:bg-red" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    )
  }


  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book Details</h2> */}
        {isLoading && (
          <div className=" w-full flex justify-center items-center my-16">
            <div className="h-48">
              <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
            </div>
            <div className="text-xl font-semibold my-4 ">Loading <span className="animate-ping">...</span></div>
          </div>

        )}

        {isError && (<ErrorComponent errorMessage={error.message} />)}

        {isSuccess && forumData &&
          (
            <div>
              <div className="">
                <div className="mb-4">
                  <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">{forumData.title}</span>
                </div>
                {
                  forumData.subject?.name && (
                    <div className="mb-4">
                      <span className="ml-2 text-red dark:text-white p-2 rounded-sm text-sm bg-red-50 ">{forumData.subject?.name}</span>
                    </div>
                  )
                }
                {
                  forumData.image?.[0] && (
                    <div className="relative w-full h-96">
                      <Image
                        src={forumData.image?.[0]}
                        fill={true}
                        alt="Book Image"
                        className="rounded-lg cursor-pointer"
                        objectFit="contain"
                      />
                    </div>
                  )
                }


              </div>
              <div>
                <div className="ml-2 text-gray-900 dark:text-white">
                  {forumData.description}
                </div>
              </div>
              {['Admin', 'Author'].includes(user.role) && (
                <div className="flex space-x-4 mt-8">
                  <Link href={`/books/edit/${id}`} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                    Edit
                  </Link>
                  {['Admin', 'Author'].includes(user.role) && (
                    <DeleteBookComponent bookId={id} />
                  )}
                </div>
              )}
            </div>
          )}

        {!forumData && (
          <div className="w-full flex justify-center items-center my-16">
            <div className="text-xl font-semibold my-4 ">No book found with id {id}</div>
          </div>
        )}

      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h2>
        {commentsData && commentsData.length > 0 ? (
          <div className="space-y-4">
            {commentsData.map((comment, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              >
                {/* Comment Header */}
                <div className="flex items-center mb-3 ">
                  <div className="relative h-12 w-12">
                    <Image
                      src={comment.image?.[0] || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.sWCvltMZF_s3mjA5sL-RdgHaE8%26pid%3DApi&f=1&ipt=e28cd914b5e66fe7d48ce2ea62ce3e9a598fd9f8e2b9458cabfd9cad6fcc8679&ipo=images"}
                      alt="Commenter's avatar"
                      fill={true}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {comment.title || "Untitled Comment"}
                    </h4>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {comment.description || "No content provided."}
                </p>

                {/* Comment Image (if available) */}
                {comment.image && comment.image.length > 0 && (
                  <div className="relative w-full h-48 sm:h-64 md:h-72">
                    <Image
                      src={comment.image[0]}
                      alt="Comment-related image"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center my-16">
            <div className="text-xl font-semibold my-4 text-gray-500 dark:text-gray-400">
              No discussion found
            </div>
          </div>
        )}
      </div>

      <ForumCommentForm forumId={id} />

    </>
  )
}

export default ForumDetail