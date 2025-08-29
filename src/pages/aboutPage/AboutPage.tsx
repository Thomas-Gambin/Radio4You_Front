import { Link } from "react-router-dom";
import { ROUTES } from "../../App";

export default function AboutPage() {
    return (
        <section className="relative isolate text-white">
            <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 md:px-6 md:pt-16 md:pb-12">
                <div className="text-center md:text-left">
                    <span className="inline-block rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
                        À propos
                    </span>
                    <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
                        Radio4You — Musique, podcasts & vibes 24/7
                    </h1>
                    <p className="mt-4 text-white/80 max-w-2xl md:max-w-3xl">
                        Nous créons une expérience audio simple, moderne et chaleureuse.
                        Playlists, podcasts et article pour travailler, se concentrer
                        ou juste se détendre.
                    </p>
                    <div className="mt-6 flex justify-center md:justify-start gap-3">
                        <Link
                            to={ROUTES.PODCASTS}
                            className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">
                            Découvrir les podcasts
                        </Link>
                        <Link
                            to={ROUTES.ARTICLES}
                            className="rounded-xl border border-white/15 px-5 py-3 font-semibold bg-white/5 hover:bg-white/10">
                            Lire les articles
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Podcasts publiés", value: "100+" },
                        { label: "Heures d’écoute", value: "50k+" },
                        { label: "Playlists curatées", value: "40+" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="relative rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:ring-1 before:ring-green-400/30 before:shadow-[0_0_36px_rgba(34,197,94,0.35)] hover:before:shadow-[0_0_60px_rgba(34,197,94,0.45)] transition"
                        >
                            <div className="text-2xl md:text-3xl font-extrabold">{s.value}</div>
                            <div className="mt-1 text-sm text-white/70">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl md:text-2xl font-bold">Notre mission</h2>
                        <p className="mt-3 text-white/80 leading-relaxed">
                            Offrir une expérience d’écoute élégante, fluide et inspirante.
                            Nous sélectionnons soigneusement les titres que ce soit Lo-Fi, Hip-Hop ou
                            découvertes du moment.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl md:text-2xl font-bold">Nos valeurs</h2>
                        <ul className="mt-3 space-y-2 text-white/80">
                            <li>• Simplicité & accessibilité</li>
                            <li>• Qualité éditoriale avant tout</li>
                            <li>• Respect des artistes & des auditeurs</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 pb-14 md:px-6 md:pb-20">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold">Envie de collaborer ?</h3>
                    <p className="mt-2 text-white/80">
                        Projets, partenariats, suggestions — on lit tous vos messages.
                    </p>
                    <div className="mt-4">
                        <Link
                            to={ROUTES.CONTACT}
                            className="inline-block rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
