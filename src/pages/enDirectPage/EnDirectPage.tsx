import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Loader2, Radio, RefreshCw } from "lucide-react";
import type { Station, Program } from "../../@types/live";

// Création tableau des station
const STATIONS: Station[] = [
    {
        name: "France Inter",
        streams: [
            { label: "MP3 128k", url: "https://direct.franceinter.fr/live/franceinter-midfi.mp3" },
            { label: "MP3 64k", url: "https://direct.franceinter.fr/live/franceinter-lofi.mp3" },
        ],
    },
    {
        name: "FIP",
        streams: [{ label: "AAC 192k", url: "https://icecast.radiofrance.fr/fip-hifi.aac" }],
    },
];

const DEFAULT_STATION = STATIONS[0];

// Convertie la durée
const toSec = (d: Date) => Math.floor(d.getTime() / 1000);
const hhmm = (tsSec: number) =>
    new Date(tsSec * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Tableau de la prog
function dataProg(): Program[] {
    const titles = [
        "Réveil Actu",
        "Matinale Culture",
        "Magazine Société",
        "Midi Infos",
        "Après-midi Musique",
        "Drive Actu",
        "Soir Magazine",
    ];
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();

    return [6, 8, 10, 12, 14, 16, 18].map((h, i) => ({
        id: `slot-${h}-${h + 2}`,
        start: toSec(new Date(y, m, d, h, 0, 0)),
        end: toSec(new Date(y, m, d, h + 2, 0, 0)),
        title: titles[i] ?? `Émission ${i + 1}`,
    }));
}

const Prog: Program[] = dataProg();

export default function EnDirectPage() {
    const station = DEFAULT_STATION;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentUrl, setCurrentUrl] = useState<string>(station.streams[0]?.url || "");
    const [playing, setPlaying] = useState(false);
    const [buffering, setBuffering] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState<number>(() => {
        try {
            const saved = typeof window !== "undefined" ? window.localStorage.getItem("live-volume") : null;
            return saved ? Number(saved) : 0.8;
        } catch {
            return 0.8;
        }
    });
    const [error, setError] = useState<string | null>(null);

    // Volume
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) audio.volume = muted ? 0 : volume;
    }, [volume, muted]);
    useEffect(() => {
        try {
            window.localStorage.setItem("live-volume", String(volume));
        } catch { }
    }, [volume]);

    // Changement de flux
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        setError(null);
        setBuffering(true);
        const wasPlaying = playing;
        audio.src = currentUrl;
        audio.load();
        if (wasPlaying) {
            audio.play().then(() => setPlaying(true)).catch(() => setError("Impossible de lancer la lecture. Cliquez Play."));
        }
        const onCanPlay = () => setBuffering(false);
        const onWaiting = () => setBuffering(true);
        const onPlaying = () => {
            setBuffering(false);
            setPlaying(true);
        };
        const onErr = () => setError("Erreur de lecture du flux.");
        audio.addEventListener("canplay", onCanPlay);
        audio.addEventListener("waiting", onWaiting);
        audio.addEventListener("playing", onPlaying);
        audio.addEventListener("error", onErr);
        return () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("waiting", onWaiting);
            audio.removeEventListener("playing", onPlaying);
            audio.removeEventListener("error", onErr);
        };
    }, [currentUrl, playing]);

    // Handler
    const onPlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        setError(null);
        setBuffering(true);
        try {
            await audio.play();
            setPlaying(true);
        } catch {
            setError("Lecture bloquée par le navigateur. Cliquez pour réessayer.");
        } finally {
            setBuffering(false);
        }
    };
    const onPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setPlaying(false);
    };
    const toggleMute = () => setMuted((m) => !m);

    const status = useMemo<string>(() => {
        if (error) return error;
        if (buffering) return "Mise en mémoire tampon…";
        if (playing) return "En lecture";
        return "En pause";
    }, [error, buffering, playing]);

    // Met le en cours + défilement lorsque ça passe au programme suivant
    const nowSec = Math.floor(Date.now() / 1000);
    const nowIdx = Prog.findIndex((it) => nowSec >= it.start && nowSec < it.end);
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    // stock la liste pour le scroll auto
    const setCardRef = useCallback(
        (index: number) => (el: HTMLLIElement | null): void => {
            cardRefs.current[index] = el;
        },
        []
    );

    useEffect(() => {
        if (nowIdx < 0) return;
        const scroller = scrollerRef.current;
        const card = cardRefs.current[nowIdx];
        if (scroller && card) {
            const offsetLeft = card.offsetLeft;
            const pad = 12;
            scroller.scrollTo({ left: Math.max(0, offsetLeft - pad), behavior: "smooth" });
        }
    }, [nowIdx]);

    const progressPct = (start: number, end: number) => {
        const span = end - start;
        if (span <= 0) return 0;
        const p = ((nowSec - start) / span) * 100;
        return Math.max(0, Math.min(100, p));
    };

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 text-white">
            <h1 className="mt-2 text-3xl md:text-4xl font-bold mb-6 text-center">En direct — {station.name}</h1>
            <section className="mb-6" aria-label="Programmation">
                {/* Prog */}
                <div className="text-lg font-semibold mb-3">Programmation</div>
                <div
                    ref={scrollerRef}
                    className="overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <ol className="flex gap-2 min-w-full pr-2">
                        {Prog.map((it, i) => {
                            const isNow = nowIdx === i;
                            const pct = isNow ? progressPct(it.start, it.end) : 0;
                            return (
                                <li
                                    key={it.id}
                                    ref={setCardRef(i)}
                                    className="snap-start min-w-[180px] md:min-w-[200px] rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 shrink-0"
                                    aria-current={isNow ? "true" : undefined}>
                                    <div className="text-white/70 text-xs">
                                        {hhmm(it.start)}–{hhmm(it.end)}
                                    </div>
                                    <div className="mt-1 text-sm font-medium leading-snug">{it.title}</div>
                                    {isNow && (
                                        <>
                                            <span className="mt-1 inline-flex items-center gap-2 text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-2 py-0.5 text-[10px]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,.8)]" />
                                                En cours
                                            </span>
                                            <div className="mt-1 h-1 w-full rounded-full bg-white/10" aria-hidden>
                                                <div
                                                    className="h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,.7)]"
                                                    style={{ width: `${pct}%` }} />
                                            </div>
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>
            {/* PLAYER */}
            <div
                className="w-full rounded-2xl border border-white/10 bg-[#111a2c]/80 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.4)] p-6 md:p-8"
                aria-busy={buffering}>
                <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="text-xl font-semibold">{station.name}</div>
                        <div className="mt-1 flex items-center gap-2 flex-wrap text-white/70">
                            <span className="inline-flex items-center gap-2">
                                <span
                                    className={`w-2 h-2 rounded-full ${playing
                                        ? "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,.85)]"
                                        : "bg-white/40"
                                        }`} />
                                {status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {!playing ? (
                        <button
                            onClick={onPlay}
                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-emerald-400/30 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 hover:text-white transition shadow-[0_0_24px_rgba(16,185,129,.35)]">
                            {buffering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Lire
                        </button>
                    ) : (
                        <button
                            onClick={onPause}
                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-emerald-400/30 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 hover:text-white transition shadow-[0_0_24px_rgba(16,185,129,.35)]">
                            <Pause className="w-4 h-4" />
                            Pause
                        </button>
                    )}
                    <button
                        onClick={() => setCurrentUrl((u) => u)}
                        title="Recharger le flux"
                        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition">
                        <RefreshCw className="w-4 h-4" />
                        Recharger
                    </button>
                    <div className="ml-auto flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <button
                            onClick={toggleMute}
                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition">
                            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            {muted ? "Son coupé" : "Volume"}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={muted ? 0 : volume}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value))}
                            className="w-40 accent-emerald-400"
                            aria-label="Régler le volume" />
                    </div>
                </div>
                {station.streams.length > 1 && (
                    <div className="mt-6">
                        <div className="text-xs uppercase tracking-wide text-white/50 mb-2">Qualité du flux</div>
                        <div className="flex flex-wrap gap-2">
                            {station.streams.map((s) => (
                                <button
                                    key={s.url}
                                    onClick={() => setCurrentUrl(s.url)}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition ${currentUrl === s.url
                                        ? "!bg-emerald-500/20 !text-emerald-200 !border-emerald-400/30 shadow-[0_0_14px_rgba(16,185,129,.35)]"
                                        : ""
                                        }`}>
                                    <Radio className="w-4 h-4" /> {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <audio ref={audioRef} src={currentUrl} preload="none" />
                <div className="mt-8 h-10 flex items-end gap-1" aria-hidden>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ height: playing ? [4, 32, 10, 26, 8][i % 5] : 4 }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: (i % 5) * 0.05 }}
                            className="w-1 rounded bg-emerald-400/70 shadow-[0_0_12px_rgba(16,185,129,.65)]" />
                    ))}
                </div>
                {error && <div className="mt-4 text-rose-400 text-sm">{error}</div>}
            </div>
            <div className="mt-10 flex justify-center md:justify-start">
                <Link to="/en-direct" className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
                    ← Retour aux stations
                </Link>
            </div>
        </article>
    );
}
