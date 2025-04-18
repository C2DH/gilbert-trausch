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
import { NavbarProvider } from "./contexts/NavbarProvider";
import { useEffect, useRef } from "react";
import Resource from "./components/Resource";
import { NavbarHomeContext, NavbarHomeProvider } from "./contexts/NavbarHomeProvider";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current ?? null;
}

export default function App() {
    
    const location = useLocation();
    const previousLocation = usePrevious(location);

    useEffect(() => {
        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='https://cdn.matomo.cloud/journalofdigitalhistory.matomo.cloud/container_9xdyUNCi.js'; s.parentNode.insertBefore(g,s);
    }, [])

    const isModal = (
        location.state &&
        location.state.modal &&
        (previousLocation !== location && previousLocation != null)
    );
    
    return (    
        <>            
            <LanguageProvider>
                <NavbarHomeProvider>
                    <NavbarProvider>
                        <Routes location={isModal ? previousLocation : location} key={isModal ? previousLocation.pathname : location.pathname}>
                            <Route path="/" element={<Layout />}>
                                <Route path='/' element={ <Home /> }/>
                                <Route path="/preview/chapter/slide/:id" element={<PreviewSlide />} />
                                <Route path="/preview/magic-notebook/slide/:id" element={<PreviewSlideMagicNotebook />} />
                                <Route path="/biography" element={<Biography />} />
                                <Route path="/professions" element={<Chapters />} />
                                <Route path="/chapter/:slug" element={<Chapter />} />
                                <Route path="/magic-notebook/:slug" element={<MagicNotebook />} />
                                <Route path="/magic-notebooks" element={<MagicNotebooks />} />
                                <Route path="/virtual-tour" element={<VirtualTour />} />
                                <Route path="/resources" element={<Resources />} />
                                <Route path="/resources/:id" element={<Resource />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/terms-of-use" element={<Terms />} />
                            </Route>
                        </Routes>
                        {isModal && <Routes location={location}>
                            <Route path='/resources/:id' element={<Resource />} />
                        </Routes>}
                    </NavbarProvider>
                </NavbarHomeProvider>
            </LanguageProvider>
        </>
    );
}
