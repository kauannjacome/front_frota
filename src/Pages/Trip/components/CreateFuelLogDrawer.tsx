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
  message
} from "antd";
import moment from "moment";
import debounce from "lodash/debounce";
import api from "../../../services/api";
import { jwtDecode } from "jwt-decode";            // 1) named export, pois não há default export
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
  fuel_type: "GASOLINA" | "ETANOL" | "DIESEL" | "ELETRICO" | "OUTRO";
  supply_type?: "COMPLETE" | "LITRO_ESPECIFICADO";
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

  // estados para listas e loaders
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [drivers, setDrivers] = useState<any[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [payload, setPayload] = useState<PayloadTokenDto | null>(null);

  // 1) Decodifica o JWT e armazena o payload
  useEffect(() => {
    const token = localStorage.getItem("authTokenFrota");
    if (!token) return;
    try {
      const decoded = jwtDecode<PayloadTokenDto>(token);
      setPayload(decoded);
    } catch (err) {
      console.error("Token inválido:", err);
    }
  }, []);

  // Funções de fetch para veículos, motoristas, fornecedores e departamentos
  const fetchVehicles = async (q?: string) => {
    setLoadingVehicles(true);
    try {
      const { data } = await api.get<any[]>("/vehicle", { params: q ? { q } : {} });
      setVehicles(data);
    } catch {
      message.error("Erro ao carregar veículos");
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchDrivers = async (q?: string) => {
    setLoadingDrivers(true);
    try {
      const { data } = await api.get<any[]>("/user/driver", { params: q ? { q } : {} });
      setDrivers(data);
    } catch {
      message.error("Erro ao carregar motoristas");
    } finally {
      setLoadingDrivers(false);
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

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const { data } = await api.get<any[]>("/department");
      setDepartments(data);
    } catch {
      message.error("Erro ao carregar departamentos");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchTrip = async (id: number) => {
    try {
      const { data } = await api.get<Trip>(`/trip/${id}`);
      setTrip(data);
    } catch {
      message.error("Erro ao carregar viagem");
    }
  };

  // Debounce para buscas no Select
  const debouncedVehicle  = useCallback(debounce(fetchVehicles, 500), []);
  const debouncedDriver   = useCallback(debounce(fetchDrivers,  500), []);
  const debouncedSupplier = useCallback(debounce(fetchSuppliers,500), []);

  // 2) Quando a Drawer abre, carrega a lista de departamentos
  useEffect(() => {
    if (open) fetchDepartments();
  }, [open]);

  // 3) Ao abrir com tripId, carrega veículos, motoristas, fornecedores e dados da viagem
  useEffect(() => {
    if (open && tripId != null) {
      fetchVehicles();
      fetchDrivers();
      fetchSuppliers();
      fetchTrip(tripId);
    }
  }, [open, tripId]);

  // 4) Define valores iniciais no form assim que payload estiver disponível
  useEffect(() => {
    if (open && payload) {
      form.setFieldsValue({
        supply_date: moment(),                   // data atual
        fuel_type: "GASOLINA",                   // padrão GASOLINA
        supply_type: "COMPLETE",                 // padrão COMPLETE
        department_id: payload.departament_id    // usa departament_id do DTO
      });
    }
  }, [open, payload, form]);

  // 5) Pré-preenche veículo e motorista após buscar a viagem
  useEffect(() => {
    if (trip) {
      form.setFieldsValue({
        vehicle_id: trip.vehicle_id,
        driver_id: trip.driver_id
      });
    }
  }, [trip, form]);

  // 6) Envia o form: converte datas e usa o endpoint correto (“/fuel-log”)
  const handleFinish = async (values: FuelLogFormValues) => {
    if (!tripId) return;
    setLoading(true);

    // converte moment -> ISO e monta o payload final
    const payloadToSend = {
      ...values,
      trip_id: tripId,
      supply_date: values.supply_date.toISOString(),
      deadline: values.deadline ? values.deadline.toISOString() : null
    };

    try {
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Linha 1: Veículo e Motorista */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="vehicle_id" label="Veículo" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Buscar veículo..."
                notFoundContent={loadingVehicles ? <Spin /> : null}
                filterOption={false}
                onSearch={debouncedVehicle}
                loading={loadingVehicles}
              >
                {vehicles.map(v => (
                  <Option key={v.id} value={v.id}>
                    {`${v.mark} ${v.model}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="driver_id" label="Motorista" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Buscar motorista..."
                notFoundContent={loadingDrivers ? <Spin /> : null}
                filterOption={false}
                onSearch={debouncedDriver}
                loading={loadingDrivers}
              >
                {drivers.map(d => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Linha 2: Fornecedor e Departamento */}
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
                {suppliers.map(s => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department_id" label="Departamento" rules={[{ required: true }]}>
              <Select loading={loadingDepartments}>
                {departments.map(d => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Linha 3: Datas */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="supply_date" label="Data" rules={[{ required: true }]}>
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deadline" label="Prazo">
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Linha 4: Litros, Custo, Odômetro */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="liters" label="Litros">
              <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cost" label="Custo">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={v => (v ? `R$ ${v}` : "")}
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
                {["GASOLINA", "ETANOL", "DIESEL", "ELETRICO", "OUTRO"].map(f => (
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
                {["COMPLETE", "LITRO_ESPECIFICADO"].map(t => (
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
