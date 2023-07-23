import { Button } from "react-bootstrap";
import { FaPenSquare } from "react-icons/fa";

const EditButton = ({ onClick, as = null, to }) => {
  return (
    <Button as={as} to={to} variant="primary" onClick={onClick}>
      <FaPenSquare /> Edit
    </Button>
  );
};

export default EditButton;
