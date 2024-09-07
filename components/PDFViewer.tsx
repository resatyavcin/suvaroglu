'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { pdfjs } from 'react-pdf';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogHeader } from './ui/dialog';

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
    <div>
      <Dialog>
        <DialogTrigger>
          <Document
            file={pdfURL}
            onLoadSuccess={onDocumentLoadSuccess}
            className={'flex flex-col items-center'}
          >
            <Page width={200} height={660} pageNumber={pageNumber} />
          </Document>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen">
          <DialogHeader>
            <DialogDescription>
              <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess}>
                <Page height={667} width={300} pageNumber={pageNumber} />
              </Document>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileView;
