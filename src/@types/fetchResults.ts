export type FetchResults<T> = {
    items: T[];
    lastPage: number | null;
    hasNext: boolean;
    lastBatchCount: number;
}