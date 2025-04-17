import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export default function PlayerPDF({ url, optimized_url }) {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [renderWidth, setRenderWidth] = useState(0);
    const [renderHeight, setRenderHeight] = useState(0);
    const containerRef = useRef(null);
    const originalWidth = optimized_url?.large?.originalWidth || 1000;
    const originalHeight = optimized_url?.large?.originalHeight || 1400;

    const calculateRenderDimensions = () => {
        const container = containerRef.current;
        if (!container) return;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight; 

        // Calcul Ratio PDF 
        const widthRatio = originalWidth / originalHeight;
        const heightRatio = originalHeight / originalWidth;

        // Détecte si c'est portrait ou paysage
        const isPortrait = originalHeight > originalWidth;
        const isLandscape = originalWidth > originalHeight;

        if (isPortrait) {
            setRenderHeight(containerHeight);
            const newWidth = widthRatio * containerHeight;
            setRenderWidth(newWidth);
        } else if (isLandscape) {
            setRenderWidth(containerWidth);
            const newHeight = heightRatio * containerWidth;
            setRenderHeight(newHeight);
        }
    };

    useEffect(() => {
        calculateRenderDimensions();
        window.addEventListener('resize', calculateRenderDimensions);
        return () => window.removeEventListener('resize', calculateRenderDimensions);
    }, [originalWidth, originalHeight]);

    const zoomIn = () => {
        setRenderWidth((prev) => prev * 1.05); // Zoom 5% en plus
        setRenderHeight((prev) => prev * 1.05); // Zoom 5% en plus
    };

    const zoomOut = () => {
        setRenderWidth((prev) => prev * 0.95); // Zoom 5% en moins
        setRenderHeight((prev) => prev * 0.95); // Zoom 5% en moins
    };

    const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
    const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));

    return (
        <>
            <div ref={containerRef} className="w-full h-full flex justify-center items-center overflow-hidden mb-[20px] lg:mb-0">
                <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                    <Page
                    pageNumber={pageNumber}
                    width={renderWidth}
                    height={renderHeight}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    />
                </Document>

                {/* Contrôles */}
                <div className="hidden xl:block absolute bottom-[10px] left-1/2 -translate-x-1/2">
                    <div className="flex">
                        <div className="border border-black rounded-l-md" onClick={prevPage}>
                            <ArrowLeftIcon
                            className={classNames('px-4 py-2 w-[50px]', {
                                'pointer-events-none opacity-30': pageNumber === 1,
                            })}
                            />
                        </div>

                        <div className="border-y border-r border-black" onClick={zoomOut}>
                            <MagnifyingGlassMinusIcon className="px-4 py-2 w-[50px]" />
                        </div>

                        <div className="border-y border-black text-sm flex items-center px-3 cursor-default">
                            {`${pageNumber} / ${numPages || '?'}`}
                        </div>

                        <div className="border-y border-l border-black" onClick={zoomIn}>
                            <MagnifyingGlassPlusIcon className="px-4 py-2 w-[50px]" />
                        </div>
                        
                        <div className="border border-black rounded-r-md" onClick={nextPage}>
                            <ArrowRightIcon
                            className={classNames('px-4 py-2 w-[50px]', {
                                'pointer-events-none opacity-30': pageNumber === numPages,
                            })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contrôles */}
            <div className="xl:hidden flex">
                <div className="border border-black rounded-l-md" onClick={prevPage}>
                    <ArrowLeftIcon
                    className={classNames('px-4 py-2 w-[50px]', {
                        'pointer-events-none opacity-30': pageNumber === 1,
                    })}
                    />
                </div>

                <div className="border-y border-r border-black" onClick={zoomOut}>
                    <MagnifyingGlassMinusIcon className="px-4 py-2 w-[50px]" />
                </div>

                <div className="border-y border-black text-sm flex items-center px-3 cursor-default">
                    {`${pageNumber} / ${numPages || '?'}`}
                </div>

                <div className="border-y border-l border-black" onClick={zoomIn}>
                    <MagnifyingGlassPlusIcon className="px-4 py-2 w-[50px]" />
                </div>
                
                <div className="border border-black rounded-r-md" onClick={nextPage}>
                    <ArrowRightIcon
                    className={classNames('px-4 py-2 w-[50px]', {
                        'pointer-events-none opacity-30': pageNumber === numPages,
                    })}
                    />
                </div>
            </div>
        </>
    )
}
