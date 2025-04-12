// Level3.js
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import update from "immutability-helper";

const initialWords = ["work", "Mom", "is", "future", "go", "going"];
const correctOrder = ["go", "Mom", "work"];

function Level3() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mediaRecorders, setMediaRecorders] = useState({});
  const [recordChunks, setRecordChunks] = useState({});
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [researcherComment, setResearcherComment] = useState("");
  const [isApproved, setIsApproved] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [visibleHints, setVisibleHints] = useState({});

  const [showAnswer, setShowAnswer] = useState(false);

  const webcamRef = useRef(null);
  const feedbackRef = useRef(null);

  const handleWordClick = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
      setRecordings([...recordings, { word, url: null }]);
    }
  };

  const startRecording = (index) => {
    const stream = webcamRef.current.stream;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const updated = [...recordings];
      updated[index].url = url;
      setRecordings(updated);
      setRecordingIndex(null);
    };

    recorder.start();
    setMediaRecorders((prev) => ({ ...prev, [index]: recorder }));
    setRecordChunks((prev) => ({ ...prev, [index]: chunks }));
    setRecordingIndex(index);
  };

  const stopRecording = (index) => {
    const recorder = mediaRecorders[index];
    if (recorder) recorder.stop();
  };

  const getHint = () => {
    let correctCount = 0;
    recordings.forEach((r, i) => {
      if (r.word === correctOrder[i]) correctCount++;
    });
    return correctCount;
  };
  
  const toggleHint = (index) => {
    setVisibleHints((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const aslVideos = {
    go: "https://asl-lex.org/visualization/videos/go.mp4",
    Mom: "https://asl-lex.org/visualization/videos/mom.mp4",
    work: "https://asl-lex.org/visualization/videos/work.mp4",
    is: "https://asl-lex.org/visualization/videos/is.mp4",
    future: "https://asl-lex.org/visualization/videos/future.mp4",
    going: "https://asl-lex.org/visualization/videos/going.mp4"
  };  

  const handleReorder = (fromIndex, toIndex) => {
    const updated = update(recordings, {
      $splice: [
        [fromIndex, 1],
        [toIndex, 0, recordings[fromIndex]]
      ]
    });
    setRecordings(updated);
    setSelectedWords(updated.map(r => r.word));
  };

  const checkAnswer = () => {
    const currentOrder = recordings.map(r => r.word);
    return JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
  };
  

  const handleRemove = (index) => {
    const updatedWords = [...selectedWords];
    const updatedRecordings = [...recordings];
    updatedWords.splice(index, 1);
    updatedRecordings.splice(index, 1);
    setSelectedWords(updatedWords);
    setRecordings(updatedRecordings);
  };

  const handleSubmit = () => {
    if (!checkAnswer()) {
      setIsApproved(false);
      setResearcherComment("The selected signs or their order is incorrect.");
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setShowModal(true);
    }
  };

  const handleApprove = () => {
    setIsApproved(true);
    setShowModal(false);
    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350); // More reliable scroll after modal closes
  };

  const handleReject = () => {
    setIsApproved(false);
    setShowModal(false);
    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Translate this sentence: <em>Mom is going to work.</em></h2>

      <div style={{ border: "1px dashed #aaa", padding: "1rem", marginBottom: "1rem" }}>
        {selectedWords.map((word, index) => (
          <span key={index} style={{ marginRight: "0.5rem" }}>{word}</span>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        {initialWords.map((word, i) => (
          <button key={i} onClick={() => handleWordClick(word)} style={{ margin: "0.25rem" }}>
            {word}
          </button>
        ))}
      </div>

      <button onClick={() => setShowHint(!showHint)} style={{ marginBottom: "1rem" }}>
        💡 {showHint ? "Hide Hint" : "Need a Hint?"}
      </button>

      {showHint && (
        <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#333" }}>
          ✅ {getHint()} word{getHint() !== 1 ? "s" : ""} in the correct position.
        </div>
      )}

      {!showAnswer && (
        <button
          onClick={() => setShowAnswer(true)}
          style={{ marginBottom: "1rem", background: "#eee", padding: "0.5rem", borderRadius: "6px" }}
        >
          🤷 Give Up & Show Correct Answer
        </button>
      )}

      {showAnswer && (
        <div style={{
          marginBottom: "1rem",
          background: "#f1f1f1",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px"
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>✅ Correct Sign Order:</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {correctOrder.map((word, i) => (
              <span
                key={i}
                style={{
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#d2f4d2",
                  borderRadius: "999px",
                  fontSize: "0.9rem"
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <Webcam
        audio={false}
        mirrored
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: "100%", marginBottom: "1rem", borderRadius: "12px" }}
        
      />

      {recordings.map((rec, index) => (
        <div key={index} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "8px" }}>
          <p><strong>{rec.word}</strong></p>
          {rec.url ? (
            <video src={rec.url} controls style={{ width: "100%" }} />
          ) : (
            <>
              {recordingIndex === index ? (
                <>
                  <span style={{ marginRight: "1rem", color: "red" }}>🔴 Recording...</span>
                  <button onClick={() => stopRecording(index)}>⏹ Stop</button>
                </>
              ) : (
                <button onClick={() => startRecording(index)}>▶ Record</button>
              )}
            </>
          )}
          <div style={{ marginTop: "0.5rem" }}>
            {index > 0 && <button onClick={() => handleReorder(index, index - 1)}>⬆ Move Up</button>}
            {index < recordings.length - 1 && <button onClick={() => handleReorder(index, index + 1)}>⬇ Move Down</button>}
            <button onClick={() => handleRemove(index)} style={{ marginLeft: "0.5rem", color: "red" }}>❌ Remove</button>
          </div>
        </div>
      ))}

      {recordings.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <button onClick={handleSubmit} style={{ padding: "0.75rem", width: "100%" }}>
            ✅ Submit to Researcher
          </button>
        </div>
      )}

      {isApproved === true && (
        <div
          ref={feedbackRef}
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            textAlign: "center",
            backgroundColor: "#e6f4ea",
            color: "#2e7d32",
            borderRadius: "6px",
            fontSize: "0.9rem"
          }}
        >
          ✅ Approved! Thank you for submitting your signs.
        </div>
      )}

      {isApproved === false && (
        <div
          ref={feedbackRef}
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            textAlign: "center",
            backgroundColor: "#fdecea",
            color: "#c62828",
            borderRadius: "6px",
            fontSize: "0.9rem"
          }}
        >
          ❌ Rejected. Please revise your signs.
          {researcherComment && (
            <div style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
              “{researcherComment}”
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "1rem",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3>👩‍🏫 Researcher Review</h3>
            {recordings.map((rec, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <p><strong>Sign {index + 1}: {rec.word}</strong></p>

                <button
                  onClick={() => toggleHint(index)}
                  style={{ marginBottom: "0.5rem", fontSize: "0.8rem" }}
                >
                  🧠 Hint
                </button>

                {visibleHints[index] && aslVideos[rec.word] && (
                  <video
                    src={aslVideos[rec.word]}
                    autoPlay
                    muted
                    loop
                    style={{ width: "100%", maxHeight: "160px", borderRadius: "6px", marginTop: "0.5rem" }}
                  />
                )}

                <video
                  src={rec.url}
                  controls
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            ))}
            <textarea
              rows={3}
              placeholder="Comment (optional)..."
              value={researcherComment}
              onChange={(e) => setResearcherComment(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
            />
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleReject} style={{ backgroundColor: "#f44336", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px" }}>❌ Reject</button>
              <button onClick={handleApprove} style={{ backgroundColor: "#4caf50", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px" }}>✅ Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Level3;
