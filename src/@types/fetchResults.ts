import type { Article } from "./article";
import type { Podcast } from "./podcast";

export type FetchResults<T> = {
    items: T[];
    lastPage: number | null;
    hasNext: boolean;
    lastBatchCount: number;
}