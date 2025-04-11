
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";

const levels = [
  {
    type: "drag-and-drop",
    sentence: "Mom is going to work.",
    words: ["work", "Mom", "is", "future", "go", "going"],
    correctAnswer: ["go", "Mom", "work"]
  },
  {
    type: "sign-only",
    sentence: "You have school tomorrow",
    hintWords: ["tomorrow", "school", "you"]
  },
  {
    type: "sign-and-type",
    sentence: "What is the baby doing in the image above?"
  },
  {
    type: "complete"
  }
];

const Level3 = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [dragAnswer, setDragAnswer] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [textEntryComplete, setTextEntryComplete] = useState(false);
  const [recordingOverlay, setRecordingOverlay] = useState(null);

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
      {/* UI rendering based on currentLevel.type remains same as before */}
      {/* You can copy the full JSX if needed from the previous message */}
      {/* This is to fit within code block limits here */}
    </div>
  );
};

export default Level3;
