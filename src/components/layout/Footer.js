import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>🎮 GameStore</h5>
            <p>Your one-stop destination for the best digital games.</p>
          </Col>
          <Col md={4} className="mb-3 ">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className=" text-info text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className=" text-info text-decoration-none">
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/tmxninja3-arch"
                  className=" text-info text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contact</h5>

            <a
              href="mailto:pram33045@gmail.com"
              className="text-decoration-none text-light d-block"
            >
              Email: pram33045@gmail.com
            </a>

            <a
              href="tel:+917418020722"
              className="text-decoration-none text-light d-block"
            >
              Phone: +91 7418020722
            </a>
          </Col>
        </Row>
        <hr className="bg-secondary" />
        <Row>
          <Col className="text-center">
            <p className="mb-0 ">
              &copy; {new Date().getFullYear()} GameStore. All rights reserved.
              Built with ❤️ using MERN Stack.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
