// src/component/FloatingThumbnails.jsx
import React, { useState, useEffect } from "react";

const FloatingThumbnails = ({ slides, index, setIndex }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerStyle = {
    position: "fixed",
    top: "50%",
    right: isMobile ? "5px" : "15px",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "8px" : "12px",
    zIndex: 1050,
    maxWidth: "fit-content",
  };

  const imageStyle = {
    width: isMobile ? "35px" : "55px",
    height: isMobile ? "35px" : "55px",
    borderRadius: "50%",
    cursor: "pointer",
    objectFit: "cover",
    transition: "0.3s",
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      {slides.map((slide, idx) => (
        <img
          key={idx}
          src={slide.img}
          alt={`Thumb ${idx + 1}`}
          onClick={() => setIndex(idx)}
          style={{
            ...imageStyle,
            border: index === idx ? "3px solid #000" : "2px solid white",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingThumbnails;
