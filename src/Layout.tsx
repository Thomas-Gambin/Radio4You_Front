import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import ContextWrappers from "./components/ContextWrappers";
import ScrollToTop from "./components/ScrollToTop";
import RadioPlayer from "./components/radioPlayer/RadioPlayer";

export default function Layout() {
    return (
        <ContextWrappers>
            <Header />
            <ScrollToTop />
            <RadioPlayer />
            <main className="pt-16">
                <Outlet />
            </main>
        </ContextWrappers>);
};