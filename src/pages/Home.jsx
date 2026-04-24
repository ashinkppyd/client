import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page-wrapper">
      <div className="home-container">
        <section className="hero">
          {/* Left Side: Content */}
          <div className="hero-content">
            <span className="badge">ELITE EVENT PLANNING</span>
            <h1 className="hero-title">
              EXQUISITE <br /> 
              CATERING & <br /> 
              <span>EVENTS</span>
            </h1>
            <p className="hero-description">
              From grand corporate galas to intimate garden weddings, we provide 
              premium catering and seamless management to make your moments unforgettable.
            </p>
            
            <div className="cta-group">
              <Link to="/sites" className="btn-primary">BOOK AN EVENT</Link>
              <div className="experience-badge">
                <strong>12+ Years</strong>
                <small>of Excellence</small>
              </div>
            </div>

            {/* Bottom Service Cards */}
            <div className="mini-cards">
              <div className="mini-card">
                <span className="card-icon">🍽️</span>
                <div>
                  <p className="card-name">Gourmet Catering</p>
                  <p className="card-tag">Custom Menus</p>
                </div>
              </div>
              <div className="mini-card highlight">
                <span className="card-icon">🎪</span>
                <div>
                  <p className="card-name">Event Logistics</p>
                  <p className="card-tag">Full Management</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Large Image */}
          <div className="hero-image-container">
            <div className="floating-elements">
              <span className="element e1">🥂</span>
              <span className="element e2">🍰</span>
              <span className="element e3">🍷</span>
              <span className="element e4">🍴</span>
            </div>
            
            <img 
              src="https://res.cloudinary.com/dydjaedxg/image/upload/v1776403583/Gemini_Generated_Image_w8adb6w8adb6w8ad_itop6s.png" 
              alt="Professional Chef" 
              className="main-chef-img" 
            />
            
            {/* <div className="nav-arrows">
              <button className="arrow-btn">←</button>
              <button className="arrow-btn active">→</button>
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );
}