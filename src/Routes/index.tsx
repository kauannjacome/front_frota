import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import AppLayout from "../Layout";
import Vehicle from "../Pages/Vehicle/main";
import Trip from "../Pages/Trip";
import Fuel from "../Pages/Fuel";
import Drive from "../Pages/Driver";
import Person from "../Pages/Person";
import Maintenance from "../Pages/Maintenance";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={< Home/>} />
        <Route path="/vehicle" element={< Vehicle/>} />
        <Route path="/trip" element={< Trip/>} />
        <Route path="/fuel" element={< Fuel/>} />
        <Route path="/maintenance" element={< Maintenance/>} />
        <Route path="/drive" element={< Drive/>} />
        <Route path="/person" element={< Person/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}