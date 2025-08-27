import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import ContextWrappers from "./components/ContextWrappers";
import ScrollToTop from "./components/ScrollToTop";

export default function Layout() {
    return (
        <ContextWrappers>
            <Header />
            <ScrollToTop />
            <main className="pt-16">
                <Outlet />
            </main>
        </ContextWrappers>);
};