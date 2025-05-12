import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, Input, Select, DatePicker, Button, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Vehicle {
  id: number;
  plate: string;
  mark?: string;
  model?: string;
  capacity_person?: number;
  available: boolean;
  in_service: boolean;
  licensing?: string;
}

export default function VehicleReport() {
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadVehicles = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await api.get<Vehicle[]>('/vehicle', { params });
      setVehicles(response.data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      message.error('Não foi possível carregar o relatório de veículos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const onFinish = (values: any) => {
    const { plate, mark, model, availability, serviceStatus, licensing } = values;
    const params: any = {};
    if (plate) params.plate_like = plate;
    if (mark) params.mark = mark;
    if (model) params.model = model;
    if (availability !== undefined) params.available = availability;
    if (serviceStatus !== undefined) params.in_service = serviceStatus;
    if (licensing && licensing.length === 2) {
      params.licensing_from = licensing[0].toISOString();
      params.licensing_to = licensing[1].toISOString();
    }
    loadVehicles(params);
  };

  const columns: ColumnsType<Vehicle> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Placa', dataIndex: 'plate', key: 'plate', width: 120 },
    { title: 'Marca', dataIndex: 'mark', key: 'mark', width: 120 },
    { title: 'Modelo', dataIndex: 'model', key: 'model', width: 120 },
    { title: 'Capacidade', dataIndex: 'capacity_person', key: 'capacity_person', width: 100 },
    {
      title: 'Disponível', dataIndex: 'available', key: 'available', width: 100,
      render: available => available ? <Tag color="green">Sim</Tag> : <Tag color="volcano">Não</Tag>
    },
    {
      title: 'Em Serviço', dataIndex: 'in_service', key: 'in_service', width: 100,
      render: in_service => in_service ? <Tag color="blue">Sim</Tag> : <Tag color="orange">Não</Tag>
    },
    {
      title: 'Licenciamento', dataIndex: 'licensing', key: 'licensing', width: 160,
      render: date => date ? moment(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Ações', key: 'actions', width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/vehicle/${record.id}`)}>
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
            <Col span={6}>
              <Form.Item name="plate" label="Placa">
                <Input placeholder="Digite parte da placa" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="mark" label="Marca">
                <Input placeholder="Marca do veículo" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="model" label="Modelo">
                <Input placeholder="Modelo do veículo" allowClear />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="availability" label="Disponível">
                <Select allowClear placeholder="Selecione">
                  <Option value={true}>Sim</Option>
                  <Option value={false}>Não</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="serviceStatus" label="Em Serviço">
                <Select allowClear placeholder="Selecione">
                  <Option value={true}>Sim</Option>
                  <Option value={false}>Não</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="licensing" label="Licenciamento">
                <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
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

      <Card style={{ marginTop: 24 }} title="Relatório de Veículos">
        <Table<Vehicle>
          rowKey="id"
          dataSource={vehicles}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
