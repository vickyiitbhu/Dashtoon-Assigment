import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Carousel from 'react-bootstrap';


function App() {
  const [myData, setMyData] = useState(Array(10).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [imagesWithText, setImagesWithText] = useState([]);
  const [showimages, setShowImages] = useState(false);
  console.log(imagesWithText)

  async function query(data) {
    console.log("3")
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: { 
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    console.log("2")
    const result = await response.blob();
    console.log(result);
    return result;
  }

  const handleInputChange = (index, value) => {
    const newData = [...myData];
    newData[index] = value;
    setMyData(newData);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex < 9 ? prevIndex + 1 : prevIndex));
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNext1 = () => {
    setActiveIndex1((prevIndex1) => (prevIndex1 < 9 ? prevIndex1 + 1 : prevIndex1));
  };
  const handlePrev1 = () => {
    setActiveIndex1((prevIndex1) => (prevIndex1 > 0 ? prevIndex1 - 1 : prevIndex1));
  };


  const handleGenerateImages = () => {
    setShowImages(true);
    console.log("clicked")
    const generatedImages = [];

    for (let i = 0; i < 10; i++) {
      const text=myData[i] || "generate random image";
      query({"inputs": text}).then((response) => {
        // Use image
        console.log("1")
        const imageUrl = URL.createObjectURL(response);
        console.log(imageUrl);
        generatedImages.push({ image: imageUrl , text });
      });
    }
    setImagesWithText(generatedImages);
  };

  return (
    <div className="App">
      <h1>Hello, World!</h1>
      <p>Please give your 10 lines.</p>
      <div className="slides">
        <div id="inputCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {myData.map((value, index) => (
              <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Enter text for line ${index + 1}`}
                  style={{ width: '300px', padding: '10px' }}
                />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" onClick={handlePrev}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" onClick={handleNext}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
          <button className="btn btn-primary" onClick={handleGenerateImages}>
            Generate Images
          </button>
        </div>
      </div>
      {showimages ? (
        <div className="slides">
          <div id="outputCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {imagesWithText.map((item, index) => (
                <div key={index} className={`carousel-item ${index === activeIndex1 ? 'active' : ''}`}>
                  <h3>{item.text}</h3>
                  <img className="d-block w-100" src={item.image} alt={`Slide ${index}`} />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" onClick={handlePrev1}>
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" onClick={handleNext1}>
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      ) : null}

      <p>Array content: {JSON.stringify(myData)}</p>
    </div>
  );
}

export default App;