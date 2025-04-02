import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../content/Navbar.jsx";
import SlideHeader from "../content/SlideHeader.jsx";
import SlideMediaFull from "../content/SlideMediaFull.jsx";
import SlideCitation from "../content/SlideCitation.jsx";
import SlideCentralText from "../content/SlideCentralText.jsx";
import SlideColumn from "../content/SlideColumn.jsx";
import SlideSlider from "../content/SlideSlider.jsx";
import SlideMasonry from "../content/SlideMasonry.jsx";
import SlideImageText from "../content/SlideImageText.jsx";
import SlideStep from "../content/SlideStep.jsx";
import SlideAudio from "../content/SlideAudio.jsx";
import { PopupProvider } from "../../contexts/PopupContext.jsx";

export default function PreviewSlideMagicNotebook() {
    const API_URL = import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/magic-notebook/slide/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setData(data.data);
            })
            .catch((error) => console.error("Erreur de chargement :", error));
    }, [id]);

    if (!data) {
        return <p>Chargement...</p>;
    }

    return (
        <>
            <Navbar color={data.slidable.color_menu}/>

            <PopupProvider>
                { data.slidable.type === "SlideHeader" &&
                    <SlideHeader data={data} />
                }

                { data.slidable.type === "SlideMediaFull" &&
                    <SlideMediaFull data={data} />
                }

                { data.slidable.type === "SlideCitation" &&
                    <SlideCitation data={data} />
                }

                { data.slidable.type === "SlideCentralText" &&
                    <SlideCentralText data={data} />
                }

                { data.slidable.type === "SlideColumn" &&
                    <SlideColumn data={data} />
                }

                { data.slidable.type === "SlideSlider" &&
                    <SlideSlider data={data} />
                }

                { data.slidable.type === "SlideMasonry" &&
                    <SlideMasonry data={data} />
                }
                
                { data.slidable.type === "SlideImageText" &&
                    <SlideImageText data={data} />
                }

                { data.slidable.type === "SlideStep" &&
                    <SlideStep data={data} />
                }

                { data.slidable.type === "SlideAudio" &&
                    <SlideAudio data={data} />
                }
            </PopupProvider>
        </>
    );
};