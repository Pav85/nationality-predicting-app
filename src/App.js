import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictedName, setPredictedName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const getNationality = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.nationalize.io/?name=${name}`);
      const data = await response.json();
      if (data && data.country && data.country.length > 0) {
        setNationality(data.country[0]);
        setPredictedName(name);
        setName("");
      } else {
        setNationality(null);
        setError("No nationality data found.");
      }
    } catch (error) {
      console.error("Error fetching nationality:", error);
      setError("Error fetching nationality.");
    }
    setLoading(false);
  };

  const pressEnter = (event) => {
    if (event.keyCode === 13) {
      getNationality();
    }
  };

  return (
    <div className="App">
      <h1>Let's predict nationality</h1>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter name or surname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={pressEnter}
        disabled={loading}
      />
      <button onClick={getNationality} disabled={loading}>
        {loading ? "Predicting..." : "Predict Nationality"}
      </button>
      {error && <div className="error">{error}</div>}
      {nationality && (
        <div>
          <h2>Result for {predictedName}:</h2>
          <p>Nationality: {nationality.country_id}</p>
          <p>Probability: {(nationality.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
