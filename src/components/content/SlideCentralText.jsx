import { formatRichText } from "../../lib/utils";

export default function SlideCentralText ({data}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;
    const locale = 'fr';

    return (
        <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className='slide_central_text h-screen slide'>
            <div className="container mx-auto px-[20px] xl:px-0">
                <div className="relative top-[40px] h-[calc(100vh-40px)]">
                    <div className="grid grid-cols-12 h-full">
                        { (data?.slidable?.content && locale) &&
                            <div className="col-span-12 lg:col-span-8 lg:col-start-3 lg:border-r lg:border-l border-black xl:px-[30px] h-[calc(100vh-40px)] flex flex-col justify-center overflow-y-scroll richeditor overflow-hidden" style={{ color: color }}>
                                <div className="flex-grow overflow-scroll pt-[40px]">
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
