export interface Subscriber {
  id: number
  name: string
  subscriber_name?: string
  cnpj?: string
  email?: string
  telephone?: string
  postal_code?: string
  street?: string
  number?: string
  neighborhood?: string
  city?: string
  state_full_name?: string
  state_acronyms?: string
  state_logo?: string
  municipal_logo?: string
  administration_logo?: string
  status: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  departments?: Department[]
  drivers?: Driver[]
  vehicles?: Vehicle[]
  trips?: Trip[]
  passengers?: Person[]
  suppliers?: Supplier[]
  notifications?: Notification[]
  expenses?: Expense[]
  work_orders?: WorkOrder[]
  users?: User[]
  dailies?: Daily[]
  daily_amounts?: DailyAmount[]
}

export interface Department {
  id: number
  subscriber_id: number
  subscriber?: Subscriber
  name: string
  department_logo?: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  trips?: Trip[]
  drivers?: Driver[]
  home_vehicles?: Vehicle[]
  current_vehicles?: Vehicle[]
  user?: User[]
  vehicleLoan?: VehicleLoan[]
  loansSent?: VehicleLoan[]
  loansReceived?: VehicleLoan[]
}

export interface User {
  id: number
  uuid: string
  cpf: string
  name: string
  email?: string
  phone_number?: string
  password_hash: string
  is_password_temp: boolean
  is_verified_email: boolean
  is_verified_telefone: boolean
  number_try: number
  is_blocked: boolean
  role: string
  accepted_terms: boolean
  accepted_terms_at?: Date
  accepted_terms_version?: number
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  subscriber_id: number
  subscriber?: Subscriber
  departments?: Department[]
  dailies?: Daily[]
  tickets?: Ticket[]
  fuel_log?: FuelLog[]
}

export interface UserSupplier {
  id: number
  uuid: string
  cpf: string
  name: string
  email?: string
  phone_number?: string
  password_hash: string
  is_password_temp: boolean
  is_verified_email: boolean
  is_verified_telefone: boolean
  number_try: number
  is_blocked: boolean
  role: string
  accepted_terms: boolean
  accepted_terms_at?: Date
  accepted_terms_version?: number
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  supplier_id: number
  supplier?: Supplier
  fuel_logs?: FuelLog[]
}

export interface Driver {
  id: number
  subscriber_id: number
  subscriber?: Subscriber
  name: string
  license_number: string
  license_valid_until: Date
  telefone?: string
  type: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  department_id?: number
  department?: Department
  trips?: Trip[]
  notifications?: Notification[]
  expenses?: Expense[]
  dailies?: Daily[]
  daily_amounts?: DailyAmount[]
  fuel_logs?: FuelLog[]
}

export interface DailyAmount {
  id: number
  name: string
  value: number
  subscriber_id?: number
  subscriber?: Subscriber
  driver_id?: number
  driver?: Driver
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface Daily {
  id: number
  subscriber_id: number
  subscriber?: Subscriber
  driver_id: number
  driver?: Driver
  user_id: number
  user?: User
  value: number
  daily_amount: number
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface Vehicle {
  id: number
  subscriber_id: number
  subscriber?: Subscriber
  capacity_person?: number
  surname?: string
  mark?: string
  model?: string
  plate: string
  renavam: string
  type: string
  in_service: boolean
  available: boolean
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  maintenances?: Maintenance[]
  fuel_logs?: FuelLog[]
  trips?: Trip[]
  accident_reports?: AccidentReport[]
  work_orders?: WorkOrder[]
  notifications?: Notification[]
  vehicleLoan?: VehicleLoan[]
  home_department_id?: number
  home_department?: Department
  current_department_id?: number
  current_department?: Department
}

export interface VehicleLoan {
  id: number
  vehicle_id: number
  vehicle?: Vehicle
  from_department_id: number
  from_department?: Department
  to_department_id: number
  to_department?: Department
  start_date: Date
  end_date?: Date
  status: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  departmentId?: number
  Department?: Department
}

export interface Maintenance {
  id: number
  vehicle_id: number
  vehicle?: Vehicle
  supplier_id?: number
  supplier?: Supplier
  type: string
  date: Date
  description?: string
  cost?: number
  next_due?: Date
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface FuelLog {
  id: number
  uuid: string
  vehicle_id?: number
  vehicle?: Vehicle
  driver_id?: number
  driver?: Driver
  authorizer_id?: number
  authorizer?: User
  attendant_id?: number
  attendant?: UserSupplier
  person_id?: number
  person?: Person
  supplier_id?: number
  supplier?: Supplier
  supply_date: Date
  deadline?: Date
  liters?: number
  cost?: number
  odometer?: number
  fuel_type: string
  supply_type: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface Trip {
  id: number
  department_id: number
  department?: Department
  subscriber_id: number
  subscriber?: Subscriber
  purpose?: string
  request_date: Date
  start_state: string
  start_city: string
  end_state: string
  end_city: string
  start_time: Date
  end_time: Date
  status: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  vehicle_id: number
  vehicle?: Vehicle
  driver_id?: number
  driver?: Driver
  trip_passengers?: TripPassenger[]
  expenses?: Expense[]
}

export interface Person {
  id: number
  uuid: string
  cpf: string
  cns?: string
  full_name: string
  social_name?: string
  birth_date: Date
  death_date?: Date
  mother_name?: string
  father_name?: string
  postal_code?: string
  state?: string
  city?: string
  neighborhood?: string
  street_type?: string
  street_name?: string
  house_number?: number
  address_complement?: string
  reference_point?: string
  phone_number?: string
  email?: string
  sex?: string
  terms_accepted: boolean
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  subscriber_id: number
  subscriber?: Subscriber
  trip_passengers?: TripPassenger[]
  tickets?: Ticket[]
  fuel_logs?: FuelLog[]
}

export interface TripPassenger {
  id: number
  trip_id: number
  trip?: Trip
  passenger_id: number
  passenger?: Person
  needs_accessibility: boolean
  notes?: string
  dropoff_location?: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface Supplier {
  id: number
  uuid: string
  subscribers?: Subscriber[]
  name: string
  telephone?: string
  email?: string
  cnpj?: string
  category: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  tickets?: Ticket[]
  user_attendant?: UserSupplier[]
  fuel_logs?: FuelLog[]
  maintenances?: Maintenance[]
}

export interface Ticket {
  id: number
  uuid: string
  supplier_id: number
  supplier?: Supplier
  passenger_id: number
  person?: Person
  user_id: number
  user?: User
  start_state: string
  start_city: string
  end_state: string
  end_city: string
  travel_date?: Date
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface AccidentReport {
  id: number
  uuid: string
  vehicle_id: number
  vehicle?: Vehicle
  date: Date
  location: string
  description: string
  police_report?: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface Notification {
  id: number
  subscriber_id: number
  subscriber?: Subscriber
  type: string
  message: string
  sent_at?: Date
  is_read: boolean
  driver_id?: number
  driver?: Driver
  vehicle_id?: number
  vehicle?: Vehicle
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface Expense {
  id: number
  trip_id: number
  trip?: Trip
  subscriber_id: number
  subscriber?: Subscriber
  driver_id: number
  driver?: Driver
  type: string
  amount: number
  description?: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface WorkOrder {
  id: number
  uuid: string
  vehicle_id: number
  vehicle?: Vehicle
  subscriber_id: number
  subscriber?: Subscriber
  order_date: Date
  description: string
  status: string
  cost?: number
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}
