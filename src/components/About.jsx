import { useEffect, useState } from "react";
import { formatRichText } from "../lib/utils";
import Navbar from "./content/Navbar";
import bg from '../assets/images/backgrounds/bg-1.webp';
import about_1 from "../assets/images/about/about-1.webp";
import about_2 from "../assets/images/about/about-2.webp";
import about_3 from "../assets/images/about/about-3.webp";
import about_4 from "../assets/images/about/about-4.webp";

export default function About() {

    const API_URL = import.meta.env.VITE_API_URL;
    const locale = 'fr';
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/api/about`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data.data);
                setIsLoading(true)
                console.log(data.data)
            })
            .catch((error) => console.error("Erreur lors du chargement des données de la page à propos :", error));
    }, []);


    return (
        <div style={{ background: `url(${bg}) center / contain repeat`}}>
            <Navbar color={'#000000'} />                

            {isLoading &&
                <div className="container mx-auto text-blue about px-[20px] xl:px-0">

                    {/** SECTION 1 */}
                    <div className="pt-[80px] xl:pt-[150px]">
                        <h2 className="text-center text-[30px] leading-[40px] xl:text-[40px] pb-[40px] xl:pb-[80px]">{ data.title_1[locale]}</h2>
                        <div className="grid grid-cols-12 gap-x-[30px]">
                            <div className="col-span-12 xl:col-span-8 richeditor">
                                { formatRichText(data.section_1[locale]) }
                            </div>

                            <div className="col-span-12 xl:col-span-4">
                                <div className="xl:pl-[30px] pt-[40px] xl:pt-[10px] flex flex-col items-center">
                                    <img src={ about_1 } alt="Image Trausch" className="mb-[10px] w-[70%] sm:w-[50%] lg:w-[40%] xl:w-full" />
                                    <img src={ about_2 } alt="Image Trausch" className="w-[70%] sm:w-[50%] lg:w-[40%] xl:w-full"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** SECTION 2 */}
                    <div className="pt-[80px] xl:pt-[150px]">
                        <h2 className="text-center text-[30px] leading-[40px] xl:text-[40px] pb-[40px] xl:pb-[80px]">{ data.title_2[locale]}</h2>
                        <div className="grid grid-cols-12">
                            <div className="col-span-12 xl:col-span-4">
                                <div className="pr-[30px] flex justify-center pb-[20px] xl:pb-0">
                                    <img src={ about_3 } alt="Image Trausch" className="w-[70%] sm:w-[50%] lg:w-[40%] xl:w-full"/>
                                </div>
                            </div>

                            <div className="col-span-12 xl:col-span-8 richeditor">
                                { formatRichText(data.section_2[locale]) }
                            </div>
                        </div>
                    </div>

                    {/** SECTION 3 */}
                    <div className="pt-[80px] xl:pt-[150px]">
                        <h2 className="text-center text-[30px] leading-[40px] xl:text-[40px] pb-[40px] xl:pb-[80px]">{ data.title_3[locale]}</h2>
                        <div className="grid grid-cols-12">
                            <div className="col-span-12 xl:col-span-8 richeditor">
                                { formatRichText(data.section_3[locale]) }
                            </div>

                            <div className="col-span-12 xl:col-span-4">
                                <div className="xl:pl-[30px] pt-[40px] xl:pt-[10px] flex justify-center items-center">
                                    <img src={ about_4 } alt="Image Trausch" className="mb-[10px] w-[70%] sm:w-[50%] lg:w-[40%] xl:w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/** SECTION 4 */}
                    <div className="pt-[80px] xl:pt-[150px] credits">
                        <h2 className="text-center text-[30px] leading-[40px] xl:text-[40px] pb-[40px] xl:pb-[80px]">{ data.title_4[locale]}</h2>
                        <div className="grid grid-cols-12 pb-[100px]">
                            <div className="col-span-12 xl:col-span-8 xl:col-start-3 richeditor text-center">
                                { formatRichText(data.section_4[locale]) }
                            </div>
                        </div>
                    </div>

                </div>
            }
        </div>    
    )
}