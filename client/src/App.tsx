
import { useState, useRef } from "react";
import { askStructured, type AskResult } from "./api/ask.ts";
import "./App.css";

export default function App() {
    const [query, setQuery] = useState("");
    const [answers, setAnswers] = useState<AskResult[]>([]);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleQuerySubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!query.trim() || loading) return;

        setLoading(true);

        try {
            const result = await askStructured(query.trim());

            setAnswers((previous) => [...previous, result]);
            setQuery("");
            inputRef.current?.focus();

            console.log("API response:", result);
        } catch (err) {
            console.error("Request failed:", err);
            alert(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <main className="container">
                <header>
                    <h1>Hello Agent - Ask anything</h1>
                </header>

                <section className="answers-card">
                    <h2>Answers</h2>

                    <div className="answer-list">
                        {answers.length === 0 ? (
                            <p className="empty">
                                No answers yet. Ask a question below.
                            </p>
                        ) : (
                            answers.map((ans, index) => (
                                <div className="answer" key={index}>
                                    <div>{ans.summary}</div>
                                    <div className="confidence">
                                        Confidence: {ans.confidence.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}

                        {loading && <p className="empty">Thinking...</p>}
                    </div>
                </section>

                <form
                    ref={formRef}
                    onSubmit={handleQuerySubmit}
                    className="ask-form"
                >
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your question and press Ask"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                    >
                        {loading ? "Asking..." : "Ask"}
                    </button>
                </form>
            </main>
        </div>
    );
}
