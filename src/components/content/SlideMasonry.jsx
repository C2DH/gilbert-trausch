import { formatRichText } from "../../lib/utils";
import audioLogo from '../../assets/images/audio.svg';
import videoLogo from '../../assets/images/video.svg';
import bgSmall from '../../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import { useNavigate } from "react-router-dom";

export default function SlideMasonry({ data, locale }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const documents = data?.slidable?.documents;
    const color = data?.slidable?.color_text;
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});
    const navigate = useNavigate();

    return (
        <>
            <div style={{ background: `url(${isMobile ? bgSmall : imageUrl}) right / cover no-repeat` }} className='h-[100dvh] slide slide_masonry slide'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 h-[calc(100dvh-80px)] lg:h-[calc(100dvh-40px)] overflow-hidden">
                        <div className="grid grid-cols-12 h-full overflow-y-scroll">

                            <div className="col-span-12 lg:col-span-4 lg:border-r border-black py-[20px] lg:py-[40px] lg:overflow-y-scroll lg:pr-[30px]">
                                {(data?.slidable?.content && locale) &&
                                    <div className="richeditor" style={{ color: color }}>{ formatRichText(data.slidable.content[locale])}</div>
                                }
                            </div>

                            <div className="col-span-12 lg:col-span-7 2xl:col-span-8 lg:overflow-y-scroll pb-[20px] lg:pt-[40px] lg:pb-[60px] xl:pb-[40px] lg:pl-[30px]">
                                <ResponsiveMasonry columnsCountBreakPoints={{ 300: 2, 767: 3, 1024: 3, 1280: 4 }} gutterBreakpoints={{ 300: "12px", 768: "16px", 1024: "20px" }}>
                                    <Masonry>
                                        {documents?.map((document, index) => {
                                            if (document?.url && locale) {

                                                // All types except Video and Audio
                                                if (document.type !== "audio" && document.type !== "video" && document.optimized_url ) {
                                                    return (
                                                        <div key={index} className="mb-4 break-inside-avoid cursor-pointer" onClick={() => { navigate(`/resources/${document.id}`, { state: { modal: true } }) }}>
                                                            <img loading='lazy' src={document?.optimized_url?.thumbnail?.url} alt={document?.name[locale]} className="w-full" />
                                                        </div>
                                                    )
                                                }

                                                // Audio / Video
                                                if (document.type === "audio" || document.type === "video") {
                                                    return document?.cover ? (
                                                        <div key={index} className="mb-4 break-inside-avoid cursor-pointer" onClick={() => { navigate(`/resources/${document.id}`, { state: { modal: true } }) }}>
                                                            <img loading='lazy' src={document.cover} alt={document?.name[locale]} className="w-full" />
                                                        </div>
                                                    ) : (
                                                        <div className="mb-4 break-inside-avoid cursor-pointer bg-[#DBDBD0] flex justify-center items-center h-[200px]" onClick={() => { navigate(`/resources/${document.id}`, { state: { modal: true } }) }}>
                                                            <img loading='lazy' src={ document.type === "audio" ? audioLogo : videoLogo } alt={ document.name[locale]} className="h-[100px]"/>
                                                        </div>
                                                    )
                                                }
                                            }
                                            return null;
                                        })}
                                    </Masonry>
                                </ResponsiveMasonry>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>    
    )
}