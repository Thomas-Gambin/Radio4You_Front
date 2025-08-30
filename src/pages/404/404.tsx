import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../App";

export default function NotFoundPage() {
    useEffect(() => {
        document.title = "Page introuvable — Radio4You";
    }, []);

    return (
        <main className="min-h-[60vh] grid place-items-center px-4 py-16 text-white">
            <div className="text-center">
                <div className="text-7xl md:text-8xl font-extrabold">404</div>
                <h1 className="mt-4 text-2xl md:text-3xl font-bold">Page introuvable</h1>
                <p className="mt-2 text-white/70">
                    Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to={ROUTES.PODCASTS}
                        className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                    >
                        ← Retour aux podcasts
                    </Link>
                    <Link
                        to={ROUTES.ARTICLES}
                        className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                    >
                        ← Retour aux articles
                    </Link>
                    <Link
                        to={ROUTES.DIRECT}
                        className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                    >
                        ← Retour à la radio en ligne
                    </Link>
                    <Link
                        to={ROUTES.HOME ?? "/"}
                        className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                    >
                        Accueil
                    </Link>
                </div>
            </div>
        </main>
    );
}
