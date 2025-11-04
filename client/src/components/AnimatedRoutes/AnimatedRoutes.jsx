import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginPage from "../../pages/LoginPage/LoginPage";
import TestPage from "../../pages/TestPage/TestPage";
import SelectPage from "../../pages/SelectPage/SelectPage";
import CharadesPage from "../../pages/CharadesPage/CharadesPage";
import PageWrapper from "../PageWrapper/PageWrapper";

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><LoginPage /></PageWrapper>} />
                <Route path="/test" element={<PageWrapper><TestPage /></PageWrapper>} />
                <Route path="/select" element={<PageWrapper><SelectPage /></PageWrapper>} />
                <Route path="/charades" element={<PageWrapper><CharadesPage /></PageWrapper>} />
            </Routes>
        </AnimatePresence>
    );
}
