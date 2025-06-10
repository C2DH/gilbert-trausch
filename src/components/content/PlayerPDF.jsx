import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export default function PlayerPDF({ url, optimized_url, id }) {

    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (!location.pathname.startsWith('/resources/')) {
            navigate(`/resources/${id}`, { state: { modal: true, previousLocation: location } });
        }
    };
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [inputPage, setInputPage] = useState('1')
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

        // Calcul du ratio unique
        const widthRatio = originalWidth / originalHeight;
    
        // Détecte si c'est portrait ou paysage
        const isPortrait = originalHeight > originalWidth;
        const isLandscape = originalWidth > originalHeight;
    
        if (isPortrait) {
            // setRenderHeight(containerHeight);
            setRenderWidth(widthRatio * containerHeight); // Calcule la largeur basée sur la hauteur
            setRenderHeight(containerWidth / widthRatio); 
        } else if (isLandscape) {
            // setRenderWidth(containerWidth);
            setRenderHeight(containerWidth / widthRatio); // Calcule la hauteur basée sur la largeur
            setRenderWidth(widthRatio * containerHeight)
        }
    };

    useEffect(() => {
        calculateRenderDimensions();
        window.addEventListener('resize', calculateRenderDimensions);
        return () => window.removeEventListener('resize', calculateRenderDimensions);
    }, [originalWidth, originalHeight, numPages]);

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

    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

        const handleInputBlurOrEnter = () => {
        let page = parseInt(inputPage, 10);
        if (!page || page < 1) page = 1;
        else if (page > numPages) page = numPages;
        setPageNumber(page);
        setInputPage(String(page));
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInputBlurOrEnter();
        }
    };

    useEffect(() => {
        setInputPage(String(pageNumber));
    }, [pageNumber]);

    return (
        <>
            <div ref={containerRef} className="h-[52vh] ] md:h-[calc(100vh-100px)] mb-[20px] overflow-scroll scrollbar_pdf flex lg:block justify-center inputPage" onClick={() => { handleClick }}>
                <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                    <Page
                        onClick={() => { handleClick() }}
                        pageNumber={pageNumber}
                        width={renderWidth}
                        // height={renderHeight}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>

                {/* Controls Desktop */}
                <div className="hidden lg:block absolute bottom-[10px] left-1/2 -translate-x-1/2">
                    <div className="flex">
                        <div className="border border-black rounded-l-md" onClick={prevPage}>
                            <ArrowLeftIcon
                            className={classNames('px-4 py-2 w-[50px] cursor-pointer', {
                                'pointer-events-none opacity-30': pageNumber === 1,
                            })}
                            />
                        </div>

                        <div className="border-y border-r border-black" onClick={zoomOut}>
                            <MagnifyingGlassMinusIcon className="px-4 py-2 w-[50px] cursor-pointer" />
                        </div>

                        <input
                            type="number"
                            min={1}
                            max={numPages || 1}
                            value={inputPage}
                            onChange={handleInputChange}
                            onBlur={handleInputBlurOrEnter}
                            onKeyDown={handleInputKeyDown}
                            className="border-y border-black text-sm text-center pl-[5px] outline-none bg-transparent"
                        />

                        <div className="border-y border-black text-sm flex items-center pr-[10px] cursor-default">
                            / {numPages || '?'}
                        </div>

                        <div className="border-y border-l border-black" onClick={zoomIn}>
                            <MagnifyingGlassPlusIcon className="px-4 py-2 w-[50px] cursor-pointer" />
                        </div>
                        
                        <div className="border border-black rounded-r-md" onClick={nextPage}>
                            <ArrowRightIcon
                            className={classNames('px-4 py-2 w-[50px] cursor-pointer', {
                                'pointer-events-none opacity-30': pageNumber === numPages,
                            })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Mobile */}
            <div className="lg:hidden flex justify-center pb-[50px]">
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
