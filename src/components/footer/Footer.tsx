import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { ROUTES } from "../../App";

export default function Footer() {
    const linkCls =
        "text-white/80 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30";

    return (
        <footer id="app-footer" className="relative isolate text-white">
            <div className="w-full mt-20" />
            <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 md:pt-10 md:pb-12">
                <div className="grid gap-10 md:grid-cols-12">
                    {/* Marque */}
                    <div className="md:col-span-5 lg:col-span-4 text-center md:text-left">
                        <Link to={ROUTES.HOME} className="inline-flex items-center gap-3">
                            <img src="/logo.svg" alt="Radio4You" className="h-8 w-auto" />
                            <span className="text-xl font-extrabold leading-none">
                                Radio<span className="text-[#3dd267]">4You</span>
                            </span>
                        </Link>
                        <p className="mt-3 mx-auto md:mx-0 max-w-sm text-sm text-white/70">
                            La radio régionale qui vous suit partout : actus locales, podcasts et musique 24/7.
                        </p>
                        <div className="mt-5 flex justify-center md:justify-start items-center gap-3">
                            <a href="#" aria-label="Instagram" className="rounded-lg border border-white/15 p-2 hover:bg-white/5 transition">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" aria-label="Facebook" className="rounded-lg border border-white/15 p-2 hover:bg-white/5 transition">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" aria-label="YouTube" className="rounded-lg border border-white/15 p-2 hover:bg-white/5 transition">
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a href="mailto:contact@radio4you.fr" aria-label="Email" className="rounded-lg border border-white/15 p-2 hover:bg-white/5 transition">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div className="md:col-span-7 lg:col-span-8 text-center md:text-left">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center md:justify-items-start">
                            {/* Navigation */}
                            <nav>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Navigation</h3>
                                <ul className="mt-3 space-y-2">
                                    <li><Link to={ROUTES.HOME} className={linkCls}>Accueil</Link></li>
                                    <li><Link to={ROUTES.ARTICLES} className={linkCls}>Articles</Link></li>
                                    <li><Link to={ROUTES.PODCASTS} className={linkCls}>Podcasts</Link></li>
                                </ul>
                            </nav>
                            {/* Ressources */}
                            <nav>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Ressources</h3>
                                <ul className="mt-3 space-y-2">
                                    <li><Link to={ROUTES.ABOUT} className={linkCls}>À propos</Link></li>
                                    <li><Link to={ROUTES.CONTACT} className={linkCls}>Devenir sponsor</Link></li>
                                </ul>
                            </nav>
                            {/* Informations */}
                            <nav>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Informations</h3>
                                <ul className="mt-3 space-y-2">
                                    <li><a href="mailto:contact@radio4you.fr" className={linkCls}>contact@radio4you.fr</a></li>
                                    <li><Link to={ROUTES.LEGAL} className={linkCls}>Mentions légales</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                {/* Bas de page */}
                <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
                    <p className="text-xs text-white/60">
                        © {new Date().getFullYear()} Radio4You. Tous droits réservés.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-white/70">
                        <Link to="/mentions-legales" className={linkCls}>Mentions légales</Link>
                        <span aria-hidden="true" className="text-white/30">•</span>
                        <Link to="/confidentialite" className={linkCls}>Politique de confidentialité</Link>
                        <span aria-hidden="true" className="text-white/30">•</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
