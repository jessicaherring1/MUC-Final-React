import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeButton from '../HomeButton';

const coreWords = [
    { word: "You", scenario: "You're offering a toy to your child. What do you sign first?" },
    { word: "Me", scenario: "Your child points at you asking for help. How do you respond?" },
    { word: "Want", scenario: "Your child reaches for a snack. What do you sign?" },
    { word: "More", scenario: "Your child finishes their drink and gestures again. What do you sign?" },
    { word: "Now", scenario: "Your child is getting impatient for food. What time word do you sign?" },
    { word: "Eat", scenario: "You're about to feed your child lunch. What do you sign?" },
    { word: "Drink", scenario: "You hand your child a bottle. What do you sign?" },
    { word: "Help", scenario: "Your child is frustrated with a toy. What do you sign?" },
    { word: "Bathroom", scenario: "Your child is starting potty training. What do you sign?" },
    { word: "Sleep", scenario: "You're tucking your child into bed. What do you sign?" }
];

export default function Level0() {
    const [current, setCurrent] = useState(0);
    const [showDone, setShowDone] = useState(false);

    const next = () => {
        if (current < coreWords.length - 1) {
            setCurrent(current + 1);
        } else {
            setShowDone(true);
        }
    };

    const prev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const videoOverrides = {
        eat: "eat_1"
    };

    const sanitizedWord = coreWords[current].word.toLowerCase().replace(/\s+/g, '_');
    const aslSignKey = videoOverrides[sanitizedWord] || sanitizedWord;

    return (
        <div style={{ padding: '1rem' }}>
            <HomeButton />
            <AnimatePresence mode="wait">
                {showDone ? (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{ textAlign: 'center', backgroundColor: '#e6ffed', padding: '2rem', borderRadius: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: '#2e7d32' }}>🎉 You did it!</h2>
                            <p>You've completed Level 0: First Signs.</p>
                            <button onClick={() => window.location.href = "/level1"} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                                I'm Ready for Level 1
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: '2rem', borderRadius: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                Sign: {coreWords[current].word}
                            </h2>

                            <iframe
                                key={aslSignKey}
                                title={`ASL sign for ${coreWords[current].word}`}
                                src={`https://asl-lex.org/visualization/?sign=${aslSignKey}`}
                                width="100%"
                                height="400"
                                style={{ border: 'none', borderRadius: '12px', margin: '1rem 0' }}
                            />

                            <button
                                onClick={() =>
                                    window.open(
                                        `https://asl-lex.org/visualization/?sign=${aslSignKey}`,
                                        '_blank'
                                    )
                                }
                                style={{
                                    backgroundColor: '#6c63ff',
                                    color: '#fff',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                🎥 View Sign with Video
                            </button>

                            <p style={{ fontStyle: 'italic', color: '#555' }}>{coreWords[current].scenario}</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={prev} disabled={current === 0} style={{ padding: '0.5rem 1rem' }}>
                                    Previous
                                </button>
                                <button onClick={next} style={{ padding: '0.5rem 1rem' }}>
                                    {current === coreWords.length - 1 ? "Finish" : "Next"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
