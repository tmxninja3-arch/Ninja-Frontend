import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaGamepad, 
  FaHome, 
  FaInfoCircle, 
  FaGithub, 
  FaEnvelope, 
  FaPhone,
  FaHeart,
  FaCode
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cyber-footer">
      {/* Animated Top Border */}
      <div className="footer-border-animation"></div>

      <Container className="footer-content">
        {/* Main Footer Content */}
        <Row className="footer-main">
          {/* Brand Section */}
          <Col md={4} className="mb-4">
            <div className="footer-brand">
              <div className="brand-icon-wrapper">
                <FaGamepad className="brand-icon-footer" />
              </div>
              <h5 className="brand-title-footer">
                <span className="brand-highlight">NINJA's</span> Store
              </h5>
              <p className="brand-description">
                Your one-stop destination for the best digital games. 
                Experience gaming like never before.
              </p>
              <div className="tech-badge">
                <FaCode className="me-2" />
                <span>Built with MERN Stack</span>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="footer-heading">
              <span className="heading-line"></span>
              Quick Links
            </h5>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  <span className="link-icon">
                    <FaHome />
                  </span>
                  <span className="link-text">Home</span>
                  <span className="link-arrow">→</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  <span className="link-icon">
                    <FaInfoCircle />
                  </span>
                  <span className="link-text">About Us</span>
                  <span className="link-arrow">→</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/tmxninja3-arch"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="link-icon">
                    <FaGithub />
                  </span>
                  <span className="link-text">GitHub</span>
                  <span className="link-arrow">↗</span>
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Section */}
          <Col md={4} className="mb-4">
            <h5 className="footer-heading">
              <span className="heading-line"></span>
              Contact Us
            </h5>
            <ul className="footer-contact">
              <li>
                <a
                  href="mailto:pram33045@gmail.com"
                  className="contact-link"
                >
                  <span className="contact-icon">
                    <FaEnvelope />
                  </span>
                  <span className="contact-text">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">pram33045@gmail.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+917418020722"
                  className="contact-link"
                >
                  <span className="contact-icon">
                    <FaPhone />
                  </span>
                  <span className="contact-text">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">+91 7418020722</span>
                  </span>
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Divider */}
        <div className="footer-divider">
          <div className="divider-line"></div>
          <div className="divider-glow"></div>
        </div>

        {/* Bottom Bar */}
        <Row className="footer-bottom">
          <Col className="text-center">
            <p className="copyright">
              <span className="copyright-symbol">©</span> {currentYear}{" "}
              <span className="copyright-brand">NINJA's Store</span>
              <span className="copyright-separator">|</span>
              All rights reserved
              <span className="copyright-separator">|</span>
              Made with <FaHeart className="heart-icon" /> by NINJA
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;