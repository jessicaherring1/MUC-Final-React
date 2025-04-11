import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './Level1.css';

const DragItem = ({ word, index, moveWord, onRemove }) => {
  const [, ref] = useDrag({
    type: 'SENTENCE_WORD',
    item: { index }
  });

  const [, drop] = useDrop({
    accept: 'SENTENCE_WORD',
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
      title="Click to remove from sentence"
    >
      {word}
    </div>
  );
};

const Level1 = ({ sentence, options, correctOrder, onCheckResult }) => {
  // Initialize bankWords with shuffled options and sentenceWords empty.
  const [bankWords, setBankWords] = useState(shuffle([...options]));
  const [sentenceWords, setSentenceWords] = useState([]);
  const [hintCount, setHintCount] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  // For reordering words in the sentence slot.
  const moveWord = (from, to) => {
    const updated = update(sentenceWords, {
      $splice: [
        [from, 1],
        [to, 0, sentenceWords[from]]
      ]
    });
    setSentenceWords(updated);
  };

  // When a word is clicked in the bank, add it to the sentence slot.
  const handleAddWord = (word) => {
    setSentenceWords([...sentenceWords, word]);
    setBankWords(bankWords.filter(w => w !== word));
  };

  // When a word in the sentence slot is clicked, remove it back to the bank.
  const handleRemoveWord = (index) => {
    const wordToRemove = sentenceWords[index];
    setSentenceWords(sentenceWords.filter((_, i) => i !== index));
    setBankWords([...bankWords, wordToRemove]);
  };

  // Check the constructed sentence against the correct answer.
  const checkAnswer = () => {
    let correct = 0;
    for (let i = 0; i < correctOrder.length; i++) {
      if (sentenceWords[i] === correctOrder[i]) correct++;
    }
    setHintCount(correct);

    if (onCheckResult) {
      // Only consider it correct if the lengths match and every word is in the correct slot.
      const isCorrect = (sentenceWords.length === correctOrder.length && correct === correctOrder.length);
      onCheckResult(isCorrect);
    }
  };

  // Reveal the correct answer.
  const giveUp = () => {
    setRevealedAnswer(true);
    setSentenceWords(correctOrder);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="level-1">
        <h2>Level 1: Build the ASL Sentence</h2>
        <p><strong>English Sentence:</strong> {sentence}</p>

        {/* Sentence Slot */}
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
              />
            ))
          )}
        </div>

        {/* Word Bank */}
        <div className="word-bank">
          <h3>Word Bank</h3>
          <div className="bank-container">
            {bankWords.length === 0 ? (
              <div>No more words</div>
            ) : (
              bankWords.map((word, i) => (
                <div 
                  key={i} 
                  className="bank-word" 
                  onClick={() => handleAddWord(word)}
                  title="Click to add to sentence"
                >
                  {word}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button onClick={checkAnswer}>Check</button>
          <button onClick={giveUp}>Give Up</button>
        </div>

        {/* Hints */}
        {hintCount !== null && !revealedAnswer && (
          <p>{hintCount} word(s) are in the correct position.</p>
        )}
        {revealedAnswer && (
          <p>The correct order is: {correctOrder.join(' ')}</p>
        )}
      </div>
    </DndProvider>
  );
};

// Helper function to shuffle the word options.
function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default Level1;
