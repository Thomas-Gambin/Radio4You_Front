// src/pages/podcast/PodcastDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Podcast } from "../../@types/podcast";
import { formatDate } from "../../utils";
import { api } from "../../utils/api";

// Extrait l'id de la vidéo youtube pour etre affiché
function getYouTubeId(url?: string | null): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "");
        if (host === "youtu.be") return u.pathname.slice(1) || null;
        if (host.endsWith("youtube.com")) {
            if (u.pathname === "/watch") return u.searchParams.get("v");
            if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
            if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
        }
        return null;
    } catch {
        return null;
    }
}

export default function PodcastDetailPage() {
    const { id, slug } = useParams<{ id?: string; slug?: string }>();
    const [podcast, setPodcast] = useState<Podcast | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const key = id ?? slug;
        if (!key) {
            setError("Paramètre manquant.");
            return;
        }

        (async () => {
            try {
                const res = await api.get<Podcast>(`/podcasts/${key}`);
                setPodcast(res.data);
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    navigate("/404");
                    return;
                }
                setError("Podcast introuvable");
                console.error(err);
            }
        })();
    }, [id, slug, navigate]);

    const embedSrc = useMemo(() => {
        const vid = getYouTubeId(podcast?.videoUrl);
        return vid ? `https://www.youtube.com/embed/${encodeURIComponent(vid)}?rel=0` : null;
    }, [podcast?.videoUrl]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!podcast) return <p className="text-gray-400">Chargement...</p>;

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 text-white">
            {podcast.coverUrl && (
                <img
                    src={podcast.coverUrl}
                    alt={podcast.title}
                    className="w-full rounded-2xl shadow-lg mb-6 object-cover max-h-[300px]"
                />
            )}
            <h1 className="mt-15 text-3xl md:text-4xl font-bold mb-3 text-center">
                {podcast.title}
            </h1>
            {podcast.createdAt && (
                <div className="mb-6 text-sm text-white/70">
                    {formatDate(podcast.createdAt)}
                </div>
            )}
            {podcast.description ? (
                <div className="prose prose-invert max-w-none leading-relaxed text-justify text-lg">
                    {podcast.description.split("\n").map((p, i) => (
                        <p key={i} className="mb-4">
                            {p}
                        </p>
                    ))}
                </div>
            ) : (
                <p className="text-white/60 italic">Pas de description.</p>
            )}
            {/* Vidéo YouTube */}
            {embedSrc && (
                <div className="mb-12">
                    <div className="relative w-full" style={{ paddingTop: "55%" }}>
                        <iframe
                            src={embedSrc}
                            title={podcast.title}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full rounded-xl border border-white/10"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}
            <div className="mt-10 flex justify-center md:justify-start">
                <Link
                    to="/podcasts"
                    className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
                    ← Retour à la liste
                </Link>
            </div>
        </article>
    );
}
