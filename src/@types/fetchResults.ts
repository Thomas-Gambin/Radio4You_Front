import type { Article } from "./article";
import type { Podcast } from "./podcast";

export type FetchResults = {
    items: Article[] | Podcast[];
    lastPage: number | null;
    hasNext: boolean;
    lastBatchCount: number;
}