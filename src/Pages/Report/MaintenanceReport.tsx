import  { useEffect, useState } from 'react';
import { Card, Form, Row, Col, DatePicker, Select, Button, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Maintenance {
  id: number;
  order_date: string;
  date: string;
  vehicle_plate?: string;
  type: string;
  description?: string;
  cost?: number;
  next_due?: string;
  status: string;
  supplier_name?: string;
}

export default function MaintenanceReport() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadVehicles = async () => {
    // if needed, load vehicles for filter options
  };

  const loadRecords = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await api.get<Maintenance[]>('/maintenance', { params });
      setRecords(response.data);
    } catch (err) {
      console.error('Erro ao carregar manutenção:', err);
      message.error('Não foi possível carregar o relatório de manutenção.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
    loadVehicles();
  }, []);

  const onFinish = (values: any) => {
    const { period, status, type } = values;
    const params: any = {};
    if (period && period.length === 2) {
      params.date_from = period[0].toISOString();
      params.date_to = period[1].toISOString();
    }
    if (status) params.status = status;
    if (type) params.type = type;
    loadRecords(params);
  };

  const columns: ColumnsType<Maintenance> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Data Ordem', dataIndex: 'order_date', key: 'order_date', width: 160,
      render: d => d ? moment(d).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Data Manutenção', dataIndex: 'date', key: 'date', width: 160,
      render: d => d ? moment(d).format('DD/MM/YYYY') : '-'
    },
    { title: 'Veículo', dataIndex: 'vehicle_plate', key: 'vehicle_plate', width: 120 },
    { title: 'Tipo', dataIndex: 'type', key: 'type', width: 140 },
    { title: 'Descrição', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Custo (R$)', dataIndex: 'cost', key: 'cost', width: 100,
      render: v => v != null ? v.toFixed(2) : '-'
    },
    {
      title: 'Próxima (Data)', dataIndex: 'next_due', key: 'next_due', width: 140,
      render: d => d ? moment(d).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 120,
      render: s => {
        let color = 'default';
        switch (s) {
          case 'APROVADO': color = 'green'; break;
          case 'PENDENTE': color = 'orange'; break;
          case 'EM_ANDAMENTO': color = 'blue'; break;
          case 'CONCLUIDO': color = 'purple'; break;
          case 'CANCELADO': color = 'red'; break;
        }
        return <Tag color={color}>{s}</Tag>;
      }
    },
    {
      title: 'Fornecedora', dataIndex: 'supplier_name', key: 'supplier_name', width: 150
    },
    {
      title: 'Ações', key: 'actions', width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/maintenance/${record.id}`)}>
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
                <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="Tipo">
                <Select placeholder="Selecione tipo" allowClear>
                  <Option value="PREVENTIVA">Preventiva</Option>
                  <Option value="CORRETIVA">Corretiva</Option>
                  <Option value="INSPECAO">Inspeção</Option>
                </Select>
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

      <Card style={{ marginTop: 24 }} title="Relatório de Manutenção">
        <Table<Maintenance>
          rowKey="id"
          dataSource={records}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
