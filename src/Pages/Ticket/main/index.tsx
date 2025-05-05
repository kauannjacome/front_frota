import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Space, Popconfirm, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import api from '../../../services/api';

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

    { title: 'Fornecedor', dataIndex: 'supplier_id', key: 'supplier_id', width: '10%' },
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <Form form={form} layout="inline" name="ticketForm" onFinish={onFinish}>
          <Form.Item label="Fornecedor" name="supplier_id">
            <Input placeholder="ID do fornecedor" />
          </Form.Item>
          <Form.Item label="Passageiro" name="passenger_id">
            <Input placeholder="ID do passageiro" />
          </Form.Item>
          <Form.Item label="Estado Origem" name="start_state">
            <Input placeholder="Ex: EX" maxLength={2} />
          </Form.Item>
          <Form.Item label="Cidade Origem" name="start_city">
            <Input placeholder="Digite a cidade de origem" />
          </Form.Item>
          <Form.Item label="Estado Destino" name="end_state">
            <Input placeholder="Ex: EX" maxLength={2} />
          </Form.Item>
          <Form.Item label="Cidade Destino" name="end_city">
            <Input placeholder="Digite a cidade de destino" />
          </Form.Item>
          <Form.Item label="Data Viagem" name="travel_date">
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <SearchOutlined /> Buscar
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
