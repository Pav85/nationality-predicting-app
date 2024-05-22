import React, { useEffect, useState, useRef } from "react";
import "./App.css";
function App() {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const getNationality = async () => {
    try {
      const response = await fetch(
        `https://api.nationalize.io/?name=${name}&api_key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await response.json();
      if (data && data.country && data.country.length > 0) {
        setNationality(data.country[0]);
      } else {
        setNationality(null);
      }
    } catch (error) {
      console.log(error);
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
      />
      <button onClick={getNationality}>Predict Nationality</button>
      {nationality && (
        <div>
          <h2>Result:</h2>
          <p>Nationality: {nationality.country_id}</p>
          <p>Probability: {(nationality.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
