"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/serivces/bookService";
import { useState } from "react";
import notify from "@/utils/notify";
import { deleteCatalogue, getOneCatalogue } from "@/serivces/catalogueService";
import CommentForm from "./CommentForm";
import PdfViewer from "@/utils/PdfViewer";
import NewCommentsList from "./NewCommentsList";
import ApprovedCommentsList from "./ApprovedCommentsList";
import { useAuth } from "@/context/AuthContext";
import { QRCodeGenerator } from "../qrCode/QRCode";

function ErrorComponent({ errorMessage }: { errorMessage: string }) {
  return (
    <div
      className="text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800 mb-4 rounded-lg p-4 text-sm"
      role="alert"
    >
      <svg
        className="mr-2 inline h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-11.412a.75.75 0 00-1.36 0l-3 6.5a.75.75 0 001.36.64l.784-1.697h3.433l.784 1.696a.75.75 0 001.36-.638l-3-6.5zM9.25 12a.75.75 0 101.5 0 .75.75 0 00-1.5 0z"
          clipRule="evenodd"
        />
      </svg>
      {errorMessage}
    </div>
  );
}

function CatalogueDetail({ id }: { id: String }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { user } = useAuth();

  const {
    data: catalogueData,
    isSuccess,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["catalogue", id],
    queryFn: () => getOneCatalogue(id),
  });
  console.log(isLoading, error, isError, isLoading, catalogueData?.data);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const DeleteCataloguesComponent = ({
    catalogueId,
  }: {
    catalogueId: String;
  }) => {
    const router = useRouter();
    const [isDeletionLoading, setIsDeletionLoading] = useState(false);

    const handleDelete = async () => {
      setIsDeletionLoading(true);
      try {
        const response = await deleteCatalogue(catalogueId);

        if (response.success === true) {
          console.log("Catalgoue successfully deleted", response.data);
          notify("Catalgoue successfully deleted!", "success");
          router.push(`/catalogues/`);
        } else {
          console.error(
            "Error deleting Catalogue",
            response,
            "Data:",
            response.data,
          );
        }
      } catch (error) {
        console.error(
          "Caught Error",
          error.response.status,
          error.response.data.error,
        );
        return;
      } finally {
        setIsDeletionLoading(false);
      }
    };

    return (
      <div className="flex items-center justify-center">
        {isDeletionLoading ? (
          <button className="flex items-center justify-center gap-2 rounded bg-red px-4 py-2 text-white hover:bg-red">
            <div
              className="text-surface inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            Delete
          </button>
        ) : (
          <button
            className="rounded bg-red px-4 py-2 text-white hover:bg-red"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="dark:bg-gray-800 rounded-lg bg-white p-6 shadow-lg">
        {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Catalogue Details</h2> */}
        {isLoading && (
          <div className=" my-16 flex w-full items-center justify-center">
            <div className="h-48">
              <div className="absolute h-12 w-12 animate-spin rounded-md border-4 border-t-4 border-blue-500"></div>
            </div>
            <div className="my-4 text-xl font-semibold ">
              Loading <span className="animate-ping">...</span>
            </div>
          </div>
        )}

        {isError && <ErrorComponent errorMessage={error.message} />}

        {isSuccess && catalogueData && (
          <div>
            <div className="">
              {/* <div className="flex flex-col items-center">
                  <img
                    src={catalogueData.image}
                    alt="Book Image"
                    className="rounded-lg shadow-lg cursor-pointer"
                  />
                </div> */}

              <div className="flex flex-col items-center py-4">
                {/* <PdfViewer fileUrl={'/MLBOOK.pdf'} /> */}
                <PdfViewer fileUrl={catalogueData.catalogue} />
              </div>

              <div className="flex flex-col">
                <div className="mb-4">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    Title:
                  </span>
                  <span className="text-gray-900 ml-2 dark:text-white">
                    {catalogueData.title}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    Subject:
                  </span>
                  <span className="text-gray-900 ml-2 dark:text-white">
                    {catalogueData.category?.name || catalogueData.category}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-gray-900 my-6 text-lg font-bold dark:text-white">
                Catalogue Description
              </h2>
              <div className="text-gray-900 ml-2 dark:text-white">
                {catalogueData.description} Some random description here
              </div>
              <div className="">
                <QRCodeGenerator id={id} title={catalogueData.title} />
              </div>
            </div>
            {["Admin"].includes(user?.role) && (
              <div className="mt-8 flex space-x-4">
                <Link
                  href={`/catalogues/edit/${id}`}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Edit
                </Link>
                <DeleteCataloguesComponent catalogueId={id} />
              </div>
            )}
          </div>
        )}

        {!catalogueData && (
          <div className="my-16 flex w-full items-center justify-center">
            <div className="my-4 text-xl font-semibold ">
              No book found with id {id}
            </div>
          </div>
        )}
      </div>
      {["Admin", "Author"].includes(user?.role) && (
        <NewCommentsList catalogueId={id} />
      )}
      <ApprovedCommentsList catalogueId={id} />
      <CommentForm catalogueId={id} />
    </>
  );
}

export default CatalogueDetail;
