import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/auth" />} />
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
    </>
  );
}
