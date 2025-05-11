export interface Subscriber {
  id: number;
  name: string;
  subscriber_name?: string;
  cnpj?: string;
  email?: string;
  telephone?: string;
  postal_code?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state_full_name?: string;
  state_acronyms?: string;
  state_logo?: string;
  municipal_logo?: string;
  administration_logo?: string;
  status: 'PAGO' | 'ATRASADO' | 'BLOQUEADO';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  departments?: Department[];
  vehicles?: Vehicle[];
  trips?: Trip[];
  passengers?: Person[];
  suppliers?: Supplier[];
  expenses?: Expense[];
  users?: User[];
  maintenance?: Maintenance[];
  loan?: Loan[];
  inventory?: Inventory[];
}

export interface Department {
  id: number;
  subscriber_id: number;
  subscriber?: Subscriber;
  name: string;
  department_logo?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  trips?: Trip[];
  users?: User[];
  vehicle_sents?: Vehicle[];
  vehicle_receiveds?: Vehicle[];
  loans_sent?: Loan[];
  loans_received?: Loan[];
}

export interface User {
  id: number;
  uuid: string;
  cpf: string;
  name: string;
  cnh?: string;
  email?: string;
  phone_number?: string;
  password_hash: string;
  is_password_temp: boolean;
  number_try: number;
  is_blocked: boolean;
  role: 'MANAGE' | 'SECRETARY' | 'ADMIN_LOCAL' | 'TYPIST' | 'DRIVE' | 'TYPIST_SUPPLY';
  type: 'CONTRATADO' | 'DIARISTA';
  accepted_terms: boolean;
  accepted_terms_at?: Date;
  accepted_terms_version?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  subscriber_id?: number;
  subscriber?: Subscriber;
  supplier_id?: number;
  supplier?: Supplier;
  drives_loan?: Loan[];
  authorizer_loan?: Loan[];
  departments?: Department[];
  tickets_authorized?: Ticket[];
  tickets_attended?: Ticket[];
  fuel_logs_driven?: FuelLog[];
  fuel_logs_authorized?: FuelLog[];
  fuel_logs_attended?: FuelLog[];
  trips_driven?: Trip[];
  trips_authorized?: Trip[];
  trips_attended?: Trip[];
  maintenances_authorized?: Maintenance[];
  maintenances_attended?: Maintenance[];
  expenses_received?: Expense[];
  expenses_created?: Expense[];
}

