import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PlayerPDF({ url }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [initialScale, setInitialScale] = useState(1);
    const [fitToScreen, setFitToScreen] = useState(true); // Pour activer/désactiver le scroll
    const containerRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const onRenderSuccess = (page) => {
        if (!containerRef.current) return;

        const containerSize = containerRef.current.getBoundingClientRect();
        const { width, height } = page.getBoundingClientRect();

        setCanvasSize({ width, height });

        // Calcul du meilleur scale pour que le PDF remplisse l'écran sans être coupé
        const scaleHeight = containerSize.height / height;
        const scaleWidth = containerSize.width / width;
        const bestScale = Math.min(scaleHeight, scaleWidth); // Prend le plus petit pour ne pas dépasser

        setScale(bestScale);
        setInitialScale(bestScale);
    };

    useEffect(() => {
        const handleResize = () => {
            if (fitToScreen) {
                const containerSize = containerRef.current.getBoundingClientRect();
                const bestScale = Math.min(containerSize.height / canvasSize.height, containerSize.width / canvasSize.width);
                setScale(bestScale);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [fitToScreen, canvasSize]);

    const nextPage = () => {
        if (pageNumber < numPages) setPageNumber(pageNumber + 1);
    };

    const prevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    };

    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.2, 2.0));
        setFitToScreen(false); // Active le scroll après un zoom
    };

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
        setFitToScreen(false); // Active le scroll après un zoom
    };

    const resetZoom = () => {
        setFitToScreen(true); // Désactive le scroll
        setScale(initialScale); // Reprend la taille optimale
    };

    return (
        <div ref={containerRef} className={classNames("w-full h-[calc(100vh-120px)] flex justify-center items-center", { 
            "overflow-hidden": fitToScreen, // Pas de scroll tant qu’on est en taille initiale
            "overflow-auto": !fitToScreen // Scroll activé après zoom
        })}>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                    pageNumber={pageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    scale={scale}
                    onRenderSuccess={onRenderSuccess}
                    className="react-pdf-page"
                />
            </Document>

            {/* Boutons de contrôle */}
            <div className="absolute bottom-[10px] left-[50%] -translate-x-[50%]">
                <div className="flex justify-center">
                    <div className="flex cursor-pointer">
                        <div className="border border-black" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }} onClick={prevPage}>
                            <ArrowLeftIcon className={classNames('px-[15px] py-[8px] w-[50px]', { "pointer-events-none opacity-30": pageNumber === 1 })} />
                        </div>
                        <div className="border-t border-b border-r border-black" onClick={zoomOut}>
                            <MagnifyingGlassMinusIcon className={classNames('px-[15px] py-[8px] w-[50px]', { "pointer-events-none opacity-30": scale === 0.5 })} />
                        </div>
                        <div className="uppercase text-[14px] flex items-center border-t border-b border-black px-[12px] cursor-pointer" onClick={resetZoom}>
                            <span>Reset</span>
                        </div>
                        <div className="border-t border-b border-l border-black" onClick={zoomIn}>
                            <MagnifyingGlassPlusIcon className={classNames('px-[15px] py-[8px] w-[50px]', { "pointer-events-none opacity-30": scale === 2.0 })} />
                        </div>
                        <div className="border border-black" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }} onClick={nextPage}>
                            <ArrowRightIcon className={classNames('px-[15px] py-[8px] w-[50px]', { "pointer-events-none opacity-30": pageNumber === numPages })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
