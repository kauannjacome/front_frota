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
  departament_id: number;
  subscriber_id: number;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
