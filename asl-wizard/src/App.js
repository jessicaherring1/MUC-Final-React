import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";

const levels = [
  {
    type: "drag-and-drop",
    sentence: "Will you be my friend?",
    words: ["will", "friend", "you", "future", "my", "be"],
    correctAnswer: ["you", "future", "friend"]
  },
  {
    type: "sign-only",
    sentence: "Will you be my friend?",
    hintWords: ["you", "future", "friend"]
  },
  {
    type: "sign-and-type",
    sentence: "How’s the weather today?"
  },
  {
    type: "complete"
  }
];

const App = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [dragAnswer, setDragAnswer] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(null); // 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false);
  const [textEntryComplete, setTextEntryComplete] = useState(false);
  const [recordingOverlay, setRecordingOverlay] = useState(null); // 'play' | 'stop' | null

  const currentLevel = levels[levelIndex];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "1") setShowModal("correct");
      if (e.key === "2") setShowModal("wrong");
      if (e.key === "n") handleNextLevel();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleNextLevel = () => {
    setShowModal(null);
    setDragAnswer([]);
    setInput("");
    setShowHint(false);
    setIsRecording(false);
    setTextEntryComplete(false);
    setLevelIndex((prev) => Math.min(prev + 1, levels.length - 1));
  };

  const handlePreviousLevel = () => {
    setShowModal(null);
    setDragAnswer([]);
    setInput("");
    setShowHint(false);
    setIsRecording(false);
    setTextEntryComplete(false);
    setLevelIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleWord = (word) => {
    setDragAnswer((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingOverlay("play");
    setTimeout(() => setRecordingOverlay(null), 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingOverlay("stop");
    setTimeout(() => setRecordingOverlay(null), 1000);
  };

  const recordingOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "6rem",
    color: "#fff",
    zIndex: 2,
    pointerEvents: "none"
  };

  const renderCamera = () => (
    <div 
      style={{ 
        position: "relative",
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#ccc", 
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {recordingOverlay && (
        <div style={recordingOverlayStyle}>
          {recordingOverlay === "play" ? "▶" : "⏹"}
        </div>
      )}
      {isRecording ? (
        <Webcam
          audio={false}
          mirrored={true}
          screenshotFormat="image/jpeg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{ color: "#666", fontSize: "1.2rem" }}>Camera Off</div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      {currentLevel.type === "drag-and-drop" && (
        <>
          <p style={{ marginTop: "1rem" }}><strong>Translate this sentence:</strong><br />{currentLevel.sentence}</p>
          <div style={{ minHeight: "4rem", border: "1px dashed #ccc", margin: "1rem 0", padding: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {dragAnswer.map((word, i) => (
              <button
                key={i}
                onClick={() => toggleWord(word)}
                style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f3f3f3", borderRadius: "999px" }}
              >
                {word} ✕
              </button>
            ))}
          </div>

          <button onClick={() => setShowHint(!showHint)} style={{ marginBottom: "1rem" }}>
            Need a hint?
          </button>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {currentLevel.words.map((word, i) => (
              <button
                key={i}
                onClick={() => toggleWord(word)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "999px",
                  backgroundColor: showHint && currentLevel.correctAnswer.includes(word) ? "#bbb" : "#eee",
                  border: dragAnswer.includes(word) ? "2px solid #444" : "none"
                }}
              >
                {word}
              </button>
            ))}
          </div>

          <button style={{ width: "100%", padding: "0.75rem" }}>Check</button>
          {levelIndex > 0 && (
            <button onClick={handlePreviousLevel} style={{ marginTop: "0.5rem", width: "100%" }}>
              ◀ Back to Previous Level
            </button>
          )}
        </>
      )}

      {currentLevel.type === "sign-only" && (
        <>
          <p><strong>Sign this sentence:</strong><br />{currentLevel.sentence}</p>
          {renderCamera()}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
              {isRecording ? "⏹ Stop Recording" : "▶ Start Recording"}
            </button>
            <button onClick={() => setShowHint(!showHint)}>Need a hint?</button>
          </div>

          {showHint && currentLevel.hintWords && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#444" }}>Hint: Use signs for these words:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {currentLevel.hintWords.map((word, i) => (
                  <span key={i} style={{ backgroundColor: "#ddd", borderRadius: "999px", padding: "0.3rem 0.8rem" }}>{word}</span>
                ))}
              </div>
            </div>
          )}

          <button style={{ width: "100%", padding: "0.75rem", marginTop: "1rem" }}>Check</button>
        </>
      )}

      {currentLevel.type === "sign-and-type" && (
        <>
          <p><strong>Respond to this sentence:</strong><br />{currentLevel.sentence}</p>

          <input
            type="text"
            placeholder="Type your answer here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <button onClick={() => setTextEntryComplete(true)} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}>Check</button>

          <div style={{ opacity: textEntryComplete ? 1 : 0.5, pointerEvents: textEntryComplete ? 'auto' : 'none' }}>
            <p>Now sign it:</p>
            {renderCamera()}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
                {isRecording ? "⏹ Stop Recording" : "▶ Start Recording"}
              </button>
            </div>

            <button style={{ width: "100%", padding: "0.75rem", marginTop: "1rem" }}>Check</button>
          </div>
        </>
      )}

      {currentLevel.type === "complete" && (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎉 Levels Complete!</h1>
          <p style={{ fontSize: "1rem", color: "#666" }}>Thank you for participating</p>
        </div>
      )}

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem" }}>{showModal === "correct" ? "✔️" : "❌"}</div>
            <p>{showModal === "correct" ? "That’s Correct!" : "Not quite..."}</p>
            <button onClick={showModal === "correct" ? handleNextLevel : () => setShowModal(null)}>
              {showModal === "correct" ? "Next" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;