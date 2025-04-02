import { useEffect, useState } from "react";
import Navbar from '../components/content/Navbar';
import { getYear, formatRichText } from "../lib/utils";
import PlayerPDF from './content/PlayerPDF';
import bg from '../assets/images/biography/wallpaper_bio.png'
import { Link, Element } from 'react-scroll';
import classNames from "classnames";


export default function Biography() {

    const API_URL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const locale = 'fr';
    const [years, setYears] = useState([]);
    const [activeYear, setActiveYear] = useState(null);
    const [activeElement, setActiveElement] = useState(null); // Nouvel état pour l'élément actif


    useEffect(() => {
        fetch(`${API_URL}/api/biography`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data.data);
                console.log(data.data)
            })
            .catch((error) => console.error("Erreur de chargement :", error));
    }, []);


    useEffect(() => {
        if (data.length > 0) {
            data.forEach(item => {
                setYears(prev => {
                    const year = getYear(item.date[locale]);
                    return prev.includes(year) ? prev : [...prev, year];
                });
            });
        }    
    }, [data])


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    console.log(entry)
                    if (entry.isIntersecting) {
                        setActiveElement(entry.target.id);
                        
                        const visibleYear = getYear(entry.target.id);
                        if (activeYear !== visibleYear) {
                            setActiveYear(null); // Réinitialiser activeYear
                        }
                    }
                });
            },
            {
                rootMargin: "0px",
                threshold: 1, // 60% de visibilité
            }
        );

        const elements = document.querySelectorAll('.timeline-event');
        console.log("Elements observés:", elements);
        elements.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            elements.forEach((element) => {
                observer.unobserve(element);
            });
        };
    }, [data]);



    return (
        <>
            <Navbar color={'#000000'}/>

            <div className="h-full" style={{ background: `url(${bg}) center / contain repeat`}}>
                <div className="biography container mx-auto pt-[100px]">
                    <div className="grid grid-cols-12 mb-[50px] md:mb-[100px] lg:mb-[150px]">
                        <div className="col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-6 text-[#4100FC]">
                            <h1 className="text-[40px] leading-none md:text-[60px] md:leading-[95px] text-center md:text-left mb-[30px] md:mb-[50px]">Biographie</h1>
                            <p>L’historien Gilbert Trausch (1931-2018) est encore largement connu du public luxembourgeois. Pendant des décennies, ses incontournables interventions dans les médias ont contribué à faire découvrir l’histoire du Luxembourg à toute une génération.</p>
                            <p>Ce n’est pourtant là qu’une des nombreuses facettes d’un historien prolifique de la seconde moitié du XXe siècle qui, en plus d’avoir renouvelé le paysage historiographique luxembourgeois, bénéficiait aussi d’une renommée solide en dehors des frontières du Grand-Duché.</p>
                            <p>Formateur de toute une génération d’historiens, tour à tour directeur de la Bibliothèque nationale, du Centre Universitaire de Luxembourg (CUL – ancêtre de l’Université du Luxembourg) et du Centre d'études et de recherches européennes Robert Schuman (CERE), fréquentant les cercles ministériels et diplomatiques, Gilbert Trausch était une personnalité omniprésente de la société luxembourgeoise.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12">

                        {/** YEARS */}
                        <div className="col-span-2">
                            <div className="timeline_blocks fixed bottom-[40px]">
                                <div className="flex flex-col">
                                    {years?.map((year, index) => 
                                        <Link
                                            onClick={() => setActiveYear(year)}
                                            isDynamic={true}
                                            key={index}
                                            to={`event-${year}`}
                                            spy={true}
                                            offset={-100} 
                                            smooth={true} 
                                            duration={500}
                                            className={classNames("block text-[18px] px-[17px] py-[3px] text-white mb-[6px] cursor-pointer border border-blue transition-all  duration-300 ease-in-out", {
                                                "bg-white text-blue " : activeYear === year || activeElement === `event-${getYear(year)}`,
                                                "bg-blue" : activeYear !== year && activeElement !== `event-${getYear(year)}`
                                            })}
                                        >
                                            <span className="block text-center">{year}</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/** EVENTS */}
                        <div className="events col-span-12 lg:col-span-10 relative before:absolute before:left-[-82px] before:top-0 before:w-[2px] before:h-full before:bg-[#4100FC]">
                            { data?.map(item => 
                                <Element
                                    name={`event-${getYear(item.date[locale])}`}
                                    key={item.id}
                                    id={`event-${getYear(item.date[locale])}`}
                                    data-year={getYear(item.date[locale])}
                                    className="timeline-event mb-[70px] md:mb-[120px] lg:mb-[200px] relative">

                                    <div className="absolute -left-[99px] w-[36px] h-[36px] bg-blue rounded-full">
                                        <div className={classNames("w-[10px] h-[10px] rounded-full absolute top-[50%] left-[50%] -translate-[50%]", {
                                            "bg-white": activeElement === `event-${getYear(item.date[locale])}`
                                        })}></div>
                                    </div>

                                    {(item?.date && locale) &&
                                        <span className="special-elite-regular text-[#4100FC] text-[26px]">{item.date[locale]}</span>
                                    }

                                    <hr className="w-[40px] my-[20px] h-[1px] border-blue border-t"/>

                                    <div className="grid grid-cols-12 lg:grid-cols-10 mb-[50px]">
                                        <div className="col-span-12 lg:col-span-8">
                                            {(item?.title && locale) &&                                        
                                                <h3 className="uppercase text-[22px] leading-[32px] font-semibold mb-[20px]">{item.title[locale]}</h3>
                                            }
                                            {(item?.content && locale) &&
                                                <div className="richeditor">{formatRichText(item.content[locale])}</div>
                                            }
                                        </div>
                                    </div>

                                    <div className="md:flex md:flex-wrap gap-3">
                                        {item?.documents?.map(document => 
                                            <div key={document.id} className="mb-[30px] md:mb-0">
                                                { document?.url?.endsWith('.pdf') ? (
                                                    <PlayerPDF document={document.url} height={220}/>
                                                ) : (
                                                    <img className="w-full max-h-[350px] md:max-h-auto object-contain md:h-[220px]" src={document?.url} alt={document?.name[locale]}/>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Element>
                            )}
                        </div>
                    </div>

                </div>
            </div>    
        </>
    )
}