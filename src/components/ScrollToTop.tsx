import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
    const { pathname } = useLocation();
    // remet en haut de la page à chaque changement de page
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
    return null;
}