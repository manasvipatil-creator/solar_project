// src/component/HomeCarousel.jsx
import React from "react";
import { Carousel, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const slides = [
  {
    img: "https://w0.peakpx.com/wallpaper/667/704/HD-wallpaper-black-solar-panel-under-red-and-gray-clouds.jpg",
    height: "80vh",
    backgroundsize: "cover",
    heading: "Powering Your Future with Clean Energy",
    text: "Join the solar revolution and save money while protecting our planet.",
    btn: "Read More",
  },
  {
    img: "https://wallpapers.com/images/hd/solar-panel-with-kids-silhouette-during-sunset-v018wg77uxsm3hsb.jpg",
    backgroundsize: "cover",
    height: "80vh",
    heading: "Your Sun. Your Power. Your Savings.",
    text: "We bring sustainable energy solutions right to your home.",
    btn: "Get Started",
 
  },
  {
    img: "https://img.freepik.com/free-photo/sunset-nature-provides-renewable-energy-through-solar-power-generated-by-ai_188544-26135.jpg",
    backgroundsize: "cover",
     height: "80vh",
    heading: "Bright Energy for a Greener Tomorrow",
    text: "Harness the sun’s power and reduce your carbon footprint today.",
    btn: "Learn More",
  },
];

const HomeCarousel = ({ index, setIndex }) => {
  return (
    <Carousel
      activeIndex={index}
      onSelect={(selectedIndex) => setIndex(selectedIndex)}
      fade
      controls={false}
      indicators={false}
      interval={3000}
    >
      {slides.map((slide, idx) => (
        <Carousel.Item key={idx}>
          <img
            className="d-block w-100"
            src={slide.img}
            alt={`Slide ${idx + 1}`}
            style={{ height: "100vh", objectFit: "cover" }}
          />

          <Carousel.Caption
            className="d-flex flex-column justify-content-center align-items-start text-start"
            style={{
              top: "30%",
              transform: "translateY(-30%)",
              left: "10%",
              right: "auto",
              maxWidth: "600px",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="fw-bold display-4 text-white"
            >
              {slide.heading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-3 fs-5 text-white"
            >
              {slide.text}
            </motion.p>
           <Button
  size="lg"
  className="mt-4 px-4 py-2"
  style={{
    borderRadius: "25px",
    backgroundColor: "#fff",
    color: "#dc3545",
    border: "3px solid #dc3545",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#fff";
    e.target.style.color = "#dc3545";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "#dc3545";
    e.target.style.color = "#fff";
   
  }}
>
  {slide.btn}
</Button>

          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export { slides }; // ✅ Export slides for thumbnails
export default HomeCarousel;
