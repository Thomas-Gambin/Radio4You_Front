import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import type { Program } from "../../@types/live";

// API Open Radio France
const RF_ENDPOINT = "https://openapi.radiofrance.fr/v1/graphql";
const RF_TOKEN = import.meta.env.VITE_RADIOFRANCE_API_TOKEN as string | undefined;

// Helpers
const toSec = (d: Date) => Math.floor(d.getTime() / 1000);
const hhmm = (tsSec: number) =>
    new Date(tsSec * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

async function rfFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    if (!RF_TOKEN) throw new Error("Clé API absente (VITE_RADIOFRANCE_API_TOKEN).");
    const res = await fetch(RF_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-token": RF_TOKEN },
        body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`OpenAPI RF ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message ?? "Erreur OpenAPI RF");
    return json.data;
}

async function getFranceInterLive() {
    const query = `query { brand(id: FRANCEINTER) { id title liveStream } }`;
    const data = await rfFetch<{ brand: { id: string; title: string; liveStream: string } }>(query);
    return data.brand;
}
async function getFranceInterGrid(startSec: number, endSec: number) {
    const query = `
    query($start: Int!, $end: Int!) {
      grid(station: FRANCEINTER, start: $start, end: $end) {
        ... on DiffusionStep { id start end diffusion { id title url } }
      }
    }
  `;
    type Row = { id: string; start: number; end: number; diffusion?: { id: string; title: string } };
    const data = await rfFetch<{ grid: Row[] }>(query, { start: startSec, end: endSec });
    return data.grid;
}

export default function EnDirectPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Données API
    const [stationName, setStationName] = useState<string>("France Inter");
    const [currentUrl, setCurrentUrl] = useState<string | null>(null); // un seul flux
    const [prog, setProg] = useState<Program[]>([]);

    // Player
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

    // Chargement API
    useEffect(() => {
        (async () => {
            try {
                setError(null);
                // 1) flux live
                const brand = await getFranceInterLive();
                setStationName(brand.title);
                setCurrentUrl(brand.liveStream);
                // 2) grille du jour
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                const rows = await getFranceInterGrid(toSec(start), toSec(end));
                const mapped: Program[] = rows
                    .map((r, i) => ({
                        id: r.id ?? `slot-${r.start}-${r.end}-${i}`,
                        start: r.start,
                        end: r.end,
                        title: r.diffusion?.title || `Émission ${i + 1}`,
                    }))
                    .sort((a, b) => a.start - b.start);
                setProg(mapped);
            } catch (e: any) {
                setError(e?.message ?? "Erreur de récupération des données France Inter.");
            }
        })();
    }, []);

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

    // Initialisation du lecteur
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentUrl) return;
        setError(null);
        setBuffering(true);
        audio.src = currentUrl;
        audio.load();
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
    }, [currentUrl]);

    // Handlers
    const onPlay = async () => {
        const audio = audioRef.current;
        if (!audio || !currentUrl) return;
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

    // Auto-scroll prog
    const nowSec = Math.floor(Date.now() / 1000);
    const nowIdx = prog.findIndex((it) => nowSec >= it.start && nowSec < it.end);
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
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
            scroller.scrollTo({ left: Math.max(0, card.offsetLeft - 12), behavior: "smooth" });
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
            <h1 className="mt-2 text-3xl md:text-4xl font-bold mb-6 text-center">En direct — {stationName}</h1>
            {/* Programmation */}
            <section className="mb-6" aria-label="Programmation">
                <div className="text-lg font-semibold mb-3">Programmation</div>
                <div ref={scrollerRef} className="overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                    <ol className="flex gap-2 min-w-full pr-2">
                        {prog.map((it, i) => {
                            const isNow = nowIdx === i;
                            const pct = isNow ? progressPct(it.start, it.end) : 0;
                            return (
                                <li
                                    key={it.id}
                                    ref={setCardRef(i)}
                                    className="snap-start min-w-[180px] md:min-w-[200px] rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 shrink-0"
                                    aria-current={isNow ? "true" : undefined}
                                >
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
                                            <div className="mt-1 h-1 w-full rounded-full bg-white/10">
                                                <div className="h-1 rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
                                            </div>
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>
            {/* Player (un seul flux) */}
            <div className="w-full rounded-2xl border border-white/10 bg-[#111a2c]/80 backdrop-blur-md shadow p-6 md:p-8" aria-busy={buffering}>
                <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="text-xl font-semibold">{stationName}</div>
                        <div className="mt-1 flex items-center gap-2 text-white/70">
                            <span className="inline-flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${playing ? "bg-emerald-400" : "bg-white/40"}`} />
                                {status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {!playing ? (
                        <button
                            onClick={onPlay}
                            disabled={!currentUrl || buffering}
                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-emerald-400/30 bg-emerald-500/20 text-emerald-200"
                        >
                            {buffering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Lire
                        </button>
                    ) : (
                        <button
                            onClick={onPause}
                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-emerald-400/30 bg-emerald-500/20 text-emerald-200"
                        >
                            <Pause className="w-4 h-4" />
                            Pause
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={toggleMute}
                            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/10 bg-white/5 text-white/90"
                        >
                            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            {muted ? "Son coupé" : "Volume"}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={muted ? 0 : volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-40 accent-emerald-400"
                            aria-label="Régler le volume"
                        />
                    </div>
                </div>
                {currentUrl && <audio ref={audioRef} src={currentUrl} preload="none" />}
                <div className="mt-8 h-10 flex items-end gap-1" aria-hidden>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ height: playing ? [4, 32, 10, 26, 8][i % 5] : 4 }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: (i % 5) * 0.05 }}
                            className="w-1 rounded bg-emerald-400/70"
                        />
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
