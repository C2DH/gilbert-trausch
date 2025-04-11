import { useEffect, useState } from "react";
import background from "../assets/images/backgrounds/bg-1.webp";
import MultiRangeSlider from "multi-range-slider-react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import classNames from 'classnames';
import { formatTypeName } from "../lib/utils";
import audioLogo from '../assets/images/audio.svg'
import videoLogo from '../assets/images/video.svg'
import PopupResource from "./content/PopupResource";
import { AnimatePresence, motion } from "framer-motion";
import { easeInOut } from "motion";
import { useTranslation } from "react-i18next";
import { useSharedState } from "../contexts/ShareStateProvider";

export default function Resources() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { i18n, t } = useTranslation();
    const locale = i18n.language;
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [types, setTypes] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        types: [],
        tags: []
    });
    const [datesCount, setDatesCount] = useState([]);
    const [total, setTotal] = useState(null);
    const [dates, setDates] = useState("");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [resetDates, setResetDates] = useState(false);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [dataPopup, setDataPopup] = useState();
    const [tags, setTags] = useState([]);
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [sharedState, setSharedState] = useSharedState();
    

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

    useEffect(() => {
        setSharedState({ ...sharedState, showCurtains: false }) 
     }, [])
    
    // RESOURCES
    useEffect(() => {
        const params = new URLSearchParams();

        if (selectedFilters.types.length > 0) {
            console.log('types', selectedFilters.types)
            params.append("types", selectedFilters.types.join(","));
        }

        if (selectedFilters.tags.length > 0) {
            console.log('tags', selectedFilters.tags)
            params.append("tags", selectedFilters.tags.join(","));
        }

        if (search !== "") {
            console.log('q', search)
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

        const url = `${API_URL}/api/resources?${params.toString()}`;
        console.log("URL :", url); 
    
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // console.log("Documents reçus:", data.resources)
                setDocuments(data.resources.data);
                setTypes(data.types);
                setDatesCount(data.dates);
                setTotal(data.resources.total);
                setIsLoading(true);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des données :", error)
                setDocuments([]);
            });

            console.log('selected', selectedFilters)

    }, [search, minDate, maxDate, selectedFilters, locale]); 


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
                // console.log("Tags:", data.data)
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
        <>
            {/* <Navbar color={"#000000"}/> */}

            <motion.div 
                style={{ background: `url(${background}) right / cover no-repeat` }} className='h-screen'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ easeInOut, duration: 1.2 }}
            >
                <div className="resources relative top-[40px]">
                    
                    {/** SEARCH */}
                    <div className="search xl:border-b border-black">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-12 h-[120px] px-[20px] xl:px-0">
                                <div className="col-span-12 xl:col-span-3 flex items-center justify-center xl:justify-start">
                                    <h1 className="text-[30px] xl:text-[60px] text-[#4100FC] leading-none font-light">{ t('resources')}</h1>
                                </div>

                                <div className="col-span-12 xl:col-span-8 xl:col-start-5 flex items-center">
                                    <div className="flex-1 border-b border-black">
                                        <div className="flex justify-bewtween">
                                            <input className="bg-transparent flex-1 text-[22px] xl:text-[32px] text-[#4100FC] outline-none" type="text" placeholder={ t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
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
                        <div className="grid grid-cols-12 gap-x-[20px]">
                            
                            {/** DOCUMENTS */}
                            {isLoading && documents.length > 0 ? (
                                    <div className="col-span-12 lg:col-span-9 flex h-[calc(100vh-160px)] px-[20px] xl:px-0">
                                        <div className="flex-1 overflow-y-auto py-[30px]">
                                            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 3, 768: 3, 1024: 3, 1280: 4 }} gutterBreakpoints={{ 300: "12px", 768: "16px", 1024: "30px" }}>
                                                <Masonry>
                                                    {documents?.map((document, index) => {
                                                        const aspectRatio = (document?.optimized_url?.thumbnail?.height / document?.optimized_url?.thumbnail?.width) * 100; // Ratio pour le padding-bottom

                                                        {/** AUDIO - VIDEO */}
                                                        if (document.type === "audio" || document.type === "video") {
                                                            if (document.cover) {
                                                                return (
                                                                    <div key={index} className="audio relative overflow-hidden cursor-pointer w-full aspect-square lg:h-[300px] xl:h-[400px]" style={{ paddingBottom: `${aspectRatio}%`}} 
                                                                        onClick={() => { setIsOpenPopup(true); setDataPopup(document); }}  
                                                                    >
                                                                        <img loading="lazy" src={ document.cover } alt={document?.name[locale]} className="w-full hover:scale-[1.2] transition-all duration-[750ms]" 
                                                                            style={{position: 'absolute',top: 0,left: 0, width: '100%', height: '100%', objectFit: 'cover'}} 
                                                                            onLoad={() => setImagesLoaded(true)}
                                                                        />

                                                                        {/* <div className="absolute top-0 left-0 bg-black text-[14px] ">
                                                                            <span className="block text-amber-400">{ document.type }  - { document.name[locale] }</span>
                                                                            {document.tags.map(tag =>
                                                                                <span key={tag.id} className="block text-white">{ tag.name[locale] }</span>
                                                                            )}
                                                                        </div> */}
                                                                    </div> 
                                                                )
                                                            } else {
                                                                return (
                                                                    <div key={index} className="relative overflow-hidden cursor-pointer w-full" onClick={() => { setIsOpenPopup(true); setDataPopup(document); }}>
                                                                        <div className="bg-[#DBDBD0] w-full aspect-square lg:h-[200px] flex justify-center items-center relative">
                                                                            { document.type === "audio" ? (
                                                                                <img src={ audioLogo } alt="Logo audio" className="h-[50px] lg:h-[140px]"/>
                                                                            ) : (
                                                                                <img src={ videoLogo } alt="Logo video" className="h-[50px] lg:h-[120px]"/>
                                                                            )}
                                                                            <span className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[14px] leading-none italic text-center">{ document.name[locale] }</span>
                                                                        </div>
    {/*                                                                                                                                         
                                                                        <div className="absolute top-0 left-0 bg-black text-[14px] ">
                                                                            <span className="block text-amber-400">{ document.type } - { document.name[locale] }</span>
                                                                            {document.tags.map(tag =>
                                                                                <span key={tag.id} className="block text-white">{ tag.name[locale] }</span>
                                                                            )}
                                                                        </div> */}
                                                                    </div>
                                                                )
                                                            }
                                                        }

                                                        if (document.type !== 'video' && document.type !== 'audio' && document.optimized_url ) {
                                                            return (
                                                                <div 
                                                                    key={index} 
                                                                    className="cursor-pointer overflow-hidden relative" style={{ width: `${document?.optimized_url?.thumbnail?.width}%`, height: `${document?.optimized_url?.thumbnail?.height}`}} 
                                                                    onClick={() => { setIsOpenPopup(true); setDataPopup(document);}}
                                                                >
                                                                    <img 
                                                                        loading="lazy" 
                                                                        src={document?.optimized_url?.thumbnail?.url }
                                                                        alt={document?.name[locale]} 
                                                                        className="w-full h-full hover:scale-[1.2] transition-all duration-[750ms]"
                                                                        onLoad={() => setImagesLoaded(true)}
                                                                    />

                                                                    {/* <div className="bg-[#DBDBD0] w-full aspect-square lg:h-[200px] flex justify-center items-center relative">
                                                                        <span className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[14px] leading-none italic text-center">{ document.name[locale] }</span>
                                                                    </div> */}

                                                                    {/* <div className="absolute top-0 left-0 bg-black text-[14px] ">
                                                                            <span className="block text-amber-400">{ document.type } - { document.name[locale] }</span>
                                                                            {document.tags.map(tag =>
                                                                                <span key={tag.id} className="block text-white">{ tag.name[locale] }</span>
                                                                            )}
                                                                        </div> */}
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </Masonry>
                                            </ResponsiveMasonry>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-span-9 flex h-[calc(100vh-160px)] justify-center items-center">{ t('no_resources') }</div>
                                )}


                            <div className="hidden col-span-3 border-l border-black h-[calc(100vh-160px)] lg:flex flex-col overflow-hidden">
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
                            <span className="text-blue test-[18px] md:text-[22px] font-semibold uppercase cursor-">Filtres</span>
                        </div>
                        
                        {/** MOBILE FILTERS */}
                        <div className={classNames("lg:hidden fixed bottom-[40px] bg-white flex flex-col h-[50%] left-0 right-0 transition-all duration-[750ms] z-[100] border-t border-black", {
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
                            <div className="tags_block px-[20px] flex flex-col flex-grow overflow-hidden">
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
            </motion.div>


            {/** POPUP */}
            <AnimatePresence>           
                {isOpenPopup &&
                    <motion.div 
                        className="w-full h-full fixed inset-0 z-[103] flex items-center justify-center bg-black/50"
                        key="popupResource"
                        initial={{ scale: 0.5, opacity: 0, y: "-50%" }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: "-50%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <PopupResource setIsOpenPopup={ setIsOpenPopup } data={ dataPopup } locale={locale}/>
                    </motion.div>
                }
            </AnimatePresence>           
        </>
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

