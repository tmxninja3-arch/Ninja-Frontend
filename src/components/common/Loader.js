import { Spinner } from 'react-bootstrap';

const Loader = ({ size = 'large' }) => {
  const spinnerSize = size === 'large' ? '' : 'spinner-border-sm';

  return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status" className={spinnerSize}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader;