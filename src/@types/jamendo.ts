export type JamendoTrack = {
    id: string;
    name: string;
    artist_name: string;
    audio: string;
    image?: string;
    album_image?: string;
    duration?: number;
};

export type FetchOpts = {
    search?: string;
    limit?: number;
    tags?: string[];        // optionnel: converti en fuzzytags
    audioformat?: "mp31" | "mp32" | "ogg" | "flac";
};
