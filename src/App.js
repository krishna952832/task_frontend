import React, { useState } from "react";
import axios from "axios";
import './App.css';  // Make sure this is imported

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [fileB64, setFileB64] = useState(""); // For Base64 string input
  const [selectedFile, setSelectedFile] = useState(null); // For image file input
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Handle file input
  };

  const handleB64Change = (e) => {
    setFileB64(e.target.value); // Handle Base64 string input
  };

  const handleSubmit = async () => {
    try {
      // Validate and parse the JSON input
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
        if (!Array.isArray(parsedData.data)) {
          setError("Input data must be an array.");
          return;
        }
      } catch (error) {
        setError("Invalid JSON format.");
        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(parsedData.data));  // Send the array as a JSON string
      formData.append("file_b64", fileB64);  // Send Base64 string if present
      if (selectedFile) {
        formData.append("image", selectedFile); // Append the image file if provided
      }

      // Send the request to the backend
      const res = await axios.post("https://task-backend-e3wq.onrender.com/bfhl", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Set the response data
      setResponse(res.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Invalid input or server error");
      setResponse(null);
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet, file_path, file_size_kb } = response;

    const output = [];
    if (selectedOptions.includes("Numbers")) {
      output.push(`Numbers: ${numbers.join(", ")}`);
    }
    if (selectedOptions.includes("Alphabets")) {
      output.push(`Alphabets: ${alphabets.join(", ")}`);
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      output.push(`Highest Lowercase Alphabet: ${highest_lowercase_alphabet.join(", ")}`);
    }

    return (
      <div>
        <h3>Filtered Response:</h3>
        {output.map((item, idx) => (
          <p key={idx}>{item}</p>
        ))}
        {file_path && (
          <div>
            <h4>Image Details:</h4>
            <p>Image Path: {file_path}</p>
            <p>File Size: {file_size_kb} KB</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>BFHL Frontend</h1>

      <div>
        <textarea
          placeholder="Enter JSON"
          value={jsonInput}
          onChange={handleJsonChange}
        />
      </div>



      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <h3>Server Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>

          <div>
            <h3>Filter Options:</h3>
            <select
              multiple
              value={selectedOptions}
              onChange={(e) =>
                setSelectedOptions(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              <option>Numbers</option>
              <option>Alphabets</option>
              <option>Highest Lowercase Alphabet</option>
            </select>
          </div>

          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
