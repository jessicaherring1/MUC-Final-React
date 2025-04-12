// Level0.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const coreWords = [
  {
    word: "More",
    scenario: "Your child wants another bite of food. What do you sign?"
  },
  {
    word: "All Done",
    videoUrl: "https://asl-lex.org/visualization/videos/all_done.mp4",
    scenario: "Mealtime is over. What do you sign?"
  },
  {
    word: "Eat",
    videoUrl: "https://asl-lex.org/visualization/videos/eat.mp4",
    scenario: "It's time for lunch. What do you sign?"
  },
  {
    word: "Drink",
    videoUrl: "https://asl-lex.org/visualization/videos/drink.mp4",
    scenario: "Your child is thirsty. What do you sign?"
  },
  {
    word: "Bathroom",
    videoUrl: "https://asl-lex.org/visualization/videos/bathroom.mp4",
    scenario: "Your child needs to go potty. What do you sign?"
  },
  {
    word: "Help",
    videoUrl: "https://asl-lex.org/visualization/videos/help.mp4",
    scenario: "Your child is struggling with a toy. What do you sign?"
  },
  {
    word: "Sleep",
    videoUrl: "https://asl-lex.org/visualization/videos/sleep.mp4",
    scenario: "It's bedtime. What do you sign?"
  },
  {
    word: "Hurt",
    videoUrl: "https://asl-lex.org/visualization/videos/hurt.mp4",
    scenario: "Your child scraped their knee. What do you sign?"
  },
  {
    word: "Yes",
    videoUrl: "https://asl-lex.org/visualization/videos/yes.mp4",
    scenario: "Do you want to play again? What do you sign?"
  },
  {
    word: "No",
    videoUrl: "https://asl-lex.org/visualization/videos/no.mp4",
    scenario: "Your child shouldn't touch that. What do you sign?"
  }
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

  const sanitizedWord = coreWords[current].word.toLowerCase().replace(/\s+/g, '_');


  return (
    <div style={{ padding: '1rem' }}>
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
              <button onClick={() => window.location.href = "/level1"} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>I'm Ready for Level 1</button>
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Sign: {coreWords[current].word}</h2>

              <iframe
                key={sanitizedWord}
                title={`ASL sign for ${coreWords[current].word}`}
                src={`https://asl-lex.org/visualization/?sign=${sanitizedWord}`}
                width="100%"
                height="400"
                style={{ border: 'none', borderRadius: '12px', margin: '1rem 0' }}
              />


              <p style={{ fontStyle: 'italic', color: '#555' }}>{coreWords[current].scenario}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={prev} disabled={current === 0} style={{ padding: '0.5rem 1rem' }}>Previous</button>
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