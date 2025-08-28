import type { FetchOpts } from "./jamendo";

export type Card = {
    id: string;
    title: string;
    subtitle?: string;
    cover?: string;
    params: FetchOpts;
};
