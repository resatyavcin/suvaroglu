'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FileView = ({
  pdfURL,
  children,
}: {
  pdfURL: string;
  children: React.ReactNode;
}) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const searchParams = useSearchParams();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Document
      file={pdfURL}
      onLoadSuccess={onDocumentLoadSuccess}
      className={'flex flex-col items-center'}
    >
      <Page width={200} height={660} pageNumber={pageNumber} />
    </Document>
  );
};

export default FileView;
