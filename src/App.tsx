import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Browse from "./pages/Browse";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Home />} />
          <Route path="/Browse" element={<Browse />} />
        <Route path="/LandingPage" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
