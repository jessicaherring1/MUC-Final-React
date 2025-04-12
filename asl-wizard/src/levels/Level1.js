// Level1.js

import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { level1Questions } from "./Questions";
import HomeButton from "../HomeButton";
import "./Level1.css";

const DragItem = ({ word, index, moveWord, onRemove, isCorrect, showHintDetail }) => {
    const [, ref] = useDrag({ type: "SENTENCE_WORD", item: { index } });
    const [, drop] = useDrop({
        accept: "SENTENCE_WORD",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveWord(draggedItem.index, index);
                draggedItem.index = index;
            }
        }
    });

    return (
        <div
            ref={(node) => ref(drop(node))}
            className="drag-item"
            onClick={() => onRemove(index)}
            style={{
                backgroundColor: showHintDetail
                    ? isCorrect
                        ? "#d2f4d2"
                        : "#ffe6e6"
                    : undefined
            }}
        >
            {word}
        </div>
    );
};

const Level1 = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentQuestion = level1Questions[currentIndex];
    const [bankWords, setBankWords] = useState(shuffle([...currentQuestion.options]));
    const [sentenceWords, setSentenceWords] = useState([]);
    const [hintCount, setHintCount] = useState(null);
    const [revealedAnswer, setRevealedAnswer] = useState(false);
    const [showHintDetail, setShowHintDetail] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);

    const moveWord = (from, to) => {
        const updated = update(sentenceWords, {
            $splice: [
                [from, 1],
                [to, 0, sentenceWords[from]]
            ]
        });
        setSentenceWords(updated);
    };

    const handleAddWord = (word) => {
        setSentenceWords([...sentenceWords, word]);
        setBankWords(bankWords.filter(w => w !== word));
    };

    const handleRemoveWord = (index) => {
        const wordToRemove = sentenceWords[index];
        setSentenceWords(sentenceWords.filter((_, i) => i !== index));
        setBankWords([...bankWords, wordToRemove]);
    };

    const checkAnswer = () => {
        const isFullMatch =
            sentenceWords.length === currentQuestion.correctOrder.length &&
            sentenceWords.every((word, i) => word === currentQuestion.correctOrder[i]);

        if (isFullMatch) {
            setHintCount(currentQuestion.correctOrder.length);
            setRevealedAnswer(true);
        } else {
            const correct = sentenceWords.reduce(
                (count, word, i) => count + (word === currentQuestion.correctOrder[i] ? 1 : 0),
                0
            );
            setHintCount(correct);
        }
    };

    const giveUp = () => {
        setRevealedAnswer(true);
        setSentenceWords(currentQuestion.correctOrder);
    };

    const next = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < level1Questions.length) {
            setCurrentIndex(nextIndex);
            const nextQ = level1Questions[nextIndex];
            setBankWords(shuffle([...nextQ.options]));
            setSentenceWords([]);
            setHintCount(null);
            setRevealedAnswer(false);
            setShowHintDetail(false);
        } else {
            setShowCongrats(true);
        }
    };

    if (showCongrats) {
        return (
            <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#e6ffed", borderRadius: "1rem" }}>
                <h2>🎉 Congratulations!</h2>
                <p>You’ve completed Level 1.</p>
                <button onClick={() => window.location.href = "/level2"} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
                    ➡️ Continue to Level 2
                </button>
                <br />
                <button onClick={() => window.location.href = "/"} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}>
                    🏠 Return Home
                </button>
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="level-1">
                <HomeButton />
                <h2>Level 1: Build the ASL Sentence</h2>
                <p><strong>English:</strong> {currentQuestion.english}</p>

                <div className="sentence-slot">
                    {sentenceWords.length === 0 ? (
                        <div className="empty-slot">Click a word from the bank to add it here</div>
                    ) : (
                        sentenceWords.map((word, i) => (
                            <DragItem
                                key={i}
                                word={word}
                                index={i}
                                moveWord={moveWord}
                                onRemove={handleRemoveWord}
                                isCorrect={word === currentQuestion.correctOrder[i]}
                                showHintDetail={showHintDetail}
                            />
                        ))
                    )}
                </div>

                <div className="word-bank">
                    <h3>Word Bank</h3>
                    <div className="bank-container">
                        {bankWords.map((word, i) => (
                            <div
                                key={i}
                                className="bank-word"
                                onClick={() => handleAddWord(word)}
                            >
                                {word}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="buttons">
                    <button onClick={checkAnswer}>Check</button>
                    <button onClick={giveUp}>Give Up</button>
                    <button onClick={() => setShowHintDetail(!showHintDetail)}>
                        💡 {showHintDetail ? "Hide Hint" : "Need a Hint?"}
                    </button>
                </div>

                {hintCount !== null && !revealedAnswer && (
                    <p>{hintCount} word(s) are in the correct position.</p>
                )}

                {hintCount === currentQuestion.correctOrder.length && !revealedAnswer && (
                    <p style={{ color: "green" }}>🎉 Correct! Nice work!</p>
                )}

                {revealedAnswer && (
                    <p>The correct order is: {currentQuestion.correctOrder.join(" ")}</p>
                )}

                {(hintCount === currentQuestion.correctOrder.length || revealedAnswer) && currentIndex < level1Questions.length && (
                    <button onClick={next}>➡️ Next Question</button>
                )}

                {currentQuestion.hintWords && (
                    <p>💡 Use these words: {currentQuestion.hintWords.join(", ")}</p>
                )}
            </div>
        </DndProvider>
    );
};

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default Level1;
