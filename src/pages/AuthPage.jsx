import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";

export default function AuthPage() {
  const BASE_URL =
    "https://booking-system-api-hoangunity.sigma-school-full-stack.repl.co/api";
  const [showModal, setShowModal] = useState("");
  const handleShowLogin = () => setShowModal("login");
  const handleShowRegister = () => setShowModal("register");
  const handleClose = () => setShowModal(false);
  const renderModalTitle = showModal === "login" ? "Login" : "Register";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");

  useEffect(() => {
    if (authToken) navigate("/app");
  }, [authToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      setAuthToken(res.data.token);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/registration`, {
        email,
        password,
      });
      console.log(res.data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Nav.Item}>Perfect-Life</Navbar.Brand>
          <Nav className="ms-auto d-flex gap-3">
            <Nav.Item as={Button} variant="primary" onClick={handleShowLogin}>
              Login
            </Nav.Item>
            <Nav.Item
              as={Button}
              variant="secondary"
              onClick={handleShowRegister}
            >
              Register
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{renderModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={showModal === "login" ? handleLogin : handleRegister}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Login Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter login email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </Form.Group>
            <Form.Group className="d-flex gap-3">
              <Button variant="primary" type="submit">
                {renderModalTitle}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
