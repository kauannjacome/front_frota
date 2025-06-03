import React, { useEffect, useState, useCallback } from "react";
import {
  Drawer,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Spin,
  message,
  Typography,
  Descriptions,
  Divider,
  Switch
} from "antd";
import moment from "moment";
import debounce from "lodash/debounce";
import api from "../../../services/api";
import { jwtDecode } from "jwt-decode"; // 1) named export, pois não há default export
import { Trip, PayloadTokenDto } from "../../../types";

const { Option } = Select;

// Tipagem dos campos do formulário
export interface FuelLogFormValues {
  vehicle_id?: number;
  driver_id?: number;
  supplier_id?: number;
  department_id?: number;
  supply_date: moment.Moment;
  deadline?: moment.Moment;
  liters?: number;
  cost?: number;
  odometer?: number;
  is_success?: boolean;
  fuel_type: "GASOLINA" | "ETANOL" | "DIESEL" | "ELETRICO" | "OUTRO";
  supply_type?: "COMPLETE" | "LITRO_ESPECIFICADO";
}

interface UserStorage {
  id: string;
  full_name: string;
  role: string;
  subscribe_name?: string; // pode ser undefined se não houver subscriber
  subscribe_id?: string;
  state?: string; // acrônimos do estado do subscriber (ex.: “SP”, “RJ”)
  city?: string;
}

// Definição das interfaces TypeScript com base no JSON fornecido

export interface Tripid {
  id: number;
  uuid: string;
  purpose: string;
  request_date: string;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  journey_start: string;
  journey_back: string;
  status: string;
  vehicle_id: number;
  department_id: number;
  subscriber_id: number;
  driver_id: number;
  authorizer_id: number;
  attendant_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  trip_passengers: TripPassenger[];
  fuel_logs: FuelLog[];
  driver: Driver;
  vehicle: Vehicle;
}

export interface TripPassenger {
  id: number;
  uuid: string;
  type: string;
  trip_id: number;
  passenger_id: number;
  confirm_journey_start: string | null;
  confirm_journey_back: string | null;
  needs_accessibility: boolean;
  notes: string;
  dropoff_location: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  passenger: PassengerInfo;
}

export interface PassengerInfo {
  full_name: string;
  phone_number: string | null;
}

