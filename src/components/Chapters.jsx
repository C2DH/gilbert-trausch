import { useEffect, useState } from "react";
import bgChapters from '../assets/images/bg-chapters.png';
import chapter1 from '../assets/images/chapter-1.png';
import chapter2 from '../assets/images/chapter-2.png';
import chapter3 from '../assets/images/chapter-3.png';
import bg_empty from '../assets/images/backgrounds/bg-empty.png';
import Navbar from "./content/Navbar";
import { Link } from "react-router-dom";
import { romanize } from "../lib/utils";
import { useMediaQuery } from 'react-responsive'


export default function Chapters() {
    const [data, setData] = useState();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const locale = 'fr';
    const API_URL = import.meta.env.VITE_API_URL;
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
    })


    const getBackgroundImage = () => {
        switch (hoveredIndex) {
            case 0:
                return `url(${chapter1})`;
            case 1:
                return `url(${chapter2})`;
            case 2:
                return `url(${chapter3})`;
            default:
                return `url(${bgChapters})`;
        }
    };

    useEffect(() => {
        fetch(`${API_URL}/api/chapters`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.error("Erreur lors du chargement des chapitres :", error));
    }, []);

    return (
        <>
            <Navbar color={'#000000'} />

            <div className="relative h-screen overflow-hidden"
                style={{
                    backgroundImage: isMobile ? `url(${bg_empty})` : getBackgroundImage(),
                    backgroundPosition: "right",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    transition: "background-image 2s ease-in-out"
                }}    
            >
                <div className="container mx-auto h-full px-[20px] xl:px-0">
                    <div className="h-full flex flex-col justify-center">
                        <h1 className="text-[30px] leading-[35px] lg:text-[40px] 2xl:text-[60px] 2xl:leading-[66px] text-[#4100FC] mb-[50px] uppercase">Les métiers de l'historien</h1>
                        <ul className="text-[20px] lg:text-[30px] 2xl:text-[40px] 2xl:leading-[48px] pl-0 list-inside">
                            {data?.map((item, index) => (
                                <li
                                    key={item.id}
                                    className="group mb-[50px] last:mb-0 hover:text-[#4100FC] transition-all duration-350 flex gap-2 font-extralight w-fit"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <span className="transition-all duration-500 group-hover:text-[#4100FC]">{romanize(index)}.</span>
                                    <Link to={`/chapter/${item.id}`} className="transition-all duration-500 group-hover:text-[#4100FC] group-hover:pl-[30px]">{item.name[locale]}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
 