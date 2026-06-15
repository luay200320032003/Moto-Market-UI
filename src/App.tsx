import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Layout from "./Layout";
import Motorcycle from "./pages/Motocycle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sell from "./pages/Sell";
import MyListings from "./pages/MyListings";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Browse" element={<Browse />} />
          <Route path="/Motorcycle" element={<Motorcycle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Sell" element={<Sell />} />
          <Route path="/my-listings" element={<MyListings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
