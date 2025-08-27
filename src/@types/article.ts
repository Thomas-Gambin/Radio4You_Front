export type Article = {
    id: string | number;
    title: string;
    coverUrl?: string;
    content?: string;
    publishedAt?: string | Date | null;
}