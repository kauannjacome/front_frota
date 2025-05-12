import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, DatePicker, Select, Button, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FuelLog {
  id: number;
  supply_date?: string;
  vehicle_plate?: string;
  driver_name?: string;
  liters?: number;
  cost?: number;
  fuel_type: string;
  supply_type: string;
  attendant_name?: string;
  status_viewed: boolean;
}

export default function FuelLogReport() {
  const [form] = Form.useForm();
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadLogs = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await api.get<FuelLog[]>('/fuel-log', { params });
      setLogs(response.data);
    } catch (error) {
      console.error('Erro ao carregar registros de abastecimento:', error);
      message.error('Não foi possível carregar o relatório de abastecimentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const onFinish = (values: any) => {
    const { period, vehicle, driver, fuelType, supplyType } = values;
    const params: any = {};
    if (period && period.length === 2) {
      params.supply_date_from = period[0].toISOString();
      params.supply_date_to = period[1].toISOString();
    }
    if (vehicle) params.vehicle_id = vehicle;
    if (driver) params.driver_id = driver;
    if (fuelType) params.fuel_type = fuelType;
    if (supplyType) params.supply_type = supplyType;
    loadLogs(params);
  };

  const columns: ColumnsType<FuelLog> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Data', dataIndex: 'supply_date', key: 'supply_date', width: 160,
      render: date => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-'
    },
    { title: 'Veículo', dataIndex: 'vehicle_plate', key: 'vehicle_plate', width: 120 },
    { title: 'Motorista', dataIndex: 'driver_name', key: 'driver_name', width: 150 },
    { title: 'Litros', dataIndex: 'liters', key: 'liters', width: 90 },
    { title: 'Valor (R$)', dataIndex: 'cost', key: 'cost', width: 100,
      render: cost => cost != null ? cost.toFixed(2) : '-' },
    { title: 'Tipo Comb.', dataIndex: 'fuel_type', key: 'fuel_type', width: 120 },
    { title: 'Modo', dataIndex: 'supply_type', key: 'supply_type', width: 150 },
    { title: 'Atendente', dataIndex: 'attendant_name', key: 'attendant_name', width: 150 },
    { title: 'Visto', dataIndex: 'status_viewed', key: 'status_viewed', width: 80,
      render: viewed => viewed ? <Tag color="green">Sim</Tag> : <Tag color="volcano">Não</Tag>
    },
    {
      title: 'Ações', key: 'actions', width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/fuel-log/${record.id}`)}>
          Detalhes
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="period" label="Período">
                <RangePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="vehicle" label="Veículo">
                <Select placeholder="Selecione veículo" allowClear>
                  {/* Carregar opções dinamicamente */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="driver" label="Motorista">
                <Select placeholder="Selecione motorista" allowClear>
                  {/* Carregar opções dinamicamente */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="fuelType" label="Tipo Combustível">
                <Select placeholder="Selecione tipo" allowClear>
                  <Option value="GASOLINA">Gasolina</Option>
                  <Option value="DIESEL">Diesel</Option>
                  <Option value="ETANOL">Etanol</Option>
                  <Option value="ELETRICO">Elétrico</Option>
                  <Option value="OUTRO">Outro</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="supplyType" label="Modo Abastecimento">
                <Select placeholder="Selecione modo" allowClear>
                  <Option value="COMPLETE">Completo</Option>
                  <Option value="LITRO_ESPECIFICADO">Litro Especificado</Option>
                  <Option value="COMPLETE_SEM_CADASTRO">Completo s/ Cadastro</Option>
                  <Option value="LITRO_ESPECIFICADO_SEM_CADASTRO">Litro s/ Cadastro</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gerar Relatório
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: 24 }} title="Relatório de Abastecimentos">
        <Table<FuelLog>
          rowKey="id"
          dataSource={logs}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
