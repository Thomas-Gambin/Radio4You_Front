import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ContextWrappers({ children }: Props) {
    return (
        <>
            {children}
        </>
    );
}