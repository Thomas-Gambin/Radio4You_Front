import { usePlayer } from "../../context/PlayerContext";
import type { Card } from "../../@types/card";
import { Colors } from "../../utils";

const PLAYLISTS: Card[] = [
    { id: "fresh", title: "Fresh Pop", subtitle: "Nouveautés", params: { search: "pop" }, cover: "/playlists/fresh_pop.png" },
    { id: "chill", title: "Chill & Lounge", subtitle: "Détente", params: { search: "chill" }, cover: "/playlists/chill_lounge.png" },
    { id: "electro", title: "Electro Boost", subtitle: "Énergie", params: { search: "electro" }, cover: "/playlists/electro.png" },
    { id: "rock", title: "Rock / Indie", subtitle: "Guitares", params: { search: "rock" }, cover: "/playlists/rock.png" },
    { id: "lofi", title: "Lo-fi Focus", subtitle: "Concentration", params: { search: "lofi" }, cover: "/playlists/lofi.png" },
    { id: "hiphop", title: "Hip-Hop / R&B", subtitle: "Beats & Flow", params: { search: "hip hop rnb" }, cover: "/playlists/hiphop.png" },
];

function sameParams(a: unknown, b: unknown) {
    return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}

export default function JamendoPlaylists() {
    const { setJamendoParams, start, jamendoParams } = usePlayer();

    return (
        <section className="relative isolate" style={{ backgroundColor: Colors.lightBg }}>
            <div className="pointer-events-none absolute -top-[1px] left-0 right-0 h-16 md:h-24" aria-hidden="true">
                <svg className="h-full w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ color: Colors.lightBg }}>
                    <path className="fill-current" d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,0 L0,0 Z" />
                </svg>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <h2 className="mb-6 md:mb-10 text-2xl md:text-3xl font-extrabold text-white">Playlists Jamendo</h2>
                <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {PLAYLISTS.map((pl) => {
                        const selected = sameParams(pl.params, jamendoParams);
                        return (
                            <button
                                key={pl.id}
                                type="button"
                                onClick={() => { setJamendoParams(pl.params); start(); }}
                                className={[
                                    "group text-left overflow-hidden rounded-2xl border border-white/10 bg-white/5",
                                    "hover:bg-white/[0.08] transform-gpu transition-transform duration-300 hover:scale-[1.03]",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                                    selected ? "ring-2 ring-[#3dd267]" : "",
                                ].join(" ")}
                                aria-pressed={selected}>
                                <div className="aspect-[16/9] w-full overflow-hidden">
                                    {pl.cover ? (
                                        <img
                                            src={pl.cover}
                                            alt={pl.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                            loading="lazy" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-[#1b2235] to-[#0b1321]" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <h3 className="text-white font-bold">{pl.title}</h3>
                                        {selected && <span className="text-xs font-semibold text-[#3dd267]">En cours</span>}
                                    </div>
                                    {pl.subtitle && <p className="mt-1 text-sm text-white/70">{pl.subtitle}</p>}
                                    <p className="mt-3 text-xs text-white/60">Cliquer pour lancer dans le lecteur</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="w-full">
                <svg
                    className="h-24 md:h-28 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    style={{ color: Colors.baseBg }}
                    aria-hidden="true">
                    <path
                        className="fill-current"
                        fillOpacity="0.99"
                        d="M0,288L60,245.3C120,203,240,117,360,112C480,107,600,181,720,229.3C840,277,960,299,1080,256C1200,213,1320,107,1380,53.3L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        fill="currentColor" />
                </svg>
            </div>
        </section>
    );
}
