import { useEffect, useRef, useState } from "react";
import background from "../assets/images/backgrounds/bg-1.webp";
import MultiRangeSlider from "multi-range-slider-react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import classNames from 'classnames';
import { formatTypeName } from "../lib/utils";
import audioLogo from '../assets/images/audio.svg'
import videoLogo from '../assets/images/video.svg'
import { easeInOut } from "motion";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import bgAudio from '../assets/images/backgrounds/bg-audio-default.webp';
import { motion, useInView } from "motion/react";

const PER_PAGE = 100;

export default function Resources() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { i18n, t } = useTranslation();
    const locale = i18n.language;
    const [documents, setDocuments] = useState({});
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [types, setTypes] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        types: [],
        tags: []
    });
    const [datesCount, setDatesCount] = useState([]);
    const [ , setTotal] = useState(null);
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [resetDates, setResetDates] = useState(false);
    const [tags, setTags] = useState([]);
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const loadMoreRef = useRef(null);
    const containerRef = useRef(null);
    const loadMoreRefInView = useInView(loadMoreRef, { root: containerRef, initial: false, margin: "0px 0px 0px 0px" });

    const handleSelection = (e, type) => {
        setSelectedFilters(prevFilters => {
            if (type === 'type') {
                return {
                    ...prevFilters,
                    types: prevFilters.types.includes(e.target.dataset.type)
                        ? prevFilters.types.filter(t => t !== e.target.dataset.type)
                        : [...prevFilters.types, e.target.dataset.type]
                };
            }
    
            if (type === 'tag') {
                return {
                    ...prevFilters,
                    tags: prevFilters.tags.includes(parseInt(e.target.dataset.tag)) ? prevFilters.tags.filter(t => t !== parseInt(e.target.dataset.tag)) : [...prevFilters.tags, parseInt(e.target.dataset.tag)]
                };
            }
    
            return prevFilters;
        })
    }

    const fetchResources = () => {
        const params = new URLSearchParams();

        if (selectedFilters.types.length > 0) {
            params.append("types", selectedFilters.types.join(","));
        }

        if (selectedFilters.tags.length > 0) {
            params.append("tags", selectedFilters.tags.join(","));
        }

        if (search !== "") {
            params.append("q", search);
        }

        if (minDate || maxDate) {
            if (minDate && maxDate) {
                params.append("minDate", minDate);
                params.append("maxDate", maxDate);
            } else if (minDate) {
                params.append("minDate", minDate);  // Filtrage uniquement par date de début
            } else if (maxDate) {
                params.append("maxDate", maxDate);  // Filtrage uniquement par date de fin
            }
        }

        params.append("page", page);
        params.append("perPage", PER_PAGE);

        const url = `${API_URL}/api/resources?${params.toString()}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setDocuments(documents => ({ ...documents, [page]: data.resources.data }));
                setHasNextPage(data.resources.current_page < data.resources.last_page);
                setTypes(data.types);
                setDatesCount(data.dates);
                setTotal(data.resources.total);
                setIsLoading(true);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des données :", error)
                setDocuments({});
            });
    }

    // RESOURCES
    useEffect(() => {
        setPage(1);
        setDocuments({});
        setIsLoading(false);
        fetchResources();
    }, [search, minDate, maxDate, selectedFilters, locale]); 

    useEffect(() => {
        setIsLoading(false);
        fetchResources();
    }, [page]);

    useEffect(() => {
        if (loadMoreRefInView) {
            setPage(page + 1);
        }
    }, [loadMoreRefInView]);

    // TAGS 
    useEffect(() => {
        const url = `${API_URL}/api/tags`;
    
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setTags(data.data)
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des tags :", error)
                setTags([]);
            });
    }, []); 
    
    useEffect(() => {
        if (imagesLoaded === documents.length) {
            setImagesLoaded(true);
        }
    }, [imagesLoaded, documents.length]);

    return (
            <motion.div
                style={{ background: `url(${background}) right / cover no-repeat` }} className='h-[100dvh]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ easeInOut, duration: 1.2 }}>
                <div className="resources relative top-[40px]">
                    
                    {/** SEARCH */}
                    <div className="search lg:border-b border-black">
                        <div className="container mx-auto px-[20px] xl:px-0">
                            <div className="grid grid-cols-12 h-[120px]">
                                <div className="col-span-12 lg:col-span-3 flex items-center justify-center xl:justify-start">
                                    <h1 className="text-[24px] md:text-[30px] xl:text-[60px] text-[#4100FC] leading-none font-light">{ t('resources')}</h1>
                                </div>

                                <div className="col-span-12 lg:col-span-8 xl:col-start-5 flex items-center">
                                    <div className="flex-1 border-b border-black">
                                        <div className="flex justify-between">
                                            <input className="bg-transparent fl lg:w-1/2 text-[22px] xl:text-[32px] text-[#4100FC] outline-none" type="text" placeholder={ t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
                                            <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.8125 9.6875C15.8125 7.23828 14.4805 5.00391 12.375 3.75781C10.2266 2.51172 7.60547 2.51172 5.5 3.75781C3.35156 5.00391 2.0625 7.23828 2.0625 9.6875C2.0625 12.1797 3.35156 14.4141 5.5 15.6602C7.60547 16.9062 10.2266 16.9062 12.375 15.6602C14.4805 14.4141 15.8125 12.1797 15.8125 9.6875ZM14.4805 16.7344C12.9336 17.9375 11 18.625 8.9375 18.625C3.99609 18.625 0 14.6289 0 9.6875C0 4.78906 3.99609 0.75 8.9375 0.75C13.8359 0.75 17.875 4.78906 17.875 9.6875C17.875 11.793 17.1445 13.7266 15.9414 15.2734L21.6992 20.9883C22.0859 21.418 22.0859 22.0625 21.6992 22.4492C21.2695 22.8789 20.625 22.8789 20.2383 22.4492L14.4805 16.7344Z" fill="#4100FC"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** CONTENT */}
                    <div className="container mx-auto lg:border-r border-black">
                        <div className="grid grid-cols-12 px-[20px] xl:px-0 gap-x-[20px]">
                            
                            {/** DOCUMENTS */}
                            { Object.values(documents).flat().length > 0 ? (
                                    <div className="col-span-12 lg:col-span-9 flex h-[calc(100dvh-160px)] overflow-y-auto" ref={containerRef}>
                                        <div className="flex-1  py-[30px]">
                                            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 3, 768: 3, 1024: 3, 1280: 4 }} gutterBreakpoints={{ 300: "12px", 768: "16px", 1024: "20px" }}>
                                                <Masonry>
                                                {Object.values(documents).flat().map((document, index) => {
                                                    const aspectRatio = (document?.optimized_url?.thumbnail?.height / document?.optimized_url?.thumbnail?.width) * 100; // Ratio pour le padding-bottom

                                                    {/** AUDIO - VIDEO */}
                                                    if (document.type === "audio" || document.type === "video") {
                                                        if (document?.cover?.[locale]) {
                                                            return (
                                                                <div key={index} className="audio relative overflow-hidden cursor-pointer w-full aspect-square lg:h-[300px] xl:h-[400px]" style={{ paddingBottom: `${aspectRatio}%`}} 
                                                                    onClick={() => { navigate(`/resources/${document.id}`, { state: { modal: true, previousLocation: location } }) }}  
                                                                >
                                                                    <img loading="lazy" src={ document.cover[locale] } alt={document?.name[locale]} className="w-full hover:scale-[1.2] transition-all duration-[750ms]" 
                                                                        style={{position: 'absolute',top: 0,left: 0, width: '100%', height: '100%', objectFit: 'cover'}} 
                                                                        onLoad={() => setImagesLoaded(true)}
                                                                    />
                                                                </div> 
                                                            )
                                                        } else {
                                                            return (
                                                                <div key={index} className="relative overflow-hidden cursor-pointer w-full" onClick={() => { navigate(`/resources/${document.id}`, { state: { modal: true, previousLocation: location } }) }}>
                                                                    <div className="bg-[#DBDBD0] w-full aspect-square flex justify-center items-center relative border border-black rounded-[6px]">
                                                                        { document.type === "audio" ? (
                                                                            <img src={ bgAudio } alt="Logo audio" className="aspect-square rounded-[6px]"/>
                                                                        ) : (
                                                                            <img src={ videoLogo } alt="Logo video" className="h-[50px] lg:h-[120px] rounded-[6px]"/>
                                                                        )}
                                                                        <span className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[12px] leading-[15px] md:text-[14px] md:leading-[20px] italic text-center">{ document.name[locale] }</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    }

                                                    if (document.type !== 'video' && document.type !== 'audio' && document.optimized_url ) {
                                                        return (
                                                            <div 
                                                                key={index} 
                                                                className="cursor-pointer overflow-hidden relative" style={{ width: `${document?.optimized_url?.thumbnail?.width}%`, height: `${document?.optimized_url?.thumbnail?.height}`}} 
                                                                onClick={() => { navigate(`/resources/${document.id}`, { state: { modal: true, previousLocation: location } }) }}
                                                            >
                                                                <img 
                                                                    loading="lazy" 
                                                                    src={document?.optimized_url?.thumbnail?.url }
                                                                    alt={document?.name[locale]} 
                                                                    className="w-full h-full hover:scale-[1.2] transition-all duration-[750ms]"
                                                                    onLoad={() => setImagesLoaded(true)}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                    }
                                                )}
                                            </Masonry>
                                        </ResponsiveMasonry>

                                        {hasNextPage && <div ref={loadMoreRef} className="flex justify-center items-center h-[100px]"><button onClick={() => setPage(page + 1)} className="bg-[#4100FC] text-sm text-white px-[20px] py-[10px] rounded-[6px]">{t('load_more')}</button></div>}
                                    </div>
                                </div>
                                ) : (
                                    <div className="col-span-9 flex h-[calc(100dvh-160px)] justify-center items-center">{ t('no_resources') }</div>
                                )}


                            <div className="hidden lg:flex flex-col col-span-3 border-l border-black h-[calc(100dvh-160px)] overflow-hidden">
                                <div className="flex-1 overflow-y-auto">

                                    {/** TYPES */}
                                    <div className="types-block border-b border-black px-[20px] pb-[10px]">
                                        <div className="flex justify-between py-[20px] ">
                                            <span className="text-[#4100FC] font-semibold text-[18px]">{ t('media_types') }</span>
                                            <span className="text-[#4100FC] font-semibold text-[15px] cursor-pointer uppercase" onClick={() => setSelectedFilters(prev => ({ ...prev, types: [] }))}>Reset</span>
                                        </div>

                                        {types.length > 0 && types?.map(type =>
                                            <div key={type.type} className={classNames("flex justify-between", {
                                                'opacity-50':  !selectedFilters.types.includes(type.type),
                                                'opacity-100': selectedFilters.types.length === 0
                                            })}>
                                                <span className="text-[18px] leading-[30px] capitalize cursor-pointer hover:text-[#4100FC] duration-300" data-type={ type.type } onClick={(e) => handleSelection(e, 'type')}>{formatTypeName(type.type, locale)}</span>
                                                <span className="text-[18px] leading-[30px] cursor-pointer hover:text-[#4100FC] duration-300">{type.count}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/** PERIODS */}
                                    <div className="periods_block border-b border-black pb-[30px] px-[20px]">
                                        <div className="flex justify-between pt-[10px]">
                                            <span className="text-[#4100FC] font-semibold text-[18px]">{ t('period') }</span>
                                            <span className="text-[#4100FC] font-semibold text-[15px] cursor-pointer uppercase" onClick={() => {setResetDates(true)}}>Reset</span>
                                        </div>

                                        <div>
                                            <MultiRangeSelector dates={ datesCount } resetDates={ resetDates } setResetDates={ setResetDates } setMinDate={setMinDate} setMaxDate={setMaxDate}/>
                                        </div>
                                    </div>

                                    {/** TAGS */}
                                    <div className="tags_block px-[20px] flex flex-col overflow-hidden">
                                        <div className="flex justify-between py-[10px] ">
                                            <span className="text-[#4100FC] font-semibold text-[18px]">Tags</span>
                                            <span className="text-[#4100FC] font-semibold text-[15px] cursor-pointer uppercase" onClick={() => setSelectedFilters(prev => ({ ...prev, tags: [] }))}>Reset</span>
                                        </div>
                                        <div className="flex-auto overflow-y-auto pb-[20px] gap-y-[10px] gap-x-[5px] flex flex-wrap">
                                            { tags?.map(tag => 
                                                <span 
                                                    key={ tag.id } 
                                                    data-tag= { tag.id } 
                                                    onClick={(e) => handleSelection(e, 'tag')}
                                                    className={classNames('inline-block py-[4px] px-[6px] text-[11px] uppercase border border-black rounded-[4px] leading-none hover:bg-[#4100FC] hover:text-white hover:border-[#4100FC] cursor-pointer duration-500', {
                                                        'bg-[#4100FC] text-white border border-black': selectedFilters.tags.includes(tag.id),
                                                        'bg-none': !selectedFilters.tags.includes(tag.id),
                                                    })}
                                                >{ tag?.name[locale]}</span>
                                            
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/** BTN MOBILE FILTERS */}
                        <div className="lg:hidden fixed left-0 right-0 bottom-0 bg-white h-[40px] flex justify-center items-center border-t border-black cursor-pointer z-[101]" onClick={() => setIsOpenFilters(!isOpenFilters)}>
                            <span className="text-blue test-[18px] md:text-[22px] font-semibold uppercase cursor-">{isOpenFilters ? t('close') : t('filters') }</span>
                        </div>
                        
                        {/** MOBILE FILTERS */}
                        <div className={classNames("lg:hidden fixed bottom-[40px] bg-white flex flex-col h-[50%] left-0 right-0 transition-all duration-[750ms] z-[100] border-t border-black overflow-scroll", {
                                "translate-y-[100%]": !isOpenFilters
                            })}
                        >
                            {/** TYPES */}
                            <div className="types-block border-b border-black px-[20px] pb-[10px] flex-grow">
                                <div className="flex justify-between py-[30px]">
                                    <span className="text-[#4100FC] font-semibold text-[18px]">Types de média</span>
                                    <span className="text-[#4100FC] font-semibold text-[15px] cursor-pointer uppercase" onClick={() => setSelectedFilters(prev => ({ ...prev, types: [] }))}>Reset</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {types.length > 0 && types?.map(type =>
                                        <div key={type.type} 
                                            className={classNames("flex justify-between border border-black gap-2 px-[5px] rounded-[5px] group hover:bg-[#4100FC] hover:text-white duration-300 cursor-pointer", {
                                            'bg-[#4100FC] text-white':  selectedFilters.types.includes(type.type)
                                            })}
                                            onClick={(e) => handleSelection(e, 'type')}
                                        >
                                            <span className="text-[14px] capitalize" data-type={ type.type }>{formatTypeName(type.type, locale)}</span>
                                            <span className="text-[14px] font-extralight">{type.count}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/** PERIODS */}
                            <div className="periods_block border-b border-black pb-[25px] px-[20px] h-[190px]">
                                <div className="flex justify-between pt-[20px]">
                                    <span className="text-[#4100FC] font-semibold text-[18px]">Période</span>
                                    <span className="text-[#4100FC] font-semibold text-[15px] cursor-pointer uppercase" onClick={() => setResetDates(true)}>Reset</span>
                                </div>

                                <div>
                                    <MultiRangeSelector dates={ datesCount } resetDates={ resetDates } setResetDates={ setResetDates } setMinDate={setMinDate} setMaxDate={setMaxDate}/>
                                </div>
                            </div>

                            {/** TAGS */}
                            <div className="tags_block px-[20px] flex flex-col flex-grow">
                                <div className="flex justify-between py-[20px] ">
                                    <span className="text-[#4100FC] font-semibold text-[18px]">Tags</span>
                                    <span className="text-[#4100FC] font-semibold text-[15px] cursor-pointer uppercase" onClick={() => setSelectedFilters(prev => ({ ...prev, tags: [] }))}>Reset</span>
                                </div>
                                <div className="flex-auto overflow-y-auto pb-[20px] gap-[10px] flex flex-wrap">
                                    { tags?.map(tag => 
                                        <span 
                                            key={ tag.id } 
                                            data-tag= { tag.id } 
                                            onClick={(e) => handleSelection(e, 'tag')}
                                            className={classNames('inline-block py-[4px] px-[10px] text-[12px] uppercase border border-black rounded-[6px] leading-none hover:bg-[#4100FC] hover:text-white hover:border-[#4100FC] cursor-pointer duration-500', {
                                                'bg-[#4100FC] text-white border border-black': selectedFilters.tags.includes(tag.id),
                                                'bg-none': !selectedFilters.tags.includes(tag.id),
                                            })}
                                        >
                                            { tag?.name[locale]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div >      
    )    
}


const MultiRangeSelector = ({ dates, resetDates, setResetDates, setMinDate ,setMaxDate }) => {
    const labels = ["1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010", "2020"];
    const [minDateCaption, setMinDateCaption] = useState(labels[0]);
    const [maxDateCaption, setMaxDateCaption] = useState(labels[labels.length - 1]);

    useEffect(() => {
        if (resetDates) {
            setMinDateCaption(labels[0]);
            setMaxDateCaption(labels[labels.length - 1]);
            setMinDate("");
            setMaxDate("");
            setResetDates(false);
        }   
    }, [resetDates])

    const handleMove = (e) => {
        if (!resetDates) {
            setMinDateCaption(labels[e.minValue]);
            setMaxDateCaption(labels[e.maxValue]);
            setMinDate(labels[e.minValue]);
            setMaxDate(labels[e.maxValue]);
        }
    }

    const handleCaptions = (e) => {
        setMinDateCaption(labels[e.minValue]);
        setMaxDateCaption(labels[e.maxValue]);
    }

    const getTotal = () => dates.reduce((total, item) => total + item.count, 0);

    return (
        <>
            <div className="flex h-[70px] items-end justify-items-start pb-[3px] px-[1px] space-x-[1px]">
                {dates.map((item, index) => {
                    const heightPercentage = getTotal() > 0 ? (item.count / getTotal() * 100) : 0;
                    return (
                        <div key={index} className="bg-blue w-full" style={{ height: `${heightPercentage}%`}}></div>
                    );
                })}
            </div>

            <MultiRangeSlider
                key={resetDates ? Math.random() : "slider"} 
                labels={labels}
                ruler={ false }
                step={1}
                min={0}
                max={labels.length - 1}
                minValue={0}
                maxValue={labels.length - 1}
                minCaption={minDateCaption}
                maxCaption={maxDateCaption}
                onInput={handleCaptions}
                onChange={handleMove}
            />
        </>
    )
}




{/* <div className="absolute top-0 left-0">
    <span className="text-white bg-black inline-block p-2">{ document.id} - {document.name[locale]}</span>
    
    {document.tags.map(tag => 
        <span key={tag.id} className="block font-bold text-white bg-black p-2 text-[14px] leading-[5px]">{ tag.name[locale]}</span>
    )}

    <span className="text-[14px] text-amber-500 bg-black p-2">{document.type}</span>
    <span className="text-[14px] text-amber-500 bg-black p-2">{document.date}</span>
</div> */}

