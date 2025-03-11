'use client'
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { deleteBook, getAllBooks, getOneBook } from '@/serivces/bookService';
import { useEffect, useState } from "react";
import notify from "@/utils/notify";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { approveForum, approveForumReply, deleteForum, getAllForumReplies, getOneForum, getPublishedForumReplies, getUnpublishedForumReplies } from "@/serivces/forumService";
import ForumCommentForm from "./ForumCommentForm";
import ForumForm from "./ForumForm";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import Tooltip from "../Tooltip";

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
  const authData = useAuth();
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [commentsData, setCommentsData] = useState(null);

  const queryClient = useQueryClient();


  const { data: forumData, isSuccess, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['forumDetail', id],
    queryFn: () => getOneForum(id),

  })
  // console.log(isLoading, error, isError, isLoading, forumData?.data, "forum data +++");?÷
  // useEffect(()=>{
  //   console.log("forum data -----------", responseData, forumData);
  // },[responseData])

  useEffect(() => {
    console.log("error", error)
  }, [error])

  const { data: publishedCommentsData, isLoading: isPublishedCommentLoading, error: isPublishedCommentError, isSuccess: isPublishedSuccess, refetch: refetchPublishedComments } = useQuery({
    queryKey: ['forumPublishedComments', id],
    queryFn: () => getPublishedForumReplies(id),
    enabled: !showUnpublished
  })

  const { data: unpublishedCommentsData, isLoading: isUnPublishedCommentLoading, error: isUnPublishedCommentError, isSuccess: isUnpublishedSuccess, refetch: refetchUnpublishedComments } = useQuery({
    queryKey: ['forumUnpublishedComments', id],
    queryFn: () => getUnpublishedForumReplies(id),
    enabled: showUnpublished
  })

  const approveCommentMn = useMutation(
    {
      mutationFn: (ReplyId: string) =>
        approveForumReply(id, ReplyId, true),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['forumPublishedComments', id] });
        queryClient.invalidateQueries({ queryKey: ['forumUnpublishedComments', id] });
        notify("Forum Reply successfully Published!", "success");
      },
      onError: () => {
        notify("Failed to approve reply.", "error")
      }
    }
  );

  const unApproveCommentMn = useMutation(
    {
      mutationFn: (ReplyId: string) =>
        approveForumReply(id, ReplyId, false),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['forumPublishedComments', id] });
        queryClient.invalidateQueries({ queryKey: ['forumUnpublishedComments', id] });
        notify("Forum Reply successfully UnPublished!", "success");
      },
      onError: () => {
        notify("Failed to remove reply approval.", "error")
      }
    }
  );

  useEffect(() => {
    if (!isPublishedCommentLoading && !isPublishedCommentLoading) {

      if (showUnpublished && unpublishedCommentsData) {
        setCommentsData(unpublishedCommentsData?.childForum);
      }
      else if(publishedCommentsData){
        setCommentsData(publishedCommentsData?.childForum);
      }
    }
  }, [showUnpublished, publishedCommentsData, unpublishedCommentsData, isPublishedCommentLoading, isPublishedCommentLoading])


  const handleUnpublishReply = (replyId: string) => {
    unApproveCommentMn.mutate(replyId);
  }

  const handlePublishReply = (replyId: string) => {
    approveCommentMn.mutate(replyId);
  }

  const DeleteBookComponent = ({ forumId }: { forumId: string }) => {

    const router = useRouter();
    const [isDeletionLoading, setIsDeletionLoading] = useState(false);

    const handleDelete = async () => {
      setIsDeletionLoading(true);
      try {
        // console.log("dlakjfkl", forumId);
        const response = await deleteForum(forumId);

        if (response.success === true) {
          console.log("Forum successfully deleted", response.data);
          notify("Forum successfully deleted!", "success");
          // refetchForums();
          router.push(`/forum/`);
        }
        else {
          console.error("Error deleting Forum", response, "Data:", response.data);
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

    const toggleApprovalMn = useMutation(
      {
        mutationFn: (id: string) =>
          approveForum(id, false),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['unpublished_forums'] });
          queryClient.invalidateQueries({ queryKey: ['published_forums'] });
          notify("Forum successfully UnPublished!", "success");
          router.push(`/forum/`);

        },
      }
    );

    const handleUnpublish = () => {
      toggleApprovalMn.mutate(forumId);
    }

    return (
      <>
        <div className="flex justify-center items-center">
          {toggleApprovalMn.isPending ? (
            <button className="px-4 flex justify-center items-center gap-2 py-2 text-white bg-lightred rounded hover:bg-red">
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status">
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...
                </span>
              </div>
              UnPublish
            </button>
          ) : (
            <button className="px-4 py-2 text-white bg-lightred rounded hover:bg-red" onClick={handleUnpublish}>
              UnPublish
            </button>
          )}
        </div>
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
              <FaTrash className="text-lightred"/>
            </button>
          ) : (
            <Tooltip content="Delete Forum">
            <button className="px-4 py-2 text-white group bg-white rounded " onClick={handleDelete}>
              <FaTrash className="text-lightred group-hover:text-red text-2xl"/>
            </button>
            </Tooltip>
          )}
        </div>
      </>

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
              {authData?.user?.role && ['Admin', 'Author'].includes(authData.user.role) && (
                <div className="flex justify-end space-x-4 mt-8">
                  {/* <Link href={`/books/edit/${id}`} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                    Edit
                  </Link> */}
                  {authData?.user.role && ['Admin', 'Author'].includes(authData.user.role) && (
                    <DeleteBookComponent forumId={id} />
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
        <h2 className="flex justify-between items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Discussion


          {/* To be shown only to admin and the related users */}
          {authData?.user?.role && ['Admin', 'Author'].includes(authData?.user?.role) && (

            <div>
              <div className="flex text-sm items-center justify-center py-4">
                <div className="flex border border-lightred font-medium rounded-full overflow-hidden">
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
            </div>)}

        </h2>


        {commentsData && commentsData.length > 0 ? (
          <div className="space-y-4">
            {commentsData?.map((comment, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              >
                {/* Comment Header */}
                <div className="flex justify-between items-center mb-3 w-full">
                  <div className="flex items-center">
                    <div className="relative h-12 w-12">
                      <Image
                        src={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.sWCvltMZF_s3mjA5sL-RdgHaE8%26pid%3DApi&f=1&ipt=e28cd914b5e66fe7d48ce2ea62ce3e9a598fd9f8e2b9458cabfd9cad6fcc8679&ipo=images"}
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

                  <div className="ml-4 text-2xl flex gap-4">
                  <Tooltip content={comment.isPublished ? 'Unpublish comment':'Publish Comment'} className="">

                    {
                      <button
                        onClick={() => comment.isPublished ? handleUnpublishReply(comment._id) : handlePublishReply(comment._id)}
                        className="text-2xl"
                        disabled={false}
                      >
                        {false &&
                          (
                            <div
                              className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                              role="status">
                              <span
                                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                              >Loading...
                              </span>
                            </div>
                          )
                        }
                        {comment.isPublished ? (
                          <FaTimesCircle className="text-red-500" />
                        ) : (
                          <FaCheckCircle className="text-green-500" />
                        )}
                      </button>
                    }
                    </Tooltip>

                    {/* <button
                      onClick={() => { }}
                      className="text-2xl"
                      disabled={false}
                    >
                      {false &&
                        (
                          <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                            role="status">
                            <span
                              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                            >Loading...
                            </span>
                          </div>
                        )
                      }
                      <FaTrash className="hover:text-lightred" />

                    </button> */}
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