import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useRef, useState } from "react";
import PlayerAudio from '../content/PlayerAudio';
import videoLogo from '../../assets/images/video.svg'
import { useNavigate } from 'react-router-dom';
import bgAudio from '../../assets/images/backgrounds/bg-audio-default.webp';


export default function Slider({ items, locale }) {

    const swiperRefSlider = useRef(null)
    const paginationRef = useRef(null);
    const navigationNextRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    return (
        <>
            <Swiper
                ref={swiperRefSlider}
                modules={[Pagination, Navigation]}
                className='h-full swiper-slider'
                spaceBetween={30}
                slidesPerView={'auto'}
                grabCursor={true}
                navigation={{ prevEl: navigationPrevRef.current, nextEl: navigationNextRef.current }}
                pagination={{ type: 'fraction', clickable: true, el: paginationRef.current }}
                onRealIndexChange={(e) => setIndex(e.activeIndex)}
            >
                {items?.map(item => {
                    return (
                        <SwiperSlide key={item.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {(item.type !== "audio" && item.optimized_url?.large) && (
                                <img loading='lazy'
                                    onClick={() => { navigate(`/resources/${item.id}`, { state: { modal: true } }) }}
                                    src={item.optimized_url?.large.url} alt={item.name[locale]} className="w-full md:w-[60%] xl:h-[70vh] object-contain" />
                            )}

                            {item.type === "audio" && (
                                <div className="lg:h-full w-full md:w-[50%] lg:w-[80%] xl:w-[57%] 2xl:w-[70%] flex flex-col justify-center items-center">
                                    {item.cover ? (
                                        <img loading='lazy' onClick={() => { navigate(`/resources/${item.id}`, { state: { modal: true } }) }}
                                            // src={item.cover[locale]} alt="cover" className="w-auto h-[300px] md:h-[350px] lg:h-[500px] xl:h-[50vh] object-contain rounded-[6px]" />
                                            src={item.cover[locale]} alt="cover" className="w-full h-[300px] md:h-[350px] lg:h-[500px] xl:h-[calc(100%-160px)] lg:max-h-[calc(100dvh-350px)] rounded-[6px] mb-[20px] object-cover" />
                                    ) : (
                                        <div onClick={() => { navigate(`/resources/${item.id}`, { state: { modal: true } }) }}
                                            className="bg-[#DBDBD0] aspect-square flex justify-center items-center relative mb-5 rounded-[6px] border border-black w-full">
                                            <img loading='lazy' src={ bgAudio } alt="Logo audio" className="object-contain rounded-[6px] w-full"/>
                                        </div>
                                    )}
                                    <PlayerAudio url={item.url} />
                                </div>
                            )}


                            {item.type === "video" && (
                                <div className="lg:h-full w-full flex flex-col justify-center items-center">
                                    {item.cover ? (
                                        <img loading='lazy' src={item.cover[locale]} alt="cover" className="max-h-[60vh] rounded-[10px] mb-[20px] object-cover" 
                                            onClick={() => { navigate(`/resources/${item.id}`, { state: { modal: true } }) }}
                                        />
                                    ) : (
                                        <div className="bg-[#DBDBD0] w-[60%] aspect-square flex justify-center items-center relative mb-5 rounded-[10px] border border-black"  onClick={() => { navigate(`/resources/${item.id}`, { state: { modal: true } }) }}>
                                            <img loading='lazy' src={ videoLogo } alt="Logo video" className="h-[50px] lg:h-[140px]"/>
                                        </div>
                                    )}
                                </div>
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {items?.length > 1 &&  
                <>          
                    <div className="absolute min-w-[116px] lg:bottom-[40px] xl:bottom-[20px] translate-y-[24px] xl:translate-y-0 left-[50%] -translate-x-[50%] border border-black lg:flex px-3 rounded-[60px]">
                        <button ref={navigationPrevRef} className="cursor-pointer">
                            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity={index === 0 ? '0.2' : '1'} d="M11 5.5C11.25 5.5 11.5 5.75 11.5 6C11.5 6.28125 11.25 6.5 11 6.5H1.6875L5.34375 10.1562C5.53125 10.3438 5.53125 10.6875 5.34375 10.875C5.15625 11.0625 4.8125 11.0625 4.625 10.875L0.125 6.375C0.03125 6.28125 0 6.15625 0 6C0 5.875 0.03125 5.75 0.125 5.65625L4.625 1.15625C4.8125 0.96875 5.15625 0.96875 5.34375 1.15625C5.53125 1.34375 5.53125 1.6875 5.34375 1.875L1.6875 5.5H11ZM13.5 0C13.75 0 14 0.25 14 0.5V11.5C14 11.7812 13.75 12 13.5 12C13.2188 12 13 11.7812 13 11.5V0.5C13 0.25 13.2188 0 13.5 0Z" fill="black"/>
                            </svg>
                        </button>
                    
                        <span ref={paginationRef} className="custom-pagination px-4 text-[14px]"></span>
                    
                        <button ref={navigationNextRef} className="cursor-pointer">
                            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity={index === items.length - 1 ? '0.2' : '1'} d="M13.8438 5.65625C13.9375 5.75 14 5.875 14 6C14 6.15625 13.9375 6.28125 13.8438 6.375L9.34375 10.875C9.15625 11.0625 8.8125 11.0625 8.625 10.875C8.4375 10.6875 8.4375 10.3438 8.625 10.1562L12.2812 6.5H3C2.71875 6.5 2.5 6.28125 2.5 6C2.5 5.75 2.71875 5.5 3 5.5H12.2812L8.625 1.875C8.4375 1.6875 8.4375 1.34375 8.625 1.15625C8.8125 0.96875 9.15625 0.96875 9.34375 1.15625L13.8438 5.65625ZM0.5 0C0.75 0 1 0.25 1 0.5V11.5C1 11.7812 0.75 12 0.5 12C0.21875 12 0 11.7812 0 11.5V0.5C0 0.25 0.21875 0 0.5 0Z" fill="black"/>
                            </svg>
                        </button>
                    </div>
                </>
            }

            {/** BUTTON POPUP RESOURCE */}
            <div className="absolute lg:bottom-[40px] xl:bottom-[20px] translate-y-[22px] md:translate-y-[24px] xl:translate-y-0 left-[75%] md:left-[60%] lg:left-[67%] lg:-translate-x-[50%] cursor-pointer" 
                    onClick={() => { navigate(`/resources/${items[index].id}`, { state: { modal: true } }) }} 
                >
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="14.5" stroke="black"/>
                        <path d="M14.125 9.5C14.125 9.03516 14.5078 8.625 15 8.625C15.4648 8.625 15.875 9.03516 15.875 9.5C15.875 9.99219 15.4648 10.375 15 10.375C14.5078 10.375 14.125 9.99219 14.125 9.5ZM12.8125 12.5625C12.8125 12.3438 13.0039 12.125 13.25 12.125H15C15.2188 12.125 15.4375 12.3438 15.4375 12.5625V20H17.1875C17.4062 20 17.625 20.2188 17.625 20.4375C17.625 20.6836 17.4062 20.875 17.1875 20.875H12.8125C12.5664 20.875 12.375 20.6836 12.375 20.4375C12.375 20.2188 12.5664 20 12.8125 20H14.5625V13H13.25C13.0039 13 12.8125 12.8086 12.8125 12.5625Z" fill="black"/>
                    </svg>
            </div>
        </>
    )
}