import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="my-5">
      <h1 className="mb-4">About GameStore</h1>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h3>🎮 Our Mission</h3>
              <p className="lead">
                GameStore is your one-stop destination for digital games. We
                provide a seamless platform to browse, purchase, and download
                the latest games across all platforms.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>🚀</div>
              <h5>Fast Delivery</h5>
              <p className="text-muted">
                Instant access to your games after purchase
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>🔒</div>
              <h5>Secure Payments</h5>
              <p className="text-muted">
                Your transactions are safe and encrypted
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>💯</div>
              <h5>Quality Games</h5>
              <p className="text-muted">
                Curated collection of the best games
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <h3>📊 Built With</h3>
              <p>This project was built using the MERN stack:</p>
              <ul>
                <li><strong>MongoDB</strong> - Database</li>
                <li><strong>Express.js</strong> - Backend framework</li>
                <li><strong>React.js</strong> - Frontend library</li>
                <li><strong>Node.js</strong> - Runtime environment</li>
                <li><strong>Bootstrap</strong> - UI framework</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;