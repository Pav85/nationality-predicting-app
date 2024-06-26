import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";

function App() {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictedName, setPredictedName] = useState("");
  const inputRef = useRef(null);

  // useEffect hook to focus the input field when the component mounts
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // function to get the country name from country code using the REST Countries API
  const getCountryName = async (countryCode) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].name.common;
      } else {
        throw new Error("Country not found");
      }
    } catch (error) {
      console.error("Error fetching country name:", error);
      return null;
    }
  };

  // function to get the nationality of a name using the nationalize.io API
  const getNationality = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.nationalize.io/?name=${name}`);
      const data = await response.json();
      if (data && data.country && data.country.length > 0) {
        const country = data.country[0];
        const countryName = await getCountryName(country.country_id);
        if (countryName) {
          setNationality({ ...country, country_name: countryName });
          setPredictedName(name);
          setName("");
        } else {
          setError("Error fetching country name.");
        }
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

  // function to handle the enter key press to trigger the getNationality function
  const pressEnter = (event) => {
    if (event.keyCode === 13) {
      getNationality();
    }
  };

  // function to capitalise the first letter of a string
  const capitaliseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center mb-3">Where Does Your Name Come From?</h1>
          <Form>
            <Form.Group controlId="formName">
              <Form.Control
                ref={inputRef} // focus the input field when the component mounts
                type="text"
                placeholder="Enter name or surname"
                value={name}
                onChange={(e) => setName(e.target.value)} // update the name state when the input value changes
                onKeyDown={pressEnter} // handle the enter key press to trigger the getNationality function
                disabled={loading} // disable the button when the loading state is true
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={getNationality}
              disabled={loading}
              className="mt-3 w-100 text-center"
            >
              {loading ? "Predicting..." : "Predict Nationality"}
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3 text-center">
              {error}
            </Alert>
          )}
          {nationality && (
            <Card className="mt-3">
              <Card.Body>
                <Card.Title className="text-center">
                  Result for {capitaliseFirstLetter(predictedName)}:
                </Card.Title>
                <hr />
                <Card.Text className="text-center">
                  <strong>Nationality:</strong> {nationality.country_name}
                </Card.Text>
                <Card.Text className="text-center">
                  <strong>Probability:</strong>{" "}
                  {(nationality.probability * 100).toFixed(2)}%
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
