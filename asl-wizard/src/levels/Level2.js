import React, { useState } from "react";
import HomeButton from "../HomeButton";

const correctOrder = ["go", "I", "work"];
const englishSentence = "I am going to work.";

function Level2() {
    const [userInput, setUserInput] = useState("");
    const [hint, setHint] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [corrections, setCorrections] = useState([]);


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
            dist: levenshtein(word.toLowerCase(), target.toLowerCase()),
        }))
        .filter((s) => s.dist > 0 && s.dist <= 2) // limit suggestion noise
        .sort((a, b) => a.dist - b.dist);
    
        return suggestions.length > 0 ? suggestions[0].word : null;
    };
    
    const handleCheck = () => {
        const cleanedInput = userInput
        .trim()
        .replace(/[.,!?]/g, '')         // remove basic punctuation
        .replace(/\s+/g, " ")           // normalize spaces
        .toLowerCase()
        .split(" ");

        const normalizedCorrect = correctOrder.map(word => word.toLowerCase());
        const correctCount = cleanedInput.reduce(
            (acc, word, i) => acc + (word === normalizedCorrect[i] ? 1 : 0),
            0
        );          
        setHint(correctCount);
    
        const isAllCorrect =
        cleanedInput.length === correctOrder.length &&
        correctCount === correctOrder.length;
    
        setIsCorrect(isAllCorrect);
    
        // Autocorrect Suggestions
        const corrections = cleanedInput.map((w) =>
            suggestCorrections(w, normalizedCorrect)
        );        
        setCorrections(corrections);
    };
    
    const handleGiveUp = () => {
        setShowAnswer(true);
        setIsCorrect(false);
    };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        <HomeButton />
        <h2>Level 2: Type the ASL Translation</h2>
        <p><strong>English:</strong> {englishSentence}</p>

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

        {hint !== null && !showAnswer && (
            <p>✅ {hint} word{hint !== 1 ? "s" : ""} in the correct position.</p>
        )}

        {isCorrect === true && (
            <p style={{ color: "green" }}>🎉 Great job! Your ASL sentence is correct.</p>
        )}

        {isCorrect === false && (
        <p style={{ color: "#c62828" }}>
            ❌ That wasn't quite right — make sure the **word order, spelling**, and **punctuation** are correct.
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
            <p>{correctOrder.join(" ")}</p>
            </div>
        )}
    </div>
  );
}

export default Level2;