export interface FuelLog {
  id: number;
  uuid: string;
  vehicle_id: number;
  driver_id: number;
  authorizer_id: number;
  attendant_id: number | null;
  supplier_id: number;
  department_id: number;
  subscriber_id: number;
  fuel_price_id: number | null;
  attendant_viewed: boolean;
  trip_id: number;
  supply_date: string;
  deadline: string;
  liters: number;
  cost: number;
  odometer: number;
  fuel_type: string;
  supply_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Driver {
  id: number;
  uuid: string;
  cpf: string;
  cnh: string | null;
  email: string;
  phone_number: string;
  full_name: string;
  name_search: string | null;
  nationality: string | null;
  birth_date: string | null;
  death_date: string | null;
  mother_name: string | null;
  father_name: string | null;
  password_hash: string;
  is_password_temp: boolean;
  number_try: number;
  is_blocked: boolean;
  role: string;
  type: string;
  accepted_terms: boolean;
  accepted_terms_at: string | null;
  accepted_terms_version: string | null;
  department_id: number;
  subscriber_id: number;
  supplier_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Vehicle {
  id: number;
  uuid: string;
  subscriber_id: number;
  capacity_person: number;
  surname: string;
  mark: string;
  model: string;
  plate: string;
  renavam: string;
  is_people: boolean;
  is_internal_department: boolean;
  fuel_type_vehicle: string;
  in_service: boolean;
  available: boolean;
  licensing: string | null;
  from_department_id: number | null;
  to_department_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Subscriber {
  id: number;
  uuid: string;
  name: string;
  subscriber_name: string;
  cnpj: string;
  email: string;
  telephone: string;
  postal_code: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state_full_name: string;
  state_acronyms: string;
  state_logo: string | null;
  municipal_logo: string | null;
  administration_logo: string | null;
  is_success_fuel_log: boolean;
  status: "PAGO" | "ATRASADO" | "BLOQUEADO";
  user_supply_fuel:
  | "COMPLETE_FRENTISTA_PADRAO"
  | "COMPLETE_FRENTISTA_INSERCAO"
  | "COMPLETE_MOTORISTA_PADRAO"
  | "COMPLETE_MOTORISTA_INSERCAO";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Props {
  open: boolean;
  tripId: number | null;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateFuelLogDrawer({
  open,
  tripId,
  onClose,
  onCreated
}: Props) {
  const [form] = Form.useForm<FuelLogFormValues>();
  const [loading, setLoading] = useState(false);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [trip, setTrip] = useState<Tripid>();
  const [payload, setPayload] = useState<PayloadTokenDto | null>(null);

  // 1) Estado para armazenar os dados do userStorage
  const [userStorage, setUserStorage] = useState<UserStorage | null>(null);

  // 2) Ao montar o componente, recuperar userStorage do localStorage
  useEffect(() => {
    const raw = localStorage.getItem("userStorage"); // raw é string ou null
    if (raw) {
      const parsed = JSON.parse(raw) as UserStorage;
      setUserStorage(parsed);
      console.log("UserStorage carregado:", parsed.id, parsed.full_name);
    }
  }, []);

  const fetchSubscriber = async (id: number) => {
    setLoading(true);
    try {
      // supondo que seu endpoint seja GET /subscriber/:id
      const { data } = await api.get<Subscriber>(`/subscriber/default/${id}`);
      setSubscriber(data);
      console.log("Dados do Subscriber:", data);
    } catch (err) {
      console.error(err);
      message.error("Erro ao carregar dados da prefeitura");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async (q?: string) => {
    setLoadingSuppliers(true);
    try {
      const { data } = await api.get<any[]>("/supplier/fuel", { params: q ? { q } : {} });
      setSuppliers(data);
    } catch {
      message.error("Erro ao carregar fornecedores");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchTrip = async (id: number) => {
    try {
      const { data } = await api.get<Tripid>(`/trip/${id}`);
      setTrip(data);
    } catch {
      message.error("Erro ao carregar viagem");
    }
  };

  // Debounce para buscas no Select de fornecedores
  const debouncedSupplier = useCallback(debounce(fetchSuppliers, 500), []);

  // 3) Ao abrir com tripId, carrega viagem e fornecedores
  useEffect(() => {
    if (open && tripId != null) {
      fetchTrip(tripId);
      fetchSuppliers();
    }
  }, [open, tripId]);

  // 4) Ao abrir, só busca subscriber se tivermos userStorage carregado
  useEffect(() => {
    if (open && userStorage && userStorage.subscribe_id) {
      fetchSubscriber(Number(userStorage.subscribe_id));
    }
  }, [open, userStorage]);

  // 5) Define valores iniciais no form assim que payload e subscriber estiverem disponíveis
  useEffect(() => {
    if (open && payload && subscriber) {
      form.setFieldsValue({
        supply_date: moment(), // data atual
        fuel_type: "GASOLINA", // padrão GASOLINA
        supply_type: "COMPLETE", // padrão COMPLETE
        department_id: payload.department_id, // usa department_id do DTO
        is_success: subscriber.is_success_fuel_log
      });
    }
  }, [open, payload, subscriber, form]);

  // 6) Envia o form: converte datas e usa o endpoint correto (“/fuel-log”)
  const handleFinish = async (values: FuelLogFormValues) => {
    if (!tripId) return;
    setLoading(true);

    // converte moment -> ISO e monta o payload final
    const payloadToSend = {
      ...values,
      trip_id: tripId,
      vehicle_id: trip.vehicle_id,
      driver_id: trip.driver_id,
      supply_date: values.supply_date.toISOString(),
      deadline: values.deadline ? values.deadline.toISOString() : null
    };

    try {
      console.log(payloadToSend)
      await api.post("/fuel-log", payloadToSend);
      message.success("Abastecimento registrado com sucesso!");
      onClose();
      onCreated?.();
    } catch (err) {
      console.error(err);
      message.error("Erro ao registrar abastecimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Registrar Abastecimento"
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      destroyOnClose
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            Salvar
          </Button>
        </div>
      }
    >
      <Descriptions bordered column={1} layout="horizontal">
        <Descriptions.Item label="Veículo">
          {trip?.vehicle?.surname ?? "Carregando..."}
        </Descriptions.Item>
        <Descriptions.Item label="Motorista">
          {trip?.driver.full_name ?? "Carregando..."}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Linha 2: Fornecedor e “Já contabilizar” */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="supplier_id" label="Fornecedor" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Buscar fornecedor..."
                notFoundContent={loadingSuppliers ? <Spin /> : null}
                filterOption={false}
                onSearch={debouncedSupplier}
                loading={loadingSuppliers}
              >
                {suppliers.map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="is_success" label="Já contabilizar" rules={[{ required: true }]}>
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        {/* Linha 3: Datas */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="supply_date" label="Data" rules={[{ required: true }]}>
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deadline" label="Prazo">
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Linha 4: Litros, Custo, Odômetro */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="liters" label="Litros">
              <InputNumber style={{ width: "100%" }} min={0} step={0.01}      
              
                decimalSeparator=","/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cost" label="Custo">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                 step={0.01}
              
                decimalSeparator=","
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="odometer" label="Odômetro">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        {/* Linha 5: Tipo de Combustível e Tipo de Abastecimento */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="fuel_type" label="Combustível" rules={[{ required: true }]}>
              <Select>
                {["GASOLINA", "ETANOL", "DIESEL", "ELETRICO", "OUTRO"].map((f) => (
                  <Option key={f} value={f}>
                    {f}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="supply_type" label="Tipo" rules={[{ required: true }]}>
              <Select>
                {["COMPLETE", "LITRO_ESPECIFICADO"].map((t) => (
                  <Option key={t} value={t}>
                    {t === "COMPLETE" ? "Completo" : "Litro Especificado"}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}