export interface Loan {
  id: number;
  driver_id?: number;
  driver?: User;
  authorizer_id?: number;
  authorizer?: User;
  vehicle_id?: number;
  vehicle?: Vehicle;
  from_department_id: number;
  from_department?: Department;
  to_department_id: number;
  to_department?: Department;
  end_date?: Date;
  status: 'PENDENTE' | 'APROVADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  subscriber_id?: number;
  subscriber?: Subscriber;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Expense {
  id: number;
  days?: number;
  value?: number;
  daily_amount?: number;
  description?: string;
  type: 'DIARIA' | 'PEDAGIO' | 'ESTACIONAMENTO' | 'MULTA' | 'REEMBOLSO' | 'OUTRO';
  trip_id?: number;
  trip?: Trip;
  subscriber_id: number;
  subscriber?: Subscriber;
  user_receiver_id: number;
  user_receiver?: User;
  user_create_id: number;
  user_create?: User;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Vehicle {
  id: number;
  subscriber_id: number;
  subscriber?: Subscriber;
  capacity_person?: number;
  surname?: string;
  mark?: string;
  model?: string;
  plate: string;
  renavam: string;
  in_service: boolean;
  available: boolean;
  licensing?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  maintenances?: Maintenance[];
  fuel_logs?: FuelLog[];
  trips?: Trip[];
  accident_reports?: AccidentReport[];
  vehicle_loans?: Loan[];
  from_department_id?: number;
  from_department?: Department;
  to_department_id?: number;
  to_department?: Department;
}

export interface Maintenance {
  id: number;
  order_date: Date;
  status: 'PENDENTE' | 'APROVADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  type: 'PREVENTIVA' | 'CORRETIVA' | 'INSPECAO';
  date: Date;
  description?: string;
  cost?: number;
  next_due?: Date;
  vehicle_id: number;
  vehicle?: Vehicle;
  supplier_id?: number;
  supplier?: Supplier;
  authorizer_id?: number;
  authorizer?: User;
  attendant_id?: number;
  attendant?: User;
  subscriber_id: number;
  subscriber?: Subscriber;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Inventory {
  id: number;
  subscriber_id: number;
  subscriber?: Subscriber;
  category: 'SPARE_PART' | 'TIRE' | 'BATTERY' | 'FILTER' | 'OTHER';
  part_number?: string;
  name?: string;
  quantity?: number;
  maintenance_id?: number;
  maintenance?: Maintenance;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface FuelLog {
  id: number;
  uuid: string;
  vehicle_id?: number;
  vehicle?: Vehicle;
  driver_id?: number;
  driver?: User;
  authorizer_id?: number;
  authorizer?: User;
  attendant_id?: number;
  attendant?: User;
  person_id?: number;
  person?: Person;
  supplier_id?: number;
  supplier?: Supplier;
  attendant_viewed?: boolean;
  supply_date?: Date;
  deadline?: Date;
  liters?: number;
  cost?: number;
  odometer?: number;
  fuel_type: 'GASOLINA' | 'DIESEL' | 'ETANOL' | 'ELETRICO' | 'OUTRO';
  supply_type: 'COMPLETE' | 'LITRO_ESPECIFICADO' | 'COMPLETE_SEM_CADASTRO' | 'LITRO_ESPECIFICADO_SEM_CADASTRO';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Trip {
  id: number;
  uuid: string;
  purpose?: string;
  request_date: Date;
  start_state?: string;
  start_city?: string;
  end_state?: string;
  end_city?: string;
  start_time?: Date;
  end_time?: Date;
  status: 'PENDENTE' | 'APROVADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  vehicle_id?: number;
  vehicle?: Vehicle;
  department_id: number;
  department?: Department;
  subscriber_id: number;
  subscriber?: Subscriber;
  driver_id?: number;
  driver?: User;
  authorizer_id?: number;
  authorizer?: User;
  attendant_id?: number;
  attendant?: User;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  trip_passengers?: TripPassenger[];
  expenses?: Expense[];
}

export interface Person {
  id: number;
  uuid: string;
  cpf?: string;
  cns?: string;
  full_name: string;
  social_name?: string;
  birth_date: Date;
  death_date?: Date;
  mother_name?: string;
  father_name?: string;
  postal_code?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street_type?: string;
  street_name?: string;
  house_number?: number;
  address_complement?: string;
  reference_point?: string;
  phone_number?: string;
  email?: string;
  sex?: string;
  terms_accepted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  subscriber_id: number;
  subscriber?: Subscriber;
  trip_passengers?: TripPassenger[];
  tickets?: Ticket[];
  fuel_logs?: FuelLog[];
}

export interface TripPassenger {
  id: number;
  trip_id?: number;
  trip?: Trip;
  passenger_id?: number;
  passenger?: Person;
  needs_accessibility?: boolean;
  notes?: string;
  dropoff_location?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Supplier {
  id: number;
  uuid: string;
  name: string;
  telephone?: string;
  email?: string;
  cnpj?: string;
  category: 'POSTO_COMBUSTIVEL' | 'ALTERNATIVO' | 'ESTACAO_CARREGAMENTO' | 'FORNECEDOR_EQUIPAMENTOS' | 'FORNECEDOR_PECAS' | 'FORNECEDOR_LUBRIFICANTES' | 'OFICINA_SERVICOS' | 'LAVACAO' | 'COMPANHIA_TRANSPORTE' | 'SEGUROS' | 'LOCADORA';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  subscribers?: Subscriber[];
  tickets?: Ticket[];
  fuel_logs?: FuelLog[];
  maintenances?: Maintenance[];
  users?: User[];
}

export interface Ticket {
  id: number;
  uuid: string;
  supplier_id: number;
  supplier?: Supplier;
  passenger_id: number;
  person?: Person;
  cost?: number;
  authorizer_id?: number;
  authorizer?: User;
  attendant_id?: number;
  attendant?: User;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  travel_date?: Date;
  attendant_viewed?: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface AccidentReport {
  id: number;
  uuid: string;
  vehicle_id: number;
  vehicle?: Vehicle;
  date: Date;
  location: string;
  description: string;
  police_report?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
