import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../Layout";
import Vehicle from "../Pages/Vehicle/main";
import Trip from "../Pages/Trip/main";
import CreateTrip from "../Pages/Trip/Create";
import Fuel from "../Pages/Fuel";
import Drive from "../Pages/Driver/main";
import Person from "../Pages/Person";
import Maintenance from "../Pages/Maintenance";
import Ticket from "../Pages/Ticket/main";
import User from "../Pages/User/main";
import Supplier from "../Pages/Supplier/main";
import Subscriber from "../Pages/Subscriber/main";
import CreateMaintenance from "../Pages/Maintenance/Create";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={< Vehicle />} />
          <Route path="/trip" element={< Trip />} />
          <Route path="/trip/create" element={< CreateTrip />} />
          <Route path="/fuel" element={< Fuel />} />
          <Route path="/maintenance" element={< Maintenance />} />
          <Route path="/maintenance/create" element={< CreateMaintenance />} />
          <Route path="/drive" element={< Drive />} />
          <Route path="/person" element={< Person />} />
          <Route path="/ticket" element={< Ticket />} />
          <Route path="/user" element={< User />} />
          <Route path="/supplier" element={< Supplier />} />
          <Route path="/subscriber" element={< Subscriber />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}