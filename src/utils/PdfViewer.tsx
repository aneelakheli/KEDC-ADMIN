'use client'
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/build/pdf.worker.min.mjs`
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

const PdfViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const goToPrevPage = () => {
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
    };

    return (
        <div>
            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {/* {Array.from(new Array(numPages || 0), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))} */}
                <Page pageNumber={pageNumber} 
                className={"w-full"}/>
            </Document>
            <div style={{ marginTop: '10px' }}>
                <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    Previous
                </button>
                <span style={{ margin: '0 15px' }}>
                    Page {pageNumber} of {numPages}
                </span>
                <button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PdfViewer;

