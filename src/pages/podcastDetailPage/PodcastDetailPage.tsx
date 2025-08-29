// src/pages/podcastDetailPage/PodcastDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Podcast } from "../../@types/podcast";
import { formatDate } from "../../utils";
import { api } from "../../utils/api";
import { sanitizeHtml } from "../../utils/sanitize";

// Extraction de l'ID YouTube
function getYouTubeId(url?: string | null): string | null {
    if (!url) return null;
    try {
        const src = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        const u = new URL(src);
        const host = u.hostname.replace(/^www\./, "");

        if (host === "youtu.be") return u.pathname.slice(1) || null;

        if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
            if (u.pathname === "/watch") return u.searchParams.get("v");
            const m = u.pathname.match(/\/(embed|shorts|v)\/([A-Za-z0-9_-]{11})/);
            if (m) return m[2];
        }
    } catch {
    }

    // récupère l'id de la vidéo si le format n'est pas bon pour l'adapter à un format ok
    const m2 = url.match(/([A-Za-z0-9_-]{11})(?:\?.*)?$/);
    return m2 ? m2[1] : null;
}

export default function PodcastDetailPage() {
    const { idslug } = useParams<{ idslug: string }>();
    const id = (idslug ?? "").split("-")[0];
    const navigate = useNavigate();

    const [podcast, setPodcast] = useState<Podcast | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Paramètre manquant.");
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                const res = await api.get<Podcast>(`/podcasts/${id}`, {
                    signal: controller.signal,
                    headers: { Accept: "application/ld+json, application/json" },
                });
                setPodcast(res.data);
                if (res.data?.title) document.title = `${res.data.title} — Radio4You`;
            } catch (err: any) {
                if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") {
                    return;
                }
                if (err?.response?.status === 404) {
                    navigate("/404");
                    return;
                }
                setError("Podcast introuvable");
            }
        })();

        return () => controller.abort();
    }, [id, navigate]);

    if (error) return <p className="text-red-500 px-4 py-8">{error}</p>;
    if (!podcast) return <p className="text-gray-400 px-4 py-8">Chargement…</p>;

    const safeHtml = sanitizeHtml(podcast.description ?? "");

    const ytId = getYouTubeId(podcast.videoUrl);
    const embedSrc = ytId ? `https://www.youtube.com/embed/${encodeURIComponent(ytId)}?rel=0` : null;

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 text-white">
            {podcast.coverUrl && (
                <img
                    src={podcast.coverUrl}
                    alt={podcast.title}
                    className="w-full rounded-2xl shadow-lg mb-6 object-cover max-h-[300px]"
                    loading="eager" />
            )}
            <h1 className="mt-2 text-3xl md:text-4xl font-bold mb-3 text-center">
                {podcast.title}
            </h1>
            {podcast.createdAt && (
                <div className="mb-6 text-sm text-white/70 text-center">
                    {formatDate(podcast.createdAt)}
                </div>
            )}
            {podcast.description ? (
                <div
                    className="prose prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: safeHtml }} />
            ) : (
                <p className="text-white/60 italic">Pas de description.</p>
            )}
            {/* Vidéo YouTube */}
            {embedSrc && (
                <div className="mb-12 mt-8">
                    <div className="relative w-full" style={{ paddingTop: "55%" }}>
                        <iframe
                            src={embedSrc}
                            title={podcast.title}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="absolute inset-0 h-full w-full rounded-xl border border-white/10"
                            loading="lazy" />
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
