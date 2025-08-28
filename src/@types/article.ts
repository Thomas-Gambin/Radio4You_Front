export type Article = {
    id: string | number;
    title: string;
    coverUrl?: string;
    content?: string;
    createdAt?: string | Date | null;
}