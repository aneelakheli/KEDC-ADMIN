import { getPublishedComments, updateCommentStatus } from '@/serivces/catalogueService';
import { Comment } from '@/types/comment';
import notify from '@/utils/notify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function ApprovedCommentsList({ catalogueId }: { catalogueId: String }) {
    const queryClient = useQueryClient();

    const { data: commentData, isLoading, error, isError } = useQuery({
        queryKey: ['publishedComments', catalogueId],
        queryFn: () => getPublishedComments(catalogueId),
    });

    const toggleApprovalMutation = useMutation({
        mutationFn: (comment: Comment) =>
            updateCommentStatus(catalogueId, comment._id, { isPublished: !comment.isPublished }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['publishedComments', catalogueId]);
            console.log(data);
        },
        onError: (err) => {
            notify(err.message || "Failed to approve message", "error")
        }
    });

    const toggleApproval = (comment: Comment) => {
        if (!toggleApprovalMutation.isLoading) {
            toggleApprovalMutation.mutate(comment);
        }
    };
    console.log("Approved Comments",commentData)

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
            {isLoading ? (
                <div
                    className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...
                    </span>
                </div>
            ) :(!(commentData?.data?.length > 0)) ?
                (<div>No Comments Found!</div>) :
                (commentData?.data?.map((comment: Comment) => (
                    <div key={comment._id} className="mb-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{comment.commentBy}</h3>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{comment.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{comment.description}</p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p>Commented by: {comment.commentBy}</p>
                                <p>{moment(comment.createdAt).fromNow()}</p>
                            </div>
                        </div>
                        <div className="ml-4 text-2xl">
                            {
                                <button
                                    onClick={() => toggleApproval(comment)}
                                    className="text-2xl"
                                    disabled={toggleApprovalMutation.isLoading}
                                >
                                    {toggleApprovalMutation.isLoading &&
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
                        </div>
                    </div>
                )
                ))}
            {isError && (
                <div className="text-red-600 dark:text-red-400">An error occurred while fetching comments.</div>
            )}
        </div>
    );
}

export default ApprovedCommentsList;
