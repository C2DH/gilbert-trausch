import { Route, Routes, useLocation } from "react-router-dom";
import PreviewSlide from "./components/preview/PreviewSlide"
import Biography from "./components/Biography";
import Layout from "./components/layout/Layout";
import Resources from "./components/Resources";
import About from "./components/About";
import VirtualTour from "./components/VirtualTour";
import Terms from "./components/Terms";
import PreviewSlideMagicNotebook from "./components/preview/PreviewSlideMagicNotebook";
import Home from "./components/Home";
import Chapters from "./components/Chapters";
import Chapter from "./components/Chapter";
import MagicNotebook from "./components/MagicNotebook";
import MagicNotebooks from "./components/MagicNotebooks";
import { LanguageProvider } from './contexts/LanguageProvider';
import '../i18n'
import { AnimatePresence } from "motion/react";
import Curtains from "./components/content/Curtains";
import { useSharedState } from "./contexts/ShareStateProvider";
import { useEffect, useState } from "react";

export default function App() {
    
    const location = useLocation();
    const [sharedState, setSharedState] = useSharedState();
    const [firstLaunch, setFirstLaunch] = useState(true)

    // useEffect(() => {

    //     // console.log('sharedstate',sharedState)

    //     // if (!firstLaunch) {
    //     //     setSharedState({ ...sharedState, showCurtains: true })
    //     // }
    //     // setFirstLaunch(false);
    // }, [location.pathname]);

    // useEffect(() => {
    //     console.log('refresh');
    // }, []);
    
    return (    
        <>            
            <LanguageProvider>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Layout />}>
                        <Route path='/' element={ <Home /> }/>
                        <Route path="/preview/chapter/slide/:id" element={<PreviewSlide />} />
                        <Route path="/preview/magic-notebook/slide/:id" element={<PreviewSlideMagicNotebook />} />
                        <Route path="/biography" element={<Biography />} />
                        <Route path="/professions" element={<Chapters />} />
                        <Route path="/chapter/:id" element={<Chapter />} />
                        <Route path="/magic-notebook/:id" element={<MagicNotebook />} />
                        <Route path="/magic-notebooks" element={<MagicNotebooks />} />
                        <Route path="/virtual-tour" element={<VirtualTour />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/terms-of-use" element={<Terms />} />
                    </Route>
                </Routes>
            </LanguageProvider>

            <AnimatePresence mode="wait">
                {sharedState.showCurtains && <Curtains key="curtains" />}
            </AnimatePresence>
        </>
    );
}
