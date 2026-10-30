export type AskResult = {
    summary: string;
    confidence: number;
};

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export async function askStructured(query: string): Promise<AskResult> {
    const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();

    console.log("Received from backend:", data);

    if (!response.ok) {
        throw new Error(data.error || "Failed to get answer");
    }

    return data as AskResult;
}