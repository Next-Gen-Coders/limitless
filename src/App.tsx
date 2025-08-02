import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AppPage from "./components/AppPage";
import TestPage from "./components/TestPage";
import HealthPage from "./components/HealthPage";
import { ThemeProvider } from "./contexts/ThemeContext";
function App() {

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/health" element={<HealthPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;