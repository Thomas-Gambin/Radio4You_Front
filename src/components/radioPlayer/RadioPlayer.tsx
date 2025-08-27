import { useEffect, useMemo, useRef, useState } from "react";
import type { JamendoTrack, FetchOpts } from "../../@types/jamendo";
import { Play, Pause, SkipBack, SkipForward, Maximize2, Minimize2, Volume2 } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID as string;

// Converti la durée en mm:ss
function fmtTime(sec: number) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Récupère l'api jamendo
async function fetchJamendoTracks(opts: FetchOpts = {}): Promise<JamendoTrack[]> {
    if (!CLIENT_ID) throw new Error("VITE_JAMENDO_CLIENT_ID manquant");
    const { limit = 30, audioformat = "mp32" } = opts;

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: String(limit),
        audioformat,
        order: "popularity_total",
    });

    const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params.toString()}`);
    if (!res.ok) throw new Error(`Jamendo error ${res.status}`);
    const data = await res.json();
    const list = (data?.results || []) as any[];

    return list.map((t) => ({
        id: String(t.id),
        name: t.name,
        artist_name: t.artist_name,
        audio: t.audio,
        image: t.image,
        album_image: t.album_image,
        duration: t.duration,
    }));
}

// Récupère une playlist jamendo
function useJamendoPlaylist(params: FetchOpts) {
    const [tracks, setTracks] = useState<JamendoTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        fetchJamendoTracks(params)
            .then((res) => !cancelled && setTracks(res))
            .catch((e) => !cancelled && setError(e instanceof Error ? e.message : String(e)))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [JSON.stringify(params)]);

    return { tracks, loading, error };
}

function VerticalSlider({
    min, max, step = 1, value, onChange, ariaLabel
}: {
    min: number; max: number; step?: number; value: number;
    onChange: (v: number) => void; ariaLabel?: string;
}) {
    return (
        <div className="relative h-32 w-6 flex items-center justify-center">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                aria-label={ariaLabel}
                className="absolute h-6 w-32 -rotate-90 origin-center accent-white/80"
            />
        </div>
    );
}

export default function RadioDockRight({ className = "" }: { className?: string }) {
    const { tracks, loading, error } = useJamendoPlaylist({ limit: 30, audioformat: "mp32" });
    const { playing, togglePlay } = usePlayer();

    const [expanded, setExpanded] = useState(false);
    const [index, setIndex] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [avoidPx, setAvoidPx] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const current = useMemo(() => tracks[index], [tracks, index]);
    const cover = current?.album_image || current?.image;

    // Charger piste
    useEffect(() => {
        const audio = audioRef.current;
        if (current && audio) {
            audio.src = current.audio;
            if (playing) audio.play().catch(() => { /* Bloque la lecture auto */ });
            setProgress(0);
        }
    }, [current?.id, playing]);

    // Sync play/pause
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) a.play().catch(() => { /* Bloque la lecture auto */ });
        else a.pause();
    }, [playing]);

    // Volume
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // Eviter le player sur footer en mobile
    useEffect(() => {
        const footer = document.getElementById("app-footer");
        if (!footer) return;

        const compute = () => {
            const rect = footer.getBoundingClientRect();
            const overlap = Math.max(0, window.innerHeight - rect.top);
            setAvoidPx(overlap);
        };

        compute();
        window.addEventListener("scroll", compute, { passive: true });
        window.addEventListener("resize", compute);
        const ro = new ResizeObserver(compute);
        ro.observe(footer);

        return () => {
            window.removeEventListener("scroll", compute);
            window.removeEventListener("resize", compute);
            ro.disconnect();
        };
    }, []);

    // Handlers
    const next = () => { if (tracks.length) setIndex((i) => (i + 1) % tracks.length); };
    const prev = () => { if (tracks.length) setIndex((i) => (i - 1 + tracks.length) % tracks.length); };
    const onTimeUpdate = () => {
        const a = audioRef.current; if (!a) return;
        setProgress(a.currentTime || 0); setDuration(a.duration || 0);
    };
    const onSeek = (v: number) => {
        const a = audioRef.current; if (!a) return;
        a.currentTime = v; setProgress(v);
    };

    const widthClass = expanded ? "w-80 sm:w-96" : "w-16";
    const railColor = "border-white/10 bg-[#0b1321]/95 supports-[backdrop-filter]:bg-[#0b1321]/70";

    return (
        <>
            <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={next} preload="metadata" />

            {/* Mobile */}
            <div
                className={`md:hidden fixed left-0 right-0 z-50 border-t ${railColor} backdrop-blur ${className}`}
                style={{ bottom: avoidPx }}>
                <div className="mx-auto max-w-7xl px-3 py-2 pb-[env(safe-area-inset-bottom)]">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/5 shrink-0">
                            {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-white">
                                {loading ? "Chargement..." : current ? current.name : error ? "Erreur" : "Aucun titre"}
                            </div>
                            <div className="truncate text-[11px] text-white/70">
                                {error ? `Erreur Jamendo` : current ? current.artist_name : "Jamendo"}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={prev} className="rounded-lg border border-white/15 p-2 text-white hover:bg-white/5 transition" title="Précédent">
                                <SkipBack className="h-4 w-4" />
                            </button>
                            <button onClick={togglePlay} className="rounded-lg border border-white/15 p-2.5 text-white hover:bg-white/5 transition" title="Lecture / Pause">
                                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </button>
                            <button onClick={next} className="rounded-lg border border-white/15 p-2 text-white hover:bg-white/5 transition" title="Suivant">
                                <SkipForward className="h-4 w-4" />
                            </button>
                            <button onClick={() => setExpanded((e) => !e)} className="rounded-lg border border-white/15 p-2 text-white hover:bg-white/5 transition" title={expanded ? "Réduire" : "Agrandir"}>
                                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] tabular-nums text-white/60">{fmtTime(progress)}</span>
                        <input
                            type="range"
                            min={0}
                            max={Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : 0}
                            value={Math.min(Math.floor(progress), Math.floor(duration || 0))}
                            onChange={(e) => onSeek(Number(e.target.value))}
                            className="w-full accent-white/80"
                        />
                        <span className="text-[10px] tabular-nums text-white/60">{fmtTime(duration)}</span>
                    </div>
                </div>
            </div>
            {expanded && (
                <div className="md:hidden fixed inset-0 z-[60] bg-[#0b1321]/95 backdrop-blur">
                    <div className="mx-auto max-w-7xl p-4 flex h-full flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/5 shrink-0">
                                    {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : null}
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-base font-semibold text-white">
                                        {loading ? "Chargement..." : current ? current.name : error ? "Erreur" : "Aucun titre"}
                                    </div>
                                    <div className="truncate text-sm text-white/70">
                                        {error ? `Erreur Jamendo` : current ? current.artist_name : "Jamendo"}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setExpanded(false)} className="rounded-xl border border-white/15 p-2 text-white hover:bg-white/5 transition" title="Fermer">
                                <Minimize2 className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <button className="rounded-xl border border-white/15 p-3 text-white hover:bg-white/5 transition" onClick={prev} title="Précédent">
                                <SkipBack className="h-5 w-5" />
                            </button>
                            <button className="rounded-2xl border border-white/15 p-4 text-white hover:bg-white/5 transition" onClick={togglePlay} title="Lecture / Pause">
                                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                            </button>
                            <button className="rounded-xl border border-white/15 p-3 text-white hover:bg-white/5 transition" onClick={next} title="Suivant">
                                <SkipForward className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs tabular-nums text-white/70">{fmtTime(progress)}</span>
                            <input
                                type="range"
                                min={0}
                                max={Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : 0}
                                value={Math.min(Math.floor(progress), Math.floor(duration || 0))}
                                onChange={(e) => onSeek(Number(e.target.value))}
                                className="w-full accent-white/80" />
                            <span className="text-xs tabular-nums text-white/70">{fmtTime(duration)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Volume2 className="h-4 w-4 text-white/70" />
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={Math.round(volume * 100)}
                                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                                className="w-full accent-white/80" />
                        </div>
                        <div className="flex-1 overflow-auto rounded-xl border border-white/10">
                            <ul className="divide-y divide-white/5">
                                {tracks.map((t, i) => (
                                    <li
                                        key={t.id}
                                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-white/5 ${i === index ? "bg-white/5 text-white" : "text-white/80"}`}
                                        onClick={() => i !== index && setIndex(i)}>
                                        <div className="truncate font-medium">{t.name}</div>
                                        <div className="truncate text-xs text-white/60">{t.artist_name}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {/* Desktop */}
            <aside
                className={`hidden md:block fixed top-0 right-0 z-50 h-screen ${widthClass} border-l ${railColor} backdrop-blur transition-all duration-300 ${className}`}
                aria-label="Lecteur Radio vertical">
                <div className="flex h-full">
                    <div className="flex w-16 shrink-0 flex-col items-center gap-4 py-4">
                        <button onClick={() => setExpanded((e) => !e)} className="rounded-xl border border-white/15 p-2 text-white hover:bg-white/5 transition" title={expanded ? "Réduire" : "Agrandir"}>
                            {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                        </button>
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/5">
                            {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <button onClick={prev} className="rounded-xl border border-white/15 p-2 text-white hover:bg-white/5 transition" title="Précédent">
                            <SkipBack className="h-4 w-4" />
                        </button>
                        <button onClick={togglePlay} className="rounded-2xl border border-white/15 p-3 text-white hover:bg-white/5 transition" title="Lecture / Pause">
                            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>
                        <button onClick={next} className="rounded-xl border border-white/15 p-2 text-white hover:bg-white/5 transition" title="Suivant">
                            <SkipForward className="h-4 w-4" />
                        </button>
                        <div className="mt-2 flex flex-col items-center gap-1 text-[10px] text-white/70">
                            <span>{fmtTime(progress)}</span>
                            <VerticalSlider
                                min={0}
                                max={Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : 0}
                                value={Math.min(Math.floor(progress), Math.floor(duration || 0))}
                                onChange={onSeek}
                                ariaLabel="Progression" />
                            <span>{fmtTime(duration)}</span>
                        </div>
                        <div className="mt-2 flex flex-col items-center gap-1 text-[10px] text-white/70">
                            <Volume2 className="h-4 w-4" />
                            <VerticalSlider
                                min={0}
                                max={100}
                                value={Math.round(volume * 100)}
                                onChange={(v) => setVolume(v / 100)}
                                ariaLabel="Volume"
                            />
                        </div>
                    </div>
                    {expanded && (
                        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
                            <div>
                                <div className="truncate text-base font-semibold text-white">
                                    {loading ? "Chargement..." : current ? current.name : error ? "Erreur" : "Aucun titre"}
                                </div>
                                <div className="truncate text-sm text-white/70">
                                    {error ? `Erreur Jamendo: ${error}` : current ? current.artist_name : "Jamendo"}
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto rounded-xl border border-white/10">
                                <ul className="divide-y divide-white/5">
                                    {tracks.map((t, i) => (
                                        <li
                                            key={t.id}
                                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-white/5 ${i === index ? "bg-white/5 text-white" : "text-white/80"}`}
                                            onClick={() => i !== index && setIndex(i)}>
                                            <div className="truncate font-medium">{t.name}</div>
                                            <div className="truncate text-xs text-white/60">{t.artist_name}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
