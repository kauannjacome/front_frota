import  { useEffect, useState } from 'react';
import { Card, Form, Row, Col, DatePicker, Select, Button, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DailyExpense {
  id: number;
  created_at: string;
  receiver_name: string;
  trip_id?: number;
  days?: number;
  daily_amount?: number;
  value?: number;
  description?: string;
}

interface Driver {
  id: number;
  name: string;
}

export default function DailyAllowanceReport() {
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    try {
      const response = await api.get<Driver[]>('/user', { params: { role: 'DRIVE' } });
      setDrivers(response.data);
    } catch (err) {
      console.error('Erro ao carregar motoristas', err);
      message.error('Não foi possível carregar a lista de motoristas.');
    }
  };

  const loadExpenses = async (params: any = {}) => {
    setLoading(true);
    try {
      const resp = await api.get<DailyExpense[]>('/expense', {
        params: { type: 'DIARIA', ...params },
      });
      setExpenses(resp.data);
    } catch (error) {
      console.error('Erro ao carregar diárias:', error);
      message.error('Não foi possível carregar o relatório de diárias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    loadExpenses();
  }, []);

  const onFinish = (values: any) => {
    const { period, driver } = values;
    const params: any = {};
    if (period && period.length === 2) {
      params.created_at_from = period[0].toISOString();
      params.created_at_to = period[1].toISOString();
    }
    if (driver !== undefined) {
      params.user_receiver_id = driver;
    }
    loadExpenses(params);
  };

  const columns: ColumnsType<DailyExpense> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: 'Data', dataIndex: 'created_at', key: 'created_at', width: 160,
      render: d => d ? moment(d).format('DD/MM/YYYY HH:mm') : '-',
    },
    { title: 'Motorista', dataIndex: 'receiver_name', key: 'receiver_name', width: 150 },
    {
      title: 'Viagem', dataIndex: 'trip_id', key: 'trip_id', width: 100,
      render: id => id ? <Button type="link" onClick={() => navigate(`/trip/${id}/details`)}>{id}</Button> : '-',
    },
    { title: 'Dias', dataIndex: 'days', key: 'days', width: 80 },
    {
      title: 'Valor Diário (R$)', dataIndex: 'daily_amount', key: 'daily_amount', width: 120,
      render: v => v != null ? v.toFixed(2) : '-',
    },
    {
      title: 'Total (R$)', dataIndex: 'value', key: 'value', width: 120,
      render: v => v != null ? v.toFixed(2) : '-',
    },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
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
              <Form.Item name="driver" label="Motorista">
                <Select placeholder="Selecione motorista" allowClear>
                  {drivers.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
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

      <Card style={{ marginTop: 24 }} title="Relatório de Diárias de Motorista">
        <Table<DailyExpense>
          rowKey="id"
          dataSource={expenses}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
