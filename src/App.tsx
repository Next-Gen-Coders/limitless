import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AppPage from "./components/AppPage";
import HealthPage from "./components/HealthPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivyProvider from "./providers/PrivyProvider";

function App() {
  return (
    <PrivyProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/health" element={<HealthPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </PrivyProvider>
  );
}

export default App;