import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, DatePicker, Select, Button, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Trip {  
  id: number;
  purpose?: string;
  start_state?: string;
  start_city?: string;
  end_state?: string;
  end_city?: string;
  start_time?: string;
  end_time?: string;
  status: string;
  driver_name?: string;
  vehicle_plate?: string;
  request_date: string;
}

export default function TripReport() {
  const [form] = Form.useForm();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadTrips = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await api.get<Trip[]>('/trip', { params });
      setTrips(response.data);
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
      message.error('Não foi possível carregar o relatório de viagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // carrega inicialmente sem filtros
    loadTrips();
  }, []);

  const onFinish = (values: any) => {
    const { period, status } = values;
    const params: any = {};
    if (period && period.length === 2) {
      params.start_time_from = period[0].toISOString();
      params.start_time_to = period[1].toISOString();
    }
    if (status) {
      params.status = status;
    }
    loadTrips(params);
  };

  const columns: ColumnsType<Trip> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Propósito', dataIndex: 'purpose', key: 'purpose', width: 150 },
    {
      title: 'Início', dataIndex: 'start_time', key: 'start_time', width: 160,
      render: date => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-'
    },
    {
      title: 'Fim', dataIndex: 'end_time', key: 'end_time', width: 160,
      render: date => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-'
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 120,
      render: status => {
        let color = 'default';
        switch (status) {
          case 'APROVADO': color = 'green'; break;
          case 'PENDENTE': color = 'orange'; break;
          case 'EM_ANDAMENTO': color = 'blue'; break;
          case 'CONCLUIDO': color = 'purple'; break;
          case 'CANCELADO': color = 'red'; break;
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Motorista', dataIndex: 'driver_name', key: 'driver_name', width: 150 },
    { title: 'Veículo', dataIndex: 'vehicle_plate', key: 'vehicle_plate', width: 120 },
    {
      title: 'Ações', key: 'actions', width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/trip/${record.id}/details`)}>
          Ver Detalhes
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
            <Col span={6}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Selecione status" allowClear>
                  <Option value="PENDENTE">Pendente</Option>
                  <Option value="APROVADO">Aprovado</Option>
                  <Option value="EM_ANDAMENTO">Em Andamento</Option>
                  <Option value="CONCLUIDO">Concluído</Option>
                  <Option value="CANCELADO">Cancelado</Option>
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

      <Card style={{ marginTop: 24 }} title="Relatório de Viagens">
        <Table<Trip>
          rowKey="id"
          dataSource={trips}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
