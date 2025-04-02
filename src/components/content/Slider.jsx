import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useContext, useRef, useState } from "react";
import PlayerPDF from './PlayerPDF';
import PlayerAudio from '../content/PlayerAudio';
import { PopupContext } from "../../contexts/PopupContext";
import audioLogo from '../../assets/images/audio.svg'


export default function Slider({ items }) {

    const swiperRefSlider = useRef(null)
    const paginationRef = useRef(null);
    const navigationNextRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const [index, setIndex] = useState(0);
    const { setIsOpenPopup, setDataPopup } = useContext(PopupContext);
    const locale = 'fr';

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
                    console.log('item', item)
                    const isImage = !item.url.endsWith('.pdf') && !item.url.endsWith('.mp3') && !item.url.endsWith('.m4a') && !item.url.endsWith('.wav');
                    const isAudio = item.url.endsWith('.mp3') || item.url.endsWith('.m4a') || item.url.endsWith('.wav');
                    const isPDF = item.url.endsWith('.pdf');

                    return (
                        <SwiperSlide key={item.id} className="">
                            {(isImage || isPDF) && (
                                <img src={item.optimized_url.url} alt={item.name[locale]} className="w-auto h-[calc(100vh-500px)] lg:h-[calc(100vh-180px)]" />
                            )}

                            {isAudio && (
                                <div className="block-audio h-full flex flex-col justify-center">
                                    {item.cover ? (
                                        <img src={item.cover} alt="cover" className="max-h-[60vh] rounded-[10px] mb-[20px] object-cover" />
                                    ) : (
                                        <div className="bg-[#DBDBD0] w-full h-[60vh] flex justify-center items-center relative mb-5 rounded-[10px]">
                                            <img src={ audioLogo } alt="Logo audio" className="h-[140px]"/>
                                        </div>

                                    )}
                                    <PlayerAudio url={item.url} />
                                </div>
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {items?.length > 1 &&            
                <div className="absolute bottom-[20px] left-[50%] -translate-x-[50%] border border-black flex px-3 rounded-[60px]">
                    <button ref={navigationPrevRef} className="cursor-pointer">
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity={index === 0 ? '0.2' : '1'} d="M11 5.5C11.25 5.5 11.5 5.75 11.5 6C11.5 6.28125 11.25 6.5 11 6.5H1.6875L5.34375 10.1562C5.53125 10.3438 5.53125 10.6875 5.34375 10.875C5.15625 11.0625 4.8125 11.0625 4.625 10.875L0.125 6.375C0.03125 6.28125 0 6.15625 0 6C0 5.875 0.03125 5.75 0.125 5.65625L4.625 1.15625C4.8125 0.96875 5.15625 0.96875 5.34375 1.15625C5.53125 1.34375 5.53125 1.6875 5.34375 1.875L1.6875 5.5H11ZM13.5 0C13.75 0 14 0.25 14 0.5V11.5C14 11.7812 13.75 12 13.5 12C13.2188 12 13 11.7812 13 11.5V0.5C13 0.25 13.2188 0 13.5 0Z" fill="black"/>
                        </svg>
                    </button>
                
                    <span ref={paginationRef} className="custom-pagination px-4"></span>
                
                    <button ref={navigationNextRef} className="cursor-pointer">
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity={index === items.length - 1 ? '0.2' : '1'} d="M13.8438 5.65625C13.9375 5.75 14 5.875 14 6C14 6.15625 13.9375 6.28125 13.8438 6.375L9.34375 10.875C9.15625 11.0625 8.8125 11.0625 8.625 10.875C8.4375 10.6875 8.4375 10.3438 8.625 10.1562L12.2812 6.5H3C2.71875 6.5 2.5 6.28125 2.5 6C2.5 5.75 2.71875 5.5 3 5.5H12.2812L8.625 1.875C8.4375 1.6875 8.4375 1.34375 8.625 1.15625C8.8125 0.96875 9.15625 0.96875 9.34375 1.15625L13.8438 5.65625ZM0.5 0C0.75 0 1 0.25 1 0.5V11.5C1 11.7812 0.75 12 0.5 12C0.21875 12 0 11.7812 0 11.5V0.5C0 0.25 0.21875 0 0.5 0Z" fill="black"/>
                        </svg>
                    </button>
                </div>
            }

            {/** BUTTON POPUP RESOURCE */}
            <div className="absolute bottom-[20px] left-[60%] -translate-x-[50%] cursor-pointer" 
                    onClick={() => { setIsOpenPopup(true); setDataPopup(items[index]); }} 
                >
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="14.5" stroke="black"/>
                        <path d="M14.125 9.5C14.125 9.03516 14.5078 8.625 15 8.625C15.4648 8.625 15.875 9.03516 15.875 9.5C15.875 9.99219 15.4648 10.375 15 10.375C14.5078 10.375 14.125 9.99219 14.125 9.5ZM12.8125 12.5625C12.8125 12.3438 13.0039 12.125 13.25 12.125H15C15.2188 12.125 15.4375 12.3438 15.4375 12.5625V20H17.1875C17.4062 20 17.625 20.2188 17.625 20.4375C17.625 20.6836 17.4062 20.875 17.1875 20.875H12.8125C12.5664 20.875 12.375 20.6836 12.375 20.4375C12.375 20.2188 12.5664 20 12.8125 20H14.5625V13H13.25C13.0039 13 12.8125 12.8086 12.8125 12.5625Z" fill="black"/>
                    </svg>
            </div>
        </>
    )
}