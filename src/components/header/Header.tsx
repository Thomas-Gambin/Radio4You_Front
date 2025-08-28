import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../App";
import { usePlayer } from "../../context/PlayerContext";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const { start } = usePlayer();

    return (
        <header
            className="fixed inset-x-0 top-0 z-50 w-full bg-[#0b1321]/50 backdrop-blur-[2px] supports-[backdrop-filter]:backdrop-saturate-150 text-white"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 py-4 md:px-6 text-white">
                <Link
                    to={ROUTES.HOME}
                    onClick={closeMenu}
                    className="flex items-center gap-3"
                >
                    <img className="h-15 object-contain" src="/logo.svg" alt="Logo Dev4You" />
                    <span className="hidden sm:inline-block text-base md:text-2xl font-extrabold leading-none">
                        Radio<span className="text-[#3dd267]">4You</span>
                    </span>
                </Link>
                {/* Nav desktop */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 md:flex items-center gap-12">
                    {[
                        { label: "Accueil", to: ROUTES.HOME },
                        { label: "Articles", to: ROUTES.ARTICLES },
                        { label: "Podcast", to: ROUTES.HOME },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            onClick={closeMenu}
                            className="text-lg font-semibold leading-none text-white/80 hover:text-white transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        onClick={start}
                        className="hidden md:inline-block rounded-2xl bg-[#3dd267] px-6 py-3 text-base font-bold text-[#0b1321] shadow-[0_6px_20px_rgba(61,210,103,0.35)] hover:brightness-110 transition leading-none">
                        Écouter en direct
                    </button>
                    {/*hamburger*/}
                    <button
                        className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/20 p-2"
                        onClick={toggleMenu}
                        aria-label="Menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? "max-h-96" : "max-h-0"
                    }`}
            >
                <nav className="flex flex-col items-center gap-4 py-3 text-white">
                    {[
                        { label: "Accueil", to: ROUTES.HOME },
                        { label: "Articles", to: ROUTES.HOME },
                        { label: "Podcast", to: ROUTES.HOME },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            onClick={closeMenu}
                            className="rounded-md px-3 py-2 text-lg font-semibold leading-none hover:bg-white/5"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => { start(); closeMenu(); }}
                        className="mt-3 rounded-xl bg-[#3dd267] px-4 py-3 text-center text-base font-bold text-[#0b1321] shadow-[0_6px_20px_rgba(61,210,103,0.35)] hover:brightness-110 transition leading-none"
                    >
                        Écouter en direct
                    </button>
                </nav>
            </div>

        </header>
    );
}
