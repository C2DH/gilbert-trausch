import { useNavigate } from "react-router-dom";
import { formatRichText } from "../../lib/utils";
import PlayerPDF from "./PlayerPDF";
import Slider from "./Slider";

export default function SlideStep({ data, locale }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
    const navigate = useNavigate();

    return (
        <>
            <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className='h-[100dvh] slide slide_step'>
                <div className="relative top-[40px]">
                    <div className="container mx-auto px-[20px] xl:px-0 overflow-hidden">
                        <div className="grid grid-cols-12 h-[calc(100dvh-80px)] xl:h-[calc(100dvh-40px)] overflow-y-scroll">

                            <div className="col-span-12 lg:col-span-7 2xl:col-span-8 relative order-2 lg:order-1 h-full mt-[20px] lg:mt-0 md:pb-[70px] lg:pb-0">
                                { data?.slidable?.documents?.length > 0 &&                            
                                    <div className="grid grid-cols-8 lg:h-full">
                                        <div className="col-span-8 pt-[20px] lg:pt-0 2xl:pt-[40px] lg:flex items-center lg:pr-[30px] relative h-full">   
                                            {data.slidable.documents.length === 1 ? (
                                                data.slidable.documents[0].url.endsWith('.pdf') ? (
                                                    <PlayerPDF url={data.slidable.documents[0].url} optimized_url={data.slidable.documents[0].optimized_url} id={data.slidable.documents[0].id} className="max-h-[80vh]"/>
                                                ) : (
                                                    <img src={data.slidable.documents[0].url} alt={data.slidable.documents[0].name[locale]} className="max-h-[80vh]" onClick={() => { navigate(`/resources/${data?.slidable?.document.id}`, { state: { modal: true } }) }}/>
                                                )
                                            ) : (
                                                <Slider items={data.slidable.documents} locale={ locale }/>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                            
                            { (data.slidable?.title?.[locale] || data.slidable?.content?.[locale]) &&                            
                                <div className="col-span-12 lg:col-span-4 2xl:col-span-3 lg:border-l border-black flex flex-col justify-center items-center lg:items-start order-1 lg:order-2 pt-[20px]" style={{ color: color }}>
                                    <div className="w-full md:w-2/3 lg:w-full">
                                        { (data?.slidable?.title && locale) &&
                                            <span className={`block uppercase px-[10px] lg:px-[20px] py-[10px] 2xl:py-[40px] border-l lg:border-l-0 border-t border-r rounded-tl-xl rounded-tr-xl lg:rounded-tl-none border-black`}>{data.slidable.title[locale]}</span>
                                        }

                                        { (data?.slidable?.content && locale) &&
                                            <div className="border-b border-r border-t border-l lg:border-l-0 px-[10px] lg:px-[20px] py-[10px] rounded-bl-xl rounded-br-xl lg:rounded-bl-none border-black richeditor">{formatRichText(data.slidable.content[locale])}</div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}