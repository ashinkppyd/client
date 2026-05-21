import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  { icon: "🍽️", title: "Smart Event Management", desc: "Create, schedule, and manage events effortlessly with our intuitive drag-and-drop builder." },
  { icon: "💳", title: "Ticketing & Payments", desc: "Handle invoices and payments online with flexible pricing tiers and instant payouts." },
  { icon: "👥", title: "Attendee Management", desc: "Track registrations, check-ins, and engagement metrics in real time." },
  { icon: "📊", title: "Advanced Analytics", desc: "Gain deep insights with beautiful dashboards, reports, and revenue tracking." },
  { icon: "🔐", title: "Role-Based Access", desc: "Control who sees what with fine-grained access control across your organization." },
  { icon: "🔔", title: "Instant Notifications", desc: "Automated emails, SMS, and push notifications keep your team informed." },
];

const events = [
  { label: "Corporate", color: "linear-gradient(135deg,#41C187,#2da96e)", title: "Annual Gala Dinner", date: "Jun 14, 2025", attendees: "320" },
  { label: "Wedding",   color: "linear-gradient(135deg,#6BD0CC,#3aafab)", title: "Garden Wedding",    date: "Jul 5, 2025",  attendees: "180" },
  { label: "Birthday",  color: "linear-gradient(135deg,#98E5C3,#41C187)", title: "Grand Birthday Bash", date: "Jul 20, 2025", attendees: "95"  },
  { label: "Business",  color: "linear-gradient(135deg,#2da96e,#1a7a4e)", title: "Product Launch Event", date: "Aug 3, 2025",  attendees: "450" },
];

const testimonials = [
  { name: "Ananya Menon", role: "Event Director, TechCorp", initials: "AM", text: "Servio transformed how we manage our annual conferences. The analytics alone saved us 40 hours of reporting work." },
  { name: "Rahul Krishnan", role: "CEO, EventPro Agency", initials: "RK", text: "The multi-tenant architecture is exactly what our agency needed. Managing 20+ client organizations from one dashboard is a game changer." },
  { name: "Priya Sharma", role: "Head of Events, Innovate Hub", initials: "PS", text: "From ticket sales to post-event reports, everything just works. Best investment we've made for our community events." },
];

