import { format } from "date-fns";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import axios from "axios";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form } from "react-router-dom";

export default function BookingListItem({
  row,
  bookings,
  setBookings,
  trainers,
}) {
  const BASE_URL =
    "https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api";

  const [showEditModal, setShowEditModal] = useState("");
  const handleCloseEditModal = () => setShowEditModal("");
  const currentDay = new Date().toISOString().split("T")[0];
  const { trainer_id, appointment_date, start_time, end_time, id, member_id } =
    row;
  const [newTrainerId, setNewTrainerId] = useState(trainer_id || "");
  const [newAppointmentDate, setNewAppointmentDate] = useState(
    appointment_date || ""
  );
  const [newStartTime, setNewStartTime] = useState(start_time || "");
  const [newEndTime, setNewEndTime] = useState(end_time || "");

  const handleDelete = async () => {
    try {
      const result = await axios.delete(`${BASE_URL}/bookings/${id}`);
      const deletedBookingId = result.data.id;
      console.log(deletedBookingId);

      setBookings(
        bookings.filter((booking) => booking.id !== deletedBookingId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBooking = async () => {
    try {
      const res = await axios.put(
        `https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api/bookings/${id}`
      );

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <tr key={id}>
        <td>{id}</td>
        <td>{format(new Date(appointment_date), "MMMM dd, yyyy")}</td>
        <td>{row.member_id}</td>
        <td>{row.trainer_id}</td>
        <td>{row.start_time}</td>
        <td>{row.end_time}</td>
        <td>
          <DeleteButton
            onClick={handleDelete}
            bookingId={row.id}
            setBookings={setBookings}
            bookings={bookings}
          />
          <EditButton handleShowEditModal={() => setShowEditModal(true)} />
        </td>
      </tr>

      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        animation={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Edit your booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditBooking}>
            <Form.Group controlId="trainerId" className="mb-3">
              <Form.Label>Choose a trainer</Form.Label>
              <Form.Select
                aria-label="Pick a trainer"
                value={newTrainerId}
                onChange={(e) => setNewTrainerId(e.target.value)}
              >
                <option>Choose your trainer</option>
                {trainers &&
                  trainers.map((trainer) => {
                    return (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.full_name}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="appointment-date" className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="date"
                min={currentDay}
                value={newAppointmentDate}
                onChange={(e) => setNewAppointmentDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="start-time" className="mb-3">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="time"
                value={newStartTime}
                onChange={(e) => {
                  setNewStartTime(e.target.value + ":00");
                  console.log(newStartTime);
                }}
              />
            </Form.Group>

            <Form.Group controlId="end-time" className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="time"
                value={newEndTime}
                onChange={(e) => {
                  setNewEndTime(e.target.value + ":00");
                  console.log(newEndTime);
                }}
              />
            </Form.Group>

            <Form.Group>
              <Button type="submit" variant="primary" className="ms-auto">
                Create Booking
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
