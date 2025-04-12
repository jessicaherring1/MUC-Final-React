// Level2.js

import React, { useState } from "react";
import HomeButton from "../HomeButton";
import { level2Questions } from "./Questions";

function Level2() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentQuestion = level2Questions[currentIndex];

    const [userInput, setUserInput] = useState("");
    const [hint, setHint] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [corrections, setCorrections] = useState([]);
    const [showCongrats, setShowCongrats] = useState(false);

    const levenshtein = (a, b) => {
        const matrix = Array.from({ length: a.length + 1 }, () =>
            Array(b.length + 1).fill(0)
        );
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                matrix[i][j] = a[i - 1] === b[j - 1]
                    ? matrix[i - 1][j - 1]
                    : 1 + Math.min(
                        matrix[i - 1][j],
                        matrix[i][j - 1],
                        matrix[i - 1][j - 1]
                    );
            }
        }
        return matrix[a.length][b.length];
    };

    const suggestCorrections = (word, vocab) => {
        const suggestions = vocab
            .map((target) => ({
                word: target,
                dist: levenshtein(word.toLowerCase(), target.toLowerCase())
            }))
            .filter((s) => s.dist > 0 && s.dist <= 2)
            .sort((a, b) => a.dist - b.dist);
        return suggestions.length > 0 ? suggestions[0].word : null;
    };

    const isMatch = (inputWords, correctArr) => {
        return (
            inputWords.length === correctArr.length &&
            inputWords.every((w, i) => w === correctArr[i])
        );
    };

    const handleCheck = () => {
        const cleanedInput = userInput
            .trim()
            .replace(/[.,!?]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(" ");

        const correctCount = cleanedInput.reduce(
            (acc, word, i) => acc + (word === currentQuestion.correctOrder[i] ? 1 : 0),
            0
        );
        setHint(correctCount);

        const normalizedCorrect = currentQuestion.correctOrder.map(w => w.toLowerCase());
        const match = isMatch(cleanedInput, normalizedCorrect) ||
            (currentQuestion.alternateAnswers || []).some(alt => isMatch(cleanedInput, alt.map(w => w.toLowerCase())));

        setIsCorrect(match);

        const suggestions = cleanedInput.map(w => suggestCorrections(w, normalizedCorrect));
        setCorrections(suggestions);
    };

    const handleGiveUp = () => {
        setShowAnswer(true);
        setIsCorrect(false);
    };

    const handleNext = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < level2Questions.length) {
            setCurrentIndex(nextIndex);
            setUserInput("");
            setHint(null);
            setShowAnswer(false);
            setIsCorrect(null);
            setCorrections([]);
        } else {
            setShowCongrats(true);
        }
    };

    if (showCongrats) {
        return (
            <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#e6ffed", borderRadius: "1rem" }}>
                <h2>🎉 Congratulations!</h2>
                <p>You’ve completed Level 2.</p>
                <button onClick={() => window.location.href = "/level3"} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
                    ➡️ Continue to Level 3
                </button>
                <br />
                <button onClick={() => window.location.href = "/"} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}>
                    🏠 Return Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
            <HomeButton />
            <h2>Level 2: Type the ASL Translation</h2>
            <p><strong>English:</strong> {currentQuestion.english}</p>

            <textarea
                placeholder="Type the ASL sentence here..."
                rows={2}
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/\s+/g, " "))}
            />

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={handleCheck}>✅ Check</button>
                <button onClick={handleGiveUp}>🤷 Give Up</button>
            </div>

            {currentQuestion.hintWords && (
                <p>💡 Use these words: {currentQuestion.hintWords.join(", ")}</p>
            )}

            {hint !== null && !showAnswer && (
                <p>✅ {hint} word{hint !== 1 ? "s" : ""} in the correct position.</p>
            )}

            {isCorrect === true && (
                <p style={{ color: "green" }}>🎉 Great job! Your ASL sentence is correct.</p>
            )}

            {isCorrect === false && (
                <p style={{ color: "#c62828" }}>
                    ❌ That wasn't quite right — check word order and spelling.
                </p>
            )}

            {corrections.length > 0 && (
                <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
                    <p>💡 Suggestions:</p>
                    <ul>
                        {corrections.map((c, i) =>
                            c ? <li key={i}>Did you mean <strong>{c}</strong>?</li> : null
                        )}
                    </ul>
                </div>
            )}

            {showAnswer && (
                <div style={{ backgroundColor: "#f1f1f1", padding: "1rem", borderRadius: "8px" }}>
                    <strong>Correct ASL Sentence:</strong>
                    <p>{currentQuestion.correctOrder.join(" ")}</p>
                </div>
            )}

            {(isCorrect || showAnswer) && currentIndex < level2Questions.length && (
                <button onClick={handleNext}>➡️ Next Question</button>
            )}
        </div>
    );
}

export default Level2;
