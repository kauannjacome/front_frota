import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Space, Popconfirm, DatePicker, Col, Row } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import api from '../../../services/api';
import { useSupplierStore } from '../../../common/store/SupplierStore';

interface Ticket {
  id: number;
  uuid: string;
  supplier_id: number;
  passenger_id: number;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  travel_date: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Ticket() {
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const suppliers = useSupplierStore(state => state.suppliers)?? [];
  const fetchSuppliers = useSupplierStore(state => state.fetchSuppliers);
  const onFinish = async (values: any) => {
    try {
      const params = {
        supplier_id: values.supplier_id,
        passenger_id: values.passenger_id,
        start_state: values.start_state,
        start_city: values.start_city,
        end_state: values.end_state,
        end_city: values.end_city,
        travel_date: values.travel_date ? values.travel_date.format('YYYY-MM-DD') : undefined,
      };
      const response = await api.get<Ticket[]>('/ticket', { params });
      setTickets(response.data);
      message.success('Passagens carregadas com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar passagens:', error);
      message.error('Não foi possível carregar as passagens.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/ticket/${id}`);
      setTickets(prev => prev.filter(t => t.id !== id));
      message.success('Passagem excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir passagem:', error);
      message.error('Não foi possível excluir a passagem.');
    }
  };

  const columns: ColumnsType<Ticket> = [

    {
      title: 'Fornecedor',
      dataIndex: 'supplier_id',
      key: 'supplier_id',
      width: '15%',
      render: (supplierId: number) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.name : supplierId;
      },
    },
    { title: 'Passageiro', dataIndex: 'passenger_id', key: 'passenger_id', width: '10%' },
    {
      title: 'Origem',
      key: 'origin',
      render: (_, record) => `${record.start_state} - ${record.start_city}`,
      width: '15%',
    },
    {
      title: 'Destino',
      key: 'destination',
      render: (_, record) => `${record.end_state} - ${record.end_city}`,
      width: '15%',
    },
    {
      title: 'Data de Viagem',
      dataIndex: 'travel_date',
      key: 'travel_date',
      render: date => date || '-',
      width: '10%'
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" onClick={() => message.info(`Editando passagem ID: ${record.id}`)}>
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta passagem?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" danger>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: '15%'
    },
  ];

    // Chama fetchSuppliers só uma vez, ao montar o componente
    useEffect(() => {
      fetchSuppliers();
    }, [fetchSuppliers]);

    console.log(suppliers)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="ticketForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Fornecedor" name="supplier_id">
                <Input
                  placeholder="ID do fornecedor"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Passageiro" name="passenger_id">
                <Input
                  placeholder="ID do passageiro"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Data Viagem" name="travel_date">
                <DatePicker
                  style={{ width: '100%' }}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              Buscar
            </Button>
            <Button
               color="cyan" variant="solid"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => message.info('Abrir formulário de criação')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Lista de Passagens">
        <Table<Ticket>
          rowKey="id"
          dataSource={tickets}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