export default function Home() {
  return (
    <div className="home-page-wrapper">
      {/* Background blobs */}
      <div className="blob-tr" />
      <div className="blob-bl" />

      {/* Floating food emojis */}
      <span className="floating-element fe1">🥂</span>
      <span className="floating-element fe2">🍰</span>
      <span className="floating-element fe3">🍷</span>
      <span className="floating-element fe4">🍴</span>
      <span className="floating-element fe5">🫖</span>
      <span className="floating-element fe6">🥗</span>

      {/* ─── HERO ─── */}
      <div className="home-container">
        <div className="hero-badge-pill">
          <span className="pill-icon">✦</span>
          Elite Event Planning &amp; Catering Platform
        </div>

        <h1 className="hero-headline">
          Exquisite Catering &amp;<br />
          <span className="gradient-text">Events at Scale</span>
        </h1>

        <p className="hero-subtext">
          From grand corporate galas to intimate garden weddings — premium catering,
          seamless logistics, and full event management to make every moment unforgettable.
        </p>

        <div className="hero-cta-group">
          <Link to="/sites" className="btn-hero-primary">Book an Event →</Link>
          <Link to="/ai-service" className="btn-hero-secondary">✦ Try AI Service</Link>
        </div>

        <div className="hero-trust">
          <span className="trust-item"><span className="trust-check">✓</span> No hidden fees</span>
          <span className="trust-item"><span className="trust-check">✓</span> 12+ years of excellence</span>
          <span className="trust-item"><span className="trust-check">✓</span> 500+ events delivered</span>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Events Done</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">12+</span>
            <span className="stat-label">Years Active</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Expert Staff</span>
          </div>
        </div>

        {/* Glass preview card */}
        <div className="hero-preview-wrapper">
          <div className="hero-preview-card">
            <div className="preview-top-bar">
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-url-bar">servio.app / events</div>
            </div>
            <div className="chef-scene">
              <div className="scene-exp-card">
                <div className="exp-number">12+</div>
                <div className="exp-label">Years of Excellence</div>
              </div>
              <div className="scene-stats-card">
                <div className="stats-card-title">This Month</div>
                <div className="stats-card-number">24</div>
                <div className="stats-card-sub">Events Booked 🎉</div>
              </div>
              <div className="scene-service-cards">
                <div className="scene-card">
                  <span className="scene-card-icon">🍽️</span>
                  <div>
                    <span className="scene-card-name">Gourmet Catering</span>
                    <span className="scene-card-tag">Custom Menus</span>
                  </div>
                </div>
                <div className="scene-card">
                  <span className="scene-card-icon">🎪</span>
                  <div>
                    <span className="scene-card-name">Event Logistics</span>
                    <span className="scene-card-tag">Full Management</span>
                  </div>
                </div>
                <div className="scene-card">
                  <span className="scene-card-icon">🤖</span>
                  <div>
                    <span className="scene-card-name">AI Scheduling</span>
                    <span className="scene-card-tag">Smart Assign</span>
                  </div>
                </div>
              </div>
              <img
                src="https://res.cloudinary.com/dydjaedxg/image/upload/v1776403583/Gemini_Generated_Image_w8adb6w8adb6w8ad_itop6s.png"
                alt="Professional Chef"
                className="chef-hero-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section className="section features-section">
        <div className="section-inner">
          <div className="section-label">FEATURES</div>
          <h2 className="section-title">Everything you need to run great events</h2>
          <p className="section-sub">A complete suite of tools designed for modern event teams, from solo organizers to enterprise operations.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="stats-banner">
        <div className="stats-banner-inner">
          {[
            { num: "500+", lbl: "Events Hosted" },
            { num: "10K+", lbl: "Guests Served" },
            { num: "50+",  lbl: "Expert Staff"  },
            { num: "98%",  lbl: "Satisfaction"  },
          ].map((s, i) => (
            <div className="banner-stat" key={i}>
              <span className="banner-stat-num">{s.num}</span>
              <span className="banner-stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED EVENTS ─── */}
      <section className="section events-section">
        <div className="section-inner">
          <div className="section-label">EVENTS</div>
          <h2 className="section-title">Featured Events</h2>
          <p className="section-sub">Discover what's happening on Servio right now.</p>
          <div className="events-grid">
            {events.map((e, i) => (
              <div className="event-card" key={i}>
                <div className="event-thumb" style={{ background: e.color }}>
                  <span className="event-label-pill">{e.label}</span>
                </div>
                <div className="event-card-body">
                  <h4 className="event-card-title">{e.title}</h4>
                  <div className="event-card-meta">
                    <span>📅 {e.date}</span>
                    <span>👥 {e.attendees} guests</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ─── TESTIMONIALS ─── */}
      <section className="section testimonials-section">
        <div className="section-inner">
          <div className="section-label">TESTIMONIALS</div>
          <h2 className="section-title">Loved by event teams</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="t-stars">★★★★★</div>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">
                  <div className="t-avatar">{t.initials}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <h2 className="cta-title">Ready to plan your next unforgettable event?</h2>
          <p className="cta-sub">Join 500+ organizations already using Servio to create memorable experiences.</p>
          <div className="cta-btns">
            <Link to="/company-register" className="btn-hero-primary">Create Free Account →</Link>
            <Link to="/login" className="btn-hero-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🍽️</span>
              <span className="footer-logo-text">SER<span>VIO</span></span>
            </div>
            <p className="footer-tagline">The modern platform for elite catering &amp; event management at enterprise scale.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <Link to="/sites">Events</Link>
              <Link to="/ai-service">AI Service</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/bookings">Bookings</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Servio. All rights reserved.</span>
          <span>Built with 💚 for event teams worldwide</span>
        </div>
      </footer>

    </div>
  );
}