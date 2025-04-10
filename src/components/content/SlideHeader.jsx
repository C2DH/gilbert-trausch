import { formatRichText } from '../../lib/utils';
import { AnimatePresence, motion } from "framer-motion";

export default function SlideHeader({ data, showSubtitle, index, locale }) {
    const API_URL = import.meta.env.VITE_API_URL;

    const imageUrl = `${API_URL}/storage/${data?.slidable?.background?.background}`;
    const color = data?.slidable?.color_text;

    return (
        <div style={{ background: `url(${imageUrl}) right / cover no-repeat` }} className="h-screen slide">
            <div className="relative top-[40px]">
                <div className="container mx-auto px-[30px] xl:px-0 h-[calc(100dvh-40px)] sm:h-[calc(100vh-40px)]">
                    <div className="grid grid-cols-12 h-full">
                        <div className="col-span-12 lg:col-span-8 xl:col-span-5 flex flex-col justify-center h-full">
                            {data?.slidable?.title && locale && (
                                <h1 className="font-extralight mb-4 xl:mb-10" style={{ color }}>
                                    {data.slidable.title[locale]}
                                </h1>
                            )}

                            <div className="relative w-full xl:min-h-[350px] overflow-hidden">
                                <div className="relative w-full min-h-[300px]">
                                    
                                    <AnimatePresence mode="wait">
                                        {(!showSubtitle || index !== 1) && (
                                            <motion.div
                                                key="content"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }}
                                                exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
                                                className="absolute top-0 left-0 w-full"
                                            >
                                                {data?.slidable?.content && locale && (
                                                    <div
                                                        className="pt-[40px] richeditor"
                                                        style={{ color }}
                                                    >
                                                        {formatRichText(data?.slidable?.content[locale])}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence> 

                                    <AnimatePresence mode="wait">
                                        {showSubtitle && (
                                            <motion.div
                                                key="subtitle"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }}
                                                exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
                                                className="absolute top-0 left-0 w-full"
                                            >
                                                {data?.slidable?.subtitle && locale && (
                                                    <h2
                                                        className="pt-[40px] text-[30px] 2xl:text-[40px] leading-none font-extralight"
                                                        style={{ color }}
                                                    >
                                                        {data?.slidable?.subtitle[locale]}
                                                    </h2>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
