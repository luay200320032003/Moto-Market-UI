import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Layout from "./Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
           <Route path="/" element={<Home />} />
             <Route path="/Browse" element={<Browse />} />
            <Route path="*" element={<LandingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
