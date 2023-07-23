import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Modal,
  Nav,
  Navbar,
  Table,
} from "react-bootstrap";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { format } from "date-fns";
import DeleteButton from "../components/DeleteButton";

export default function DashboardPage() {
  const BASE_URL =
    "https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api";
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [showModal, setBookingModal] = useState("");
  const handleShowBookingModal = () => setBookingModal("booking/create");
  const clearForm = () => {
    setTrainerId("");
    setAppointmentDate("");
    setStartTime("");
    setEndTime("");
  };

  const handleCloseModal = () => {
    setBookingModal("");
    clearForm();
  };
  const currentDay = new Date().toISOString().split("T")[0];
  const [memberId, setMemberId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        trainer_id: trainerId,
        appointment_date: appointmentDate,
        start_time: startTime + ":00",
        end_time: endTime + ":00",
      };

      const result = await axios.post(
        `https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api/bookings/${memberId}/create`,
        payload
      );

      console.log(result.data);
      setBookings((prevBookings) => [...prevBookings, result.data.data]);
      clearForm();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const { id: memberId } = jwtDecode(authToken);

    if (!authToken) {
      navigate("/auth");
    } else {
      setMemberId(memberId);
      const fetchBookingData = async () => {
        try {
          const result = await axios.get(`${BASE_URL}/bookings/${memberId}`);

          setBookings(result.data.data);
          console.log("Bookings: ", result.data.data); // Use result.data here since it is updated with the fetched data
        } catch (error) {
          console.error(error);
        }
      };

      const fetchAllTrainers = async () => {
        try {
          const result = await axios.get(`${BASE_URL}/trainers`);

          setTrainers(result.data.data);
          console.log("Trainers: ", result.data.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchBookingData();
      fetchAllTrainers();
    }
  }, [navigate]);

  const renderHeader = (
    <>
      <th>BookingID</th>
      <th>Date</th>
      <th>MemberId</th>
      <th>TrainerId</th>
      <th>From</th>
      <th>To</th>
      <th>Actions</th>
    </>
  );

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Nav.Item}>Perfect-life</Navbar.Brand>
          <Nav className="ms-auto d-flex gap-3">
            <Nav.Item
              as={Button}
              variant="primary"
              onClick={handleShowBookingModal}
            >
              Add Booking
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      {bookings?.length > 0 && (
        <Container className="mt-4">
          <Table striped bordered hover>
            <thead>
              <tr>{renderHeader}</tr>
            </thead>
            <tbody>
              {bookings &&
                bookings.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {format(new Date(row.appointment_date), "MMMM dd, yyyy")}
                    </td>
                    <td>{row.member_id}</td>
                    <td>{row.trainer_id}</td>
                    <td>{row.start_time}</td>
                    <td>{row.end_time}</td>
                    <td>
                      <DeleteButton
                        bookingId={row.id}
                        setBookings={setBookings}
                        bookings={bookings}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Container>
      )}

      {/* Add the booking modal form here */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        animation={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Create new Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitBooking}>
            <Form.Group controlId="trainerId" className="mb-3">
              <Form.Label>Choose a trainer</Form.Label>
              <Form.Select
                aria-label="Pick a trainer"
                onChange={(e) => setTrainerId(e.target.value)}
              >
                <option>Choose your trainer</option>
                {trainers.map((trainer) => {
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
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="start-time" className="mb-3">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  console.log(startTime);
                }}
              />
            </Form.Group>

            <Form.Group controlId="end-time" className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  console.log(endTime);
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
