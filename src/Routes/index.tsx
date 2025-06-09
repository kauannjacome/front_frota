import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../Layout";

// Autenticação
import Auth from "../Pages/Auth";
import AuthSupplier from "../Pages/Mobile/AuthMobile";
import FuelLogAttendant from "../Pages/Mobile/fuelLogAttendant";

// Veículos
import Vehicle from "../Pages/Vehicle";
import CreateVehicle from "../Pages/Vehicle/CreateVehicle";
import EditVehicle from "../Pages/Vehicle/EditVehicle";

// Viagens
import Trip from "../Pages/Trip";
import CreateTrip from "../Pages/Trip/CreateTrip";
import EditTrip from "../Pages/Trip/EditTrip";

// Abastecimento
import Fuel from "../Pages/Fuel";
import CreateFuelLog from "../Pages/Fuel/CreateFuelLog";
import EditFuelLog from "../Pages/Fuel/EditFuelLog";

// Manutenção
import Maintenance from "../Pages/Maintenance";
import CreateMaintenance from "../Pages/Maintenance/CreateMaintenance";
import EditMaintenance from "../Pages/Maintenance/EditMaintenance";

// Pessoas
import Person from "../Pages/Person";
import CreatePerson from "../Pages/Person/CreatePerson";

// Chamados
import Ticket from "../Pages/Ticket";
import CreateTicket from "../Pages/Ticket/CreateTicket";
import EditTicket from "../Pages/Ticket/EditTicket";

// Usuários
import User from "../Pages/User";
import CreateUser from "../Pages/User/CreateUser";
import EditUser from "../Pages/User/EditUser";

// Fornecedores
import Supplier from "../Pages/Supplier";
import CreateSupplier from "../Pages/Supplier/CreateSupplier";
import EditSupplier from "../Pages/Supplier/EditSupplier";

// Departamentos
import Department from "../Pages/Department";
import CreateDepartment from "../Pages/Department/CreateDepartment";
import EditDepartment from "../Pages/Department/EditDepartment";

// Assinantes
import Subscriber from "../Pages/Subscriber";
import CreateSubscriber from "../Pages/Subscriber/CreateSubscriber";
import EditSubscriber from "../Pages/Subscriber/EditSubscriber";

// relatorios
import DailyAllowanceReport from '../Pages/Report/DailyAllowanceReport'
import FuelLogReport from "../Pages/Report/FuelLogReport";
import MaintenanceReport from "../Pages/Report/MaintenanceReport";
import TripReport from "../Pages/Report/TripReport";
import VehicleReport from "../Pages/Report/VehicleReport";
import SubscriberList from "../Pages/admin/SubscriberList";
import DepartmentList from "../Pages/admin/DepartmentList";
import AuthMobile from "../Pages/Mobile/AuthMobile";
import UploadPersonCsvForm from "../Pages/Person/UploadPersonCsvForm";
import EditPerson from "../Pages/Person/EditPerson";
import FuelPrice from "../Pages/FuelPrice";
import CreateFuelPrice from "../Pages/FuelPrice/CreateFuelPrice";
import EditFuelPrice from "../Pages/FuelPrice/EditFuelPrice";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin/subscriber" element={<SubscriberList />} />
        <Route path="/admin/department/:id" element={<DepartmentList />} />
 

        <Route path="/auth/mobile" element={<AuthMobile />} />
        <Route path="/supplier/fuel-log-attendant" element={<FuelLogAttendant />} />

        <Route element={<AppLayout />}>
          <Route path="/vehicle" element={<Vehicle />} />
          <Route path="/vehicle/create" element={<CreateVehicle />} />
          <Route path="/vehicle/edit/:id" element={<EditVehicle />} />

          <Route path="/trip" element={<Trip />} />
          <Route path="/trip/create" element={<CreateTrip />} />
          <Route path="/trip/edit/:id" element={<EditTrip />} />

          <Route path="/fuel" element={<Fuel />} />
          <Route path="/fuel/create" element={<CreateFuelLog />} />
          <Route path="/fuel/edit/:id" element={<EditFuelLog />} />

          <Route path="/fuel-price" element={<FuelPrice />} />
          <Route path="/fuel-price/create" element={<CreateFuelPrice />} />
          <Route path="/fuel-price/edit/:id" element={<EditFuelPrice />} />

          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/maintenance/create" element={<CreateMaintenance />} />
          <Route path="/maintenance/edit/:id" element={<EditMaintenance />} />

          <Route path="/person" element={<Person />} />
          <Route path="/person/create" element={<CreatePerson />} />
          <Route path="/person/edit/:id" element={<EditPerson/>} />
          <Route path="/person/lot/create" element={<UploadPersonCsvForm />} />

          <Route path="/ticket" element={<Ticket />} />
          <Route path="/ticket/create" element={<CreateTicket />} />
          <Route path="/ticket/edit/:id" element={<EditTicket />} />

          <Route path="/user" element={<User />} />
          <Route path="/user/create" element={<CreateUser />} />
          <Route path="/user/edit/:id" element={<EditUser />} />

          <Route path="/supplier" element={<Supplier />} />
          <Route path="/supplier/create" element={<CreateSupplier />} />
          <Route path="/supplier/edit/:id" element={<EditSupplier />} />

          <Route path="/report/daily" element={<DailyAllowanceReport />} />
          <Route path="/report/fuel-log" element={<FuelLogReport />} />
          <Route path="/report/maintenance" element={<MaintenanceReport />} />
          <Route path="/report/trip" element={<TripReport />} />
          <Route path="/report/vehicle" element={<VehicleReport />} />


          <Route path="/department" element={<Department />} />
          <Route path="/department/create" element={<CreateDepartment />} />
          <Route path="/department/edit/:id" element={<EditDepartment />} />

          <Route path="/subscriber" element={<Subscriber />} />
          <Route path="/subscriber/create" element={<CreateSubscriber />} />
          <Route path="/subscriber/edit/:id" element={<EditSubscriber />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
