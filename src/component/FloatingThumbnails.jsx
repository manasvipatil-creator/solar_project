// src/component/FloatingThumbnails.jsx
import React from "react";

const FloatingThumbnails = ({ slides, index, setIndex }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: "20px",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        zIndex: 1050, // ✅ always on top
      }}
    >
      {slides.map((slide, idx) => (
        <img
          key={idx}
          src={slide.img}
          alt={`Thumb ${idx + 1}`}
          onClick={() => setIndex(idx)} // ✅ Click → go to slide
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            cursor: "pointer",
            border: index === idx ? "3px solid #000" : "2px solid white",
            objectFit: "cover",
            transition: "0.3s",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingThumbnails;
