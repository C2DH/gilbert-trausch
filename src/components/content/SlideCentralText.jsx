import { formatRichText } from "../../lib/utils";
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";

export default function SlideCentralText ({data}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
    const locale = 'fr';
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)'});
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});

    return (
        <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='slide_central_text h-screen slide'>
            <div className="container mx-auto px-[20px] xl:px-0">
                <div className="relative top-[40px]">
                    <div className="grid grid-cols-12 h-[calc(100vh-40px)]">
                        { (data?.slidable?.content && locale) &&
                            <div className="overflow-hidden col-span-12 lg:col-span-8 lg:col-start-3 lg:border-r lg:border-l border-black lg:px-[30px] h-full flex items-center richeditor" style={{ color: color }}>
                                <div className="pt-[20px] pb-[60px] lg:py-[40px] h-full overflow-scroll richeditor">
                                    {formatRichText(data.slidable.content[locale])}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
