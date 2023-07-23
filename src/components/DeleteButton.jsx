import axios from "axios";
import { Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

export default function DeleteButton({ bookingId, setBookings, bookings }) {
  const BASE_URL =
    "https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api";
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
      const deletedBookingId = res.data.id;

      console.log(res.data);

      setBookings(
        bookings.filter((booking) => booking.id !== deletedBookingId)
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button variant="danger" onClick={handleDelete}>
      <FaTrash /> Delete
    </Button>
  );
}
