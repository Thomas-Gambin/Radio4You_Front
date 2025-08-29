export type FormData = {
    name: string;
    email: string;
    company?: string;
    website?: string;
    budget?: string;
    objective: "notoriety" | "leads" | "downloads" | "other";
    audience?: string;
    message: string;
    consent: boolean;
    phone?: string;
}