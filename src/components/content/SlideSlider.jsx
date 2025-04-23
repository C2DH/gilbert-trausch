import { formatRichText } from "../../lib/utils";
import Slider from "./Slider";
import { useMediaQuery } from "react-responsive";
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';

export default function SlideSlider({data, locale}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    return (
        <>
            <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='slide_text_slider h-[100dvh] slide'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 overflow-hidden">
                        <div className="grid grid-cols-12 h-[calc(100dvh-80px)] xl:h-[calc(100dvh-40px)] overflow-y-scroll">

                            <div className="col-span-12 lg:col-span-4 lg:border-r border-black lg:pr-[30px] flex items-center lg:overflow-hidden pb-[20px]">
                                { (data?.slidable?.content && locale) &&
                                    <div className="richeditor lg:h-full overflow-scroll pb-[20px] lg:pb-[40px] pt-[20px] lg:pt-[20px] 2xl:pt-[40px]" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                                }
                            </div>

                            <div className="col-span-12 lg:col-span-7 2xl:col-span-8 relative lg:pl-[30px] lg:pt-[20px] 2xl:pt-[40px]">
                                <div className="grid grid-cols-8 lg:h-full">
                                    {/* <div className="col-span-8 pb-[70px] lg:pb-0 w-auto lg:h-[calc(100dvh-140px)]"> */}
                                    <div className="col-span-8 pb-[70px] lg:pb-0 w-auto lg:h-[calc(100dvh-140px)]">
                                        { data?.slidable?.documents &&
                                            <Slider items={data.slidable.documents} locale={ locale }/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}