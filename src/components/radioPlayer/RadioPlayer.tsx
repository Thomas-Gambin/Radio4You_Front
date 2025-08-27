import React, { useEffect, useMemo, useRef, useState } from "react";
import type { JamendoTrack, FetchOpts } from "../../@types/jamendo";

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID as string;


function fmtTime(sec: number) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

async function fetchJamendoTracks(opts: FetchOpts = {}): Promise<JamendoTrack[]> {
    if (!CLIENT_ID) throw new Error("VITE_JAMENDO_CLIENT_ID manquant");

    const {
        tags = ["electro", "pop"],
        search,
        limit = 30,
        audioformat = "mp32",
    } = opts;

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: String(limit),
        audioformat,
        order: "popularity_total",
    });

    if (tags.length) params.set("fuzzytags", tags.join(","));
    if (search && search.trim()) params.set("search", search.trim());

    const url = `https://api.jamendo.com/v3.0/tracks/?${params.toString()}`;
    const res = await fetch(url);
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

/** Hook playlist Jamendo */
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

export default function RadioPlayer({
    tags = ["electro", "dance", "pop"],
    search,
    className = "",
}: {
    tags?: string[];
    search?: string;
    className?: string;
}) {
    const { tracks, loading, error } = useJamendoPlaylist({
        tags,
        search,
        limit: 50,
        audioformat: "mp32",
    });

    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.9);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef<HTMLInputElement | null>(null);

    const current = useMemo(() => tracks[index], [tracks, index]);
    const cover = current?.album_image || current?.image;

    // Charge et joue la musique
    useEffect(() => {
        const audio = audioRef.current;
        if (current && audio) {
            audio.src = current.audio;
            audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
            setProgress(0);
        }
    }, [current?.id]);

    // Volume
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // Handlers
    const playPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
            audio.pause();
            setPlaying(false);
        }
    };

    const next = () => {
        if (!tracks.length) return;
        setIndex((i) => (i + 1) % tracks.length);
    };

    const prev = () => {
        if (!tracks.length) return;
        setIndex((i) => (i - 1 + tracks.length) % tracks.length);
    };

    const onTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setProgress(audio.currentTime || 0);
        setDuration(audio.duration || 0);
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const v = Number(e.target.value);
        audio.currentTime = v;
        setProgress(v);
    };

    const onEnded = () => next();

    // Raccourcis clavier
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
            if (e.code === "Space") {
                e.preventDefault();
                playPause();
            } else if (e.code === "ArrowRight") {
                next();
            } else if (e.code === "ArrowLeft") {
                prev();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [tracks.length]);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0b1321]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b1321]/70 ${className}`}>
            <audio
                ref={audioRef}
                onTimeUpdate={onTimeUpdate}
                onEnded={onEnded}
                preload="metadata"
            />

            <div className="mx-auto max-w-7xl px-4 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/5 shrink-0">
                            {cover ? (
                                <img src={cover} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white">
                                {loading ? "Chargement..." : current ? current.name : error ? "Erreur" : "Aucun titre"}
                            </div>
                            <div className="truncate text-xs text-white/70">
                                {current ? current.artist_name : "Jamendo"}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            className="rounded-xl border border-white/15 px-3 py-2 text-white hover:bg-white/5 transition"
                            title="Précédent (←)"
                        >
                            ◄◄
                        </button>
                        <button
                            onClick={playPause}
                            className="rounded-xl border border-white/15 px-4 py-2 text-white hover:bg-white/5 transition"
                            title="Lecture/Pause (Espace)"
                        >
                            {playing ? "⏸" : "▶️"}
                        </button>
                        <button
                            onClick={next}
                            className="rounded-xl border border-white/15 px-3 py-2 text-white hover:bg-white/5 transition"
                            title="Suivant (→)"
                        >
                            ►►
                        </button>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                        <span className="text-xs tabular-nums text-white/70">{fmtTime(progress)}</span>
                        <input
                            ref={progressRef}
                            type="range"
                            min={0}
                            max={Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : 0}
                            value={Math.min(Math.floor(progress), Math.floor(duration || 0))}
                            onChange={onSeek}
                            className="w-full accent-white/80"
                        />
                        <span className="text-xs tabular-nums text-white/70">{fmtTime(duration)}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-xs text-white/70">🔊</span>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-28 accent-white/80"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
