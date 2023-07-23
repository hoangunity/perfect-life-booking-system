/* eslint-disable no-unused-vars */
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate, formatTimeWithoutSeconds } from "../utils/helpers";
import useLocalStorage from "use-local-storage";

export default function EditBookingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");

  const currentDay = new Date().toISOString().split("T")[0];
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleEditBooking = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api/bookings/${bookingId}`,
        {
          new_trainer_id: trainerId,
          new_appointment_date: appointmentDate,
          new_start_time: startTime + ":00",
          new_end_time: endTime + ":00",
        }
      );

      console.log(res.data);
      navigate("/app");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/auth");
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const { id: memberId } = jwtDecode(authToken);

    if (!authToken) {
      return navigate("/auth");
    } else {
      setMemberId(memberId);
      setAuthToken(authToken);
      const fetchBookingData = async () => {
        try {
          const result = await axios.post(
            `https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api/bookings/${bookingId}`
          );

          const { appointment_date, end_time, start_time, trainer_id } =
            result.data.data;
          setAppointmentDate(formatDate(appointment_date));
          setTrainerId(trainer_id);
          setStartTime(formatTimeWithoutSeconds(start_time));
          setEndTime(formatTimeWithoutSeconds(end_time));
          console.log("Bookings: ", result.data.data); // Use result.data here since it is updated with the fetched data
        } catch (error) {
          console.error(error);
        }
      };

      const fetchAllTrainers = async () => {
        try {
          const result = await axios.get(
            `https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api/trainers`
          );

          setTrainers(result.data.data);
          console.log("Trainers: ", result.data.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchBookingData();
      fetchAllTrainers();
    }
  }, [navigate, bookingId, setAuthToken, authToken]);

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to={"/app"}>
            Perfect-life
          </Navbar.Brand>
          <Nav className="ms-auto d-flex gap-3">
            <Nav.Item as={Button} variant="primary" onClick={handleLogout}>
              Logout
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Form onSubmit={handleEditBooking}>
          <Form.Group controlId="trainerId" className="mb-3">
            <Form.Label>Choose a trainer</Form.Label>
            <Form.Select
              aria-label="Pick a trainer"
              onChange={(e) => setTrainerId(e.target.value)}
              value={trainerId}
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
              Edit Booking
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}
