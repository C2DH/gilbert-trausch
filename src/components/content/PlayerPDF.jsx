import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PlayerPDF({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [initialScale, setInitialScale] = useState(1);
  const [fitToScreen, setFitToScreen] = useState(true);

  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const initializedRef = useRef(false); // évite le setScale en boucle

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageRenderSuccess = () => {
    if (!containerRef.current || !pageRef.current) return;

    const canvas = pageRef.current.querySelector('canvas');
    if (!canvas) return;

    const containerSize = containerRef.current.getBoundingClientRect();
    const { width: pdfWidth, height: pdfHeight } = canvas;

    const scaleWidth = containerSize.width / pdfWidth;
    const scaleHeight = containerSize.height / pdfHeight;
    const bestScale = Math.min(scaleWidth, scaleHeight);

    // On initialise le zoom automatique seulement une fois
    if (fitToScreen && !initializedRef.current) {
      setScale(bestScale);
      setInitialScale(bestScale);
      initializedRef.current = true;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (!fitToScreen || !containerRef.current || !pageRef.current) return;

      const canvas = pageRef.current.querySelector('canvas');
      if (!canvas) return;

      const containerSize = containerRef.current.getBoundingClientRect();
      const scaleWidth = containerSize.width / canvas.width;
      const scaleHeight = containerSize.height / canvas.height;
      const bestScale = Math.min(scaleWidth, scaleHeight);

      if (Math.abs(scale - bestScale) > 0.01) {
        setScale(bestScale);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToScreen, scale]);

  const nextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
    setFitToScreen(false);
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
    setFitToScreen(false);
  };

  const resetZoom = () => {
    setScale(initialScale);
    setFitToScreen(true);
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        'w-full h-[calc(100vh-120px)] flex justify-center items-center',
        {
          'overflow-hidden': fitToScreen,
          'overflow-auto': !fitToScreen,
        }
      )}
    >
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          inputRef={pageRef}
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          scale={scale}
          onRenderSuccess={onPageRenderSuccess}
          className="react-pdf-page"
        />
      </Document>

      {/* Boutons de contrôle */}
      <div className="absolute bottom-[10px] left-[50%] -translate-x-[50%]">
        <div className="flex justify-center">
          <div className="flex cursor-pointer">
            <div
              className="border border-black"
              style={{
                borderTopLeftRadius: '6px',
                borderBottomLeftRadius: '6px',
              }}
              onClick={prevPage}
            >
              <ArrowLeftIcon
                className={classNames(
                  'px-[15px] py-[8px] w-[50px]',
                  { 'pointer-events-none opacity-30': pageNumber === 1 }
                )}
              />
            </div>
            <div
              className="border-t border-b border-r border-black"
              onClick={zoomOut}
            >
              <MagnifyingGlassMinusIcon
                className={classNames(
                  'px-[15px] py-[8px] w-[50px]',
                  { 'pointer-events-none opacity-30': scale === 0.5 }
                )}
              />
            </div>
            <div
              className="uppercase text-[14px] flex items-center border-t border-b border-black px-[12px] cursor-pointer"
              onClick={resetZoom}
            >
              <span>Reset</span>
            </div>
            <div
              className="border-t border-b border-l border-black"
              onClick={zoomIn}
            >
              <MagnifyingGlassPlusIcon
                className={classNames(
                  'px-[15px] py-[8px] w-[50px]',
                  { 'pointer-events-none opacity-30': scale === 2.0 }
                )}
              />
            </div>
            <div
              className="border border-black"
              style={{
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
              }}
              onClick={nextPage}
            >
              <ArrowRightIcon
                className={classNames(
                  'px-[15px] py-[8px] w-[50px]',
                  { 'pointer-events-none opacity-30': pageNumber === numPages }
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
