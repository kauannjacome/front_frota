// src/types.ts
export interface Trip {
  id: number
  uuid: string

  purpose?: string
  request_date: string

  start_state?: string
  start_city?: string

  end_state?: string
  end_city?: string

  journey_start?: string
  journey_back?: string

  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO'

  vehicle_id?: number
  department_id: number
  subscriber_id: number

  driver_id?: number
  authorizer_id?: number
  attendant_id?: number

  fuelLog_id?: number

  created_at: string
  updated_at: string
  deleted_at?: string

  trip_passengers: any[]   // ou crie outra interface TripPassenger
  expenses: any[]          // ou Expense[]
}

// types.ts
export interface PayloadTokenDto {
  id: number;
  role: string;
  department_id: number;
  subscriber_id: number;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}




// Enums correspondentes aos valores possíveis no JSON / schema Prisma
type FuelType = 'GASOLINA' | 'DIESEL' | 'ETANOL' | 'ELETRICO' | 'GAS_NATURAL' | 'OUTRO';
type SupplyType = 'COMPLETE' | 'LITRO_ESPECIFICADO' | 'COMPLETE_SEM_CADASTRO' | 'LITRO_ESPECIFICADO_SEM_CADASTRO';
type FuelTypeVehicle = 'GASOLINA' | 'ETANOL' | 'FLEX' | 'DIESEL' | 'ELETRICO' | 'GAS_NATURAL' | 'OUTRO';
type RoleUser =
  | 'MANAGER'
  | 'ADMIN_LOCAL'
  | 'SECRETARY'
  | 'SUPERVISOR'
  | 'TYPIST'
  | 'DRIVE'
  | 'ADMIN_SUPPLY'
  | 'TYPIST_SUPPLY';
type TypeContract = 'CONTRATADO' | 'DIARISTA';
type SupplierCategory =
  | 'POSTO_COMBUSTIVEL'
  | 'FORNECEDOR_PECAS'
  | 'OFICINA_SERVICOS'
  | 'LAVACAO'
  | 'COMPANHIA_TRANSPORTE'
  | 'SEGUROS'
  | 'LOCADORA';

// Interface para Vehicle (campos conforme JSON)
export interface VehicleDto {
  id: number;
  uuid: string;
  subscriber_id: number;
  capacity_person: number | null;
  surname: string | null;
  mark: string | null;
  model: string | null;
  plate: string;
  renavam: string;
  is_people: boolean;
  is_internal_department: boolean;
  fuel_type_vehicle: FuelTypeVehicle | null;
  in_service: boolean;
  available: boolean;
  licensing: string | null; // ISO date string ou null
  from_department_id: number | null;
  to_department_id: number | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  deleted_at: string | null;
}

// Interface genérica para User conforme JSON de driver/authorizer/attendant
export interface UserDto {
  id: number;
  uuid: string;
  cpf: string | null;
  cnh: string | null;
  email: string | null;
  phone_number: string | null;
  full_name: string;
  name_search: string | null;
  nationality: string | null;
  birth_date: string | null; // ISO date string ou null
  death_date: string | null;
  mother_name: string | null;
  father_name: string | null;
  password_hash: string;
  is_password_temp: boolean;
  number_try: number;
  is_blocked: boolean;
  role: RoleUser;
  type: TypeContract;
  accepted_terms: boolean;
  accepted_terms_at: string | null; // ISO datetime string ou null
  accepted_terms_version: number | null;
  department_id: number | null;
  subscriber_id: number | null;
  supplier_id: number | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  deleted_at: string | null;
}

// Interface para Supplier conforme JSON
export interface SupplierDto {
  id: number;
  uuid: string;
  name: string;
  telephone: string | null;
  email: string | null;
  cnpj: string | null;
  category: SupplierCategory;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  deleted_at: string | null;
}

// Interface principal para FuelLog conforme JSON
export interface FuelLogDto {
  id: number;
  uuid: string;
  vehicle_id: number | null;
  driver_id: number | null;
  authorizer_id: number | null;
  attendant_id: number | null;
  supplier_id: number | null;
  department_id: number | null;
  subscriber_id: number | null;
  fuel_price_id: number | null;
  attendant_viewed: boolean;
  is_success: boolean;
  trip_id: number | null;
  supply_date: string | null; // ISO datetime string ou null
  deadline: string | null;     // ISO datetime string ou null
  liters: number | null;
  cost: number | null;
  price_liters: number | null;
  odometer: number | null;
  fuel_type: FuelType;
  supply_type: SupplyType;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  deleted_at: string | null;

  vehicle: VehicleDto;
  driver: UserDto;
  authorizer: UserDto;
  attendant: UserDto;
  supplier: SupplierDto;
}
