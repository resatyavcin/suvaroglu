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
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogHeader } from './ui/dialog';
import { Button } from './ui/button';

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
        <DialogTrigger className="w-full">
          <Document
            file={pdfURL}
            onLoadSuccess={onDocumentLoadSuccess}
            className={'mx-auto'}
          >
            <Page width={200} height={660} pageNumber={1} />
          </Document>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen">
          <DialogHeader>
            <DialogDescription>
              <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess}>
                <Page className={'mt-11'} width={300} pageNumber={pageNumber} />
                <p>
                  {pageNumber} / {numPages}
                </p>
                <div className="mt-7">
                  {pageNumber !== 1 && (
                    <Button
                      onClick={() => {
                        setPageNumber((prev) => {
                          return prev - 1;
                        });
                      }}
                    >
                      Önceki Sayfa
                    </Button>
                  )}
                  {pageNumber != numPages && (
                    <Button
                      onClick={() => {
                        setPageNumber((prev) => {
                          return prev + 1;
                        });
                      }}
                    >
                      Sonraki Sayfa
                    </Button>
                  )}
                </div>
              </Document>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileView;
