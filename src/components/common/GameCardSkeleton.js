import { Card, Placeholder } from 'react-bootstrap';

const GameCardSkeleton = () => {
  return (
    <Card className="h-100">
      <Placeholder animation="glow">
        <div
          style={{
            height: '250px',
            backgroundColor: '#e9ecef',
          }}
        />
      </Placeholder>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={12} />
          <Placeholder xs={12} />
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button variant="primary" xs={6} />
      </Card.Body>
    </Card>
  );
};

export default GameCardSkeleton;