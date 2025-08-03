import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AppPage from "./components/AppPage";
import HealthPage from "./components/HealthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivyProvider from "./providers/PrivyProvider";

function App() {
  return (
    <PrivyProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppPage />
                </ProtectedRoute>
              }
            />
            <Route path="/health" element={<HealthPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </PrivyProvider>
  );
}

export default App;
