import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../Layout";
import Vehicle from "../Pages/Vehicle";
import Trip from "../Pages/Trip/main";
import CreateTrip from "../Pages/Trip/Create";
import Fuel from "../Pages/Fuel";

import Person from "../Pages/Person";
import Maintenance from "../Pages/Maintenance";
import Ticket from "../Pages/Ticket";
import User from "../Pages/User/main";
import Supplier from "../Pages/Supplier";
import Subscriber from "../Pages/Subscriber";
import CreateVehicle from "../Pages/Vehicle/CreateVehicle";
import EditVehicle from "../Pages/Vehicle/EditVehicle";
import CreatePerson from "../Pages/Person/CreatePerson";
import CreateTicket from "../Pages/Ticket/CreateTicket";
import EditTicket from "../Pages/Ticket/EditTicket";
import CreateMaintenance from "../Pages/Maintenance/CreateMaintenance";
import EditMaintenance from "../Pages/Maintenance/EditMaintenance";
import CreateFuelLog from "../Pages/Fuel/CreateFuelLog";
import EditFuelLog from "../Pages/Fuel/EditFuelLog";
import CreateUser from "../Pages/User/CreateUser";
import EditUser from "../Pages/User/EditUser";
import CreateSupplier from "../Pages/Supplier/CreateSupplier";
import EditSupplier from "../Pages/Supplier/EditSupplier";
import CreateSubscriber from "../Pages/Subscriber/CreateSubscriber";
import EditSubscriber from "../Pages/Subscriber/EditSubscriber";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/vehicle" element={< Vehicle />} />
          <Route path="/vehicle/create" element={< CreateVehicle />} />
          <Route path="/vehicle/edit/:id" element={< EditVehicle />} />
          <Route path="/trip" element={< Trip />} />
          <Route path="/trip/create" element={< CreateTrip />} />
          <Route path="/fuel" element={< Fuel />} />
          <Route path="/fuel/create" element={< CreateFuelLog />} />
          <Route path="/fuel/edit/:id" element={< EditFuelLog />} />

          <Route path="/maintenance" element={< Maintenance />} />
          <Route path="/maintenance/create" element={< CreateMaintenance />} />
          <Route path="/maintenance/edit/:id" element={< EditMaintenance />} />

          <Route path="/person" element={< Person />} />
          <Route path="/person/create" element={< CreatePerson />} />
          <Route path="/person/edit/:id" element={< CreatePerson />} />

          <Route path="/ticket" element={< Ticket />} />
          <Route path="/ticket/create" element={< CreateTicket />} />
          <Route path="/ticket/edit/:id" element={< EditTicket />} />

          <Route path="/user" element={< User />} />
          <Route path="/user/create" element={< CreateUser />} />
          <Route path="/user/edit/:id" element={< EditUser />} />

          <Route path="/supplier" element={< Supplier />} />
          <Route path="/supplier/create" element={< CreateSupplier />} />
          <Route path="/supplier/edit/:id" element={< EditSupplier />} />

          <Route path="/subscriber" element={< Subscriber />} />
          <Route path="/subscriber/create" element={< CreateSubscriber />} />
          <Route path="/subscriber/edit/:id" element={< EditSubscriber />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}