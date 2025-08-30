export type StreamOption = {
    label: string;
    url: string;
};

export type Station = {
    name: string;
    streams: StreamOption[];
};

export type Program = {
    id: string;
    start: number;
    end: number;
    title: string;
};