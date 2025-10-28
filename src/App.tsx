import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Layout from "./Layout";
import Motorcycle from "./pages/Motocycle";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Browse" element={<Browse />} />
          <Route path="/Motorcycle" element={<Motorcycle />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;