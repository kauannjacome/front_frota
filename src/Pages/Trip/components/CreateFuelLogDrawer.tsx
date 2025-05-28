import { Drawer, Form, Row, Col, Select, DatePicker, InputNumber, Button, Spin, message } from "antd";
import moment from "moment";
import debounce from "lodash/debounce";
import api from "../../../services/api";
import { useEffect, useState, useCallback } from "react";
import { Trip } from "../../../types";
import { PayloadTokenDto } from '../../../types';
const { Option } = Select;
import { jwtDecode } from "jwt-decode";
export interface FuelLogFormValues {
  vehicle_id?: number;
  driver_id?: number;
  authorizer_id?: number;
  attendant_id?: number;
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
interface UserStorage {
  id: string;
  name: string;
  role: string;
  subscribe_name: string;
}

export default function CreateFuelLogDrawer({ open, tripId, onClose, onCreated }: Props) {
  const [form] = Form.useForm<FuelLogFormValues>();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [trip, setTrip] = useState<Trip>(null);

  const [payload, setPayload] = useState<PayloadTokenDto | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authTokenFrota');
    if (!token) {
      console.warn('Nenhum token encontrado');
      return;
    }

    try {
      // decodifica e já tipa como PayloadTokenDto
      const decoded = jwtDecode<PayloadTokenDto>(token);
      setPayload(decoded);
    } catch (err) {
      console.error('Token inválido:', err);
    }
  }, []);

  // Fetch helpers with proper typing
  const fetchVehicles = async (q?: string) => {
    setLoadingVehicles(true);
    try {
      const response = await api.get<any[]>('/vehicle', { params: q ? { q } : {} });
      setVehicles(response.data);
    } catch {
      message.error('Erro ao carregar veículos');
    } finally { setLoadingVehicles(false); }
  };

  const fetchDrivers = async (q?: string) => {
    setLoadingDrivers(true);
    try {
      const response = await api.get<any[]>('/user/driver', { params: q ? { q } : {} });
      setDrivers(response.data);
    } catch {
      message.error('Erro ao carregar motoristas');
    } finally { setLoadingDrivers(false); }
  };

  const fetchSuppliers = async (q?: string) => {
    setLoadingSuppliers(true);
    try {
      const response = await api.get<any[]>('/supplier/fuel', { params: q ? { q } : {} });
      setSuppliers(response.data);
    } catch {
      message.error('Erro ao carregar fornecedores');
    } finally { setLoadingSuppliers(false); }
  };

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const response = await api.get<any[]>('/department');
      setDepartments(response.data);
    } catch {
      message.error('Erro ao carregar departamentos');
    } finally { setLoadingDepartments(false); }
  };

  const fetchTrip = async (id: number) => {
    try {
      const response = await api.get<Trip>(`/trip/${id}`);
      setTrip(response.data);
      console.log(response.data)
    } catch {
      message.error('Erro ao carregar dados da viagem');
    }
  };
  const debouncedVehicle = useCallback(debounce(fetchVehicles, 500), []);
  const debouncedDriver = useCallback(debounce(fetchDrivers, 500), []);
  const debouncedSupplier = useCallback(debounce(fetchSuppliers, 500), []);

  useEffect(() => {
    if (trip) {
      form.setFieldsValue({ vehicle_id: trip.vehicle_id, driver_id: trip.driver_id });
    }
  }, [trip]);

  // Initial load when drawer opens
  useEffect(() => {
    if (open && tripId) {
      fetchVehicles();
      fetchDrivers();
      fetchSuppliers();
      fetchDepartments();
      fetchTrip(tripId);


      form.setFieldsValue({ supply_date: moment(), fuel_type: 'GASOLINA', supply_type: 'COMPLETE',department_id:payload.departament_id });
    }
  }, [open, tripId]);

  const handleFinish = async (values: FuelLogFormValues) => {
    if (!tripId) return;
    setLoading(true);
    try {
      await api.post('/fuel_log', { ...values, trip_id: tripId });
      message.success('Abastecimento registrado');
      onClose();
      onCreated?.();
    } catch {
      message.error('Erro ao registrar abastecimento');
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
      footer={<div style={{ textAlign: 'right' }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
        <Button type="primary" onClick={() => form.submit()} loading={loading}>Salvar</Button>
      </div>}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="vehicle_id" label="Veículo" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Buscar..."
                notFoundContent={loadingVehicles ? <Spin /> : null}
                filterOption={false}
                onSearch={debouncedVehicle}
                loading={loadingVehicles}
              >
                {vehicles.map(v => <Option key={v.id} value={v.id}>{`${v.mark} ${v.model}`}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="driver_id" label="Motorista" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Buscar..."
                notFoundContent={loadingDrivers ? <Spin /> : null}
                filterOption={false}
                onSearch={debouncedDriver}
                loading={loadingDrivers}
              >
                {drivers.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="supplier_id" label="Fornecedor" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Buscar..."
                notFoundContent={loadingSuppliers ? <Spin /> : null}
                filterOption={false}
                onSearch={debouncedSupplier}
                loading={loadingSuppliers}
              >
                {suppliers.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department_id" label="Departamento" rules={[{ required: true }]}>
              <Select loading={loadingDepartments}>
                {departments.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="supply_date" label="Data" rules={[{ required: true }]}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deadline" label="Prazo">
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="liters" label="Litros">
              <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cost" label="Custo">
              <InputNumber style={{ width: '100%' }} min={0} formatter={v => v ? `R$ ${v}` : ''} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="odometer" label="Odômetro">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="fuel_type" label="Combustível" rules={[{ required: true }]}>
              <Select>
                {['GASOLINA', 'ETANOL', 'DIESEL', 'ELETRICO', 'OUTRO'].map(f => <Option key={f} value={f}>{f}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="supply_type" label="Tipo" rules={[{ required: true }]}>
              <Select>
                {['COMPLETE', 'LITRO_ESPECIFICADO'].map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}
