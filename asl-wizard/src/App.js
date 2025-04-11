// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Level0 from './levels/Level0';
import Level1 from './levels/Level1';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/level0" element={<Level0 />} />
        <Route
          path="/level1"
          element={
            <Level1
              sentence="Will you be my friend?"
              options={["will", "friend", "you", "future", "my", "be"]}
              correctOrder={["you", "future", "friend"]}
              onCheckResult={(isCorrect) => console.log(isCorrect)}
            />
          }
        />
        {/* Future routes for Level 2 and Level 3 */}
        {/* <Route path="/level2" element={<Level2 />} /> */}
        {/* <Route path="/level3" element={<Level3 />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
