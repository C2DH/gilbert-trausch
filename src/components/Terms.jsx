import { useEffect, useState } from "react";
import { formatRichText } from "../lib/utils";
import Navbar from "./content/Navbar";
import bg from '../assets/images/backgrounds/bg-1.webp';
import { useTranslation } from "react-i18next";

export default function Terms() {

    const API_URL = import.meta.env.VITE_API_URL;
    const { i18n } = useTranslation();
    const locale = i18n.language;    
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/api/conditions`)
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
    }, [locale]);


    return (
        <div style={{ background: `url(${bg}) center / contain repeat`}} className="min-h-screen">
            <Navbar color={'#000000'} />                

            {isLoading &&
                <div className="container mx-auto text-blue about px-[20px] xl:px-0">

                    {/** SECTION 1 */}
                    <div className="pt-[80px] xl:pt-[150px] terms">
                        <h2 className="text-center text-[30px] leading-[40px] xl:text-[40px] pb-[40px] xl:pb-[80px]">{ data.title[locale]}</h2>
                        <div className="grid grid-cols-12 gap-x-[30px]">
                            <div className="col-span-12 xl:col-span-8 xl:col-start-3 richeditor pb-[40px]">
                                { formatRichText(data.conditions[locale]) }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>    
    )
}