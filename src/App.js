import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Marketing from "./components/workspace/Marketing";
import Legal from "./components/workspace/Legal";
import Technical from "./components/workspace/Technical";
import Accounting from "./components/workspace/Accounting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/technical" element={<Technical />} />
        <Route path="/accounting" element={<Accounting />} />
      </Routes>
    </Router>
  );
}

export default App;
