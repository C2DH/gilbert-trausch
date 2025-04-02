import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PreviewSlide from "./components/preview/PreviewSlide"
import Biography from "./components/Biography";
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

export default function App() {
    return (
        <Router>
            <Routes>
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
            </Routes>
        </Router>
    );
}
