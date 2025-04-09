import { useEffect, useState } from "react";
import Navbar from "./content/Navbar";
import { Link } from "react-router-dom";
import bg from '../assets/images/magic-notebooks/index.png';
import { romanize } from "../lib/utils";
import bg_empty from '../assets/images/backgrounds/bg-1.webp';
import { useMediaQuery } from "react-responsive";


export default function MagicNotebooks() {

    const [data, setData] = useState();
    const locale = 'fr';
    const API_URL = import.meta.env.VITE_API_URL;
    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
    })

    useEffect(() => {
        fetch(`${API_URL}/api/magic-notebooks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.error("Erreur lors du chargement des cahiers magiques :", error));
    }, []);

    return (
        <>
            <Navbar color={'#000000'} />

            <div className="h-screen"
                style={{
                    backgroundImage: isMobile ? `url(${bg_empty})` : `url(${bg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <div className="container mx-auto h-full px-[20px] xl:px-0">
                    <div className="relative top-[40px]">
                        <div className="grid grid-cols-12 pt-[20px] lg:pt-[40px]">
                            <div className="col-span-12 lg:col-span-6">
                                <h1 className="text-[30px] leading-[35px] lg:text-[40px] 2xl:text-[60px] 2xl:leading-[66px] text-[#4100FC] mb-[30px]">Cahiers magiques</h1>
                                
                                <p className="text-[16px] xl:text-[22px] text-blue mb-[40px] lg:mb-[120px]">Pour prendre des notes, Gilbert Trausch a, dès ses études universitaires, adopté une méthode bien à lui : il utilise des feuilles volantes classées dans des classeurs à anneaux de format A5 qu’il appelle ses Zauberhefte ou ses «cahiers magiques».</p>
                                
                                <ul className="text-[20px] lg:text-[30px] 2xl:text-[40px] 2xl:leading-[48px] pl-0">
                                    {data?.map((item, index) => (
                                        <li key={item.id} className="group mb-[20px] lg:mb-[50px] last:mb-0 flex gap-5 font-extralight ">
                                            <span className="transition-all duration-500 group-hover:text-[#4100FC]">{romanize(index)}.</span>
                                            <Link to={`/magic-notebook/${item.id}`} className="transition-all duration-500 group-hover:text-[#4100FC] group-hover:pl-[30px]">{item.name[locale]}</Link>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}