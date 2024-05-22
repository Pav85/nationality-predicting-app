import React, { useEffect, useState, useRef } from "react";
import "./App.css";
function App() {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState(null);
  const inputRef = useRef(null);

  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
