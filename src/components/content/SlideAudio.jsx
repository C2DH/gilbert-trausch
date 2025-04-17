import { formatRichText } from "../../lib/utils";
import Slider from "./Slider";
import { useMediaQuery } from "react-responsive";
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';


export default function SlideAudio({ data, locale }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const color = data?.slidable?.color_text;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    return (
        <>
        <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='slide_audio h-screen slide'>
            <div className="relative top-[40px]">
                <div className="container mx-auto px-[20px] xl:px-0">
                    <div className="grid grid-cols-12 lg:h-[calc(100dvh-40px)]">

                        <div className="col-span-12 lg:col-span-7 2xl:col-span-8 flex items-center relative pt-[20px] lg:pt-[40px] order-2 lg:order-1">
                            <div className="grid grid-cols-8 h-full w-full overflow-hidden">
                                <div className="col-span-8 lg:col-span-6 lg:col-start-2 max-h-[calc(100dvh-180px)]">
                                    { data?.slidable?.documents &&
                                        <Slider items={data.slidable.documents} locale={ locale }/>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 lg:border-l border-black py-[20px] lg:py-[40px] lg:pl-[30px] lg:flex lg:items-center overflow-y-scroll order-1 lg:order-2">
                            { (data?.slidable?.content && locale) &&
                                <div className="richeditor" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
)
}