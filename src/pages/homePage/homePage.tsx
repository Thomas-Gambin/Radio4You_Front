import { Link } from "react-router-dom";
import Hero from "../../components/hero/Hero"
import SponsorsSection from "../../components/sponsorsSection/SponsorsSection";

export default function Homepage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-[#0b1321] text-white">
            <Hero />
            <SponsorsSection />
            <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
                <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                    Bienvenue sur{" "}
                    <span className="text-[#41d165]">Radio4You</span>
                </h1>
                <p className="mt-4 max-w-2xl text-white/70">
                    Ceci est une page de test pour valider Tailwind, le routing et votre header.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        to="/"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/verbes"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                    >
                        Verbes irréguliers
                    </Link>
                    <Link
                        to="/a-propos"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                    >
                        À propos
                    </Link>
                    <Link
                        to="/contact"
                        className="rounded-lg bg-[#3dd267] px-4 py-2 text-sm font-bold text-[#0b1321] shadow-[0_6px_20px_rgba(61,210,103,0.35)] hover:brightness-110 transition"
                    >
                        Écouter en direct (fake)
                    </Link>
                </div>

                {/* Zone de cartes de test */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:bg-white/10"
                        >
                            <div className="text-sm text-white/60">Card #{i + 1}</div>
                            <h3 className="mt-2 text-lg font-semibold">Bloc de test</h3>
                            <p className="mt-2 text-sm text-white/70">
                                Utilise Tailwind pour vérifier le rendu (couleurs, spacing, hover).
                            </p>
                            <button className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
                <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                    Bienvenue sur{" "}
                    <span className="text-[#41d165]">Radio4You</span>
                </h1>
                <p className="mt-4 max-w-2xl text-white/70">
                    Ceci est une page de test pour valider Tailwind, le routing et votre header.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        to="/"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/verbes"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                    >
                        Verbes irréguliers
                    </Link>
                    <Link
                        to="/a-propos"
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/5 transition"
                    >
                        À propos
                    </Link>
                    <Link
                        to="/contact"
                        className="rounded-lg bg-[#3dd267] px-4 py-2 text-sm font-bold text-[#0b1321] shadow-[0_6px_20px_rgba(61,210,103,0.35)] hover:brightness-110 transition"
                    >
                        Écouter en direct (fake)
                    </Link>
                </div>

                {/* Zone de cartes de test */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:bg-white/10"
                        >
                            <div className="text-sm text-white/60">Card #{i + 1}</div>
                            <h3 className="mt-2 text-lg font-semibold">Bloc de test</h3>
                            <p className="mt-2 text-sm text-white/70">
                                Utilise Tailwind pour vérifier le rendu (couleurs, spacing, hover).
                            </p>
                            <button className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:bg-white/10"
                        >
                            <div className="text-sm text-white/60">Card #{i + 1}</div>
                            <h3 className="mt-2 text-lg font-semibold">Bloc de test</h3>
                            <p className="mt-2 text-sm text-white/70">
                                Utilise Tailwind pour vérifier le rendu (couleurs, spacing, hover).
                            </p>
                            <button className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:bg-white/10"
                        >
                            <div className="text-sm text-white/60">Card #{i + 1}</div>
                            <h3 className="mt-2 text-lg font-semibold">Bloc de test</h3>
                            <p className="mt-2 text-sm text-white/70">
                                Utilise Tailwind pour vérifier le rendu (couleurs, spacing, hover).
                            </p>
                            <button className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:bg-white/10"
                        >
                            <div className="text-sm text-white/60">Card #{i + 1}</div>
                            <h3 className="mt-2 text-lg font-semibold">Bloc de test</h3>
                            <p className="mt-2 text-sm text-white/70">
                                Utilise Tailwind pour vérifier le rendu (couleurs, spacing, hover).
                            </p>
                            <button className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:bg-white/10"
                        >
                            <div className="text-sm text-white/60">Card #{i + 1}</div>
                            <h3 className="mt-2 text-lg font-semibold">Bloc de test</h3>
                            <p className="mt-2 text-sm text-white/70">
                                Utilise Tailwind pour vérifier le rendu (couleurs, spacing, hover).
                            </p>
                            <button className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                                Action
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
