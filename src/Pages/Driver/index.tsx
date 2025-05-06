import React, { useState } from "react";
import { Card, Form, Input, Button, message, Space, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from '../../services/api';

interface Driver {
  id: number;
  subscriber_id: number;
  department_id: number | null;
  name: string;
  license_number: string;
  license_valid_until: string;
  telefone: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Drive() {
  const [form] = Form.useForm();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega motoristas (opcionalmente com filtros)
  const loadDrivers = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await api.get<Driver[]>('/driver', { params });
      setDrivers(response.data);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      message.error('Não foi possível buscar motoristas.');
    } finally {
      setLoading(false);
    }
  };

  // Busca utilizando os valores do form
  const onSearch = (values: any) => {
    loadDrivers(values);
  };

  // Adiciona um novo motorista
  const onAdd = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        subscriber_id: 1, // ajuste conforme contexto
        department_id: values.department_id || null,
        license_valid_until: values.license_valid_until,
      };
      const resp = await api.post<Driver>('/driver', payload);
      setDrivers(prev => [resp.data, ...prev]);
      message.success('Motorista adicionado com sucesso!');
      form.resetFields();
    } catch (error) {
      console.error('Erro ao adicionar motorista:', error);
      message.error('Não foi possível adicionar o motorista.');
    }
  };

  // Remove (soft delete) um motorista
  const onDelete = async (id: number) => {
    try {
      await api.delete(`/driver/${id}`);
      setDrivers(prev => prev.filter(d => d.id !== id));
      message.success('Motorista excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      message.error('Não foi possível excluir o motorista.');
    }
  };

  // Definição das colunas da tabela
  const columns: ColumnsType<Driver> = [
    { title: 'Nome', dataIndex: 'name', key: 'name', width: '25%' },
    { title: 'CNH', dataIndex: 'license_number', key: 'license_number', width: '20%' },
    {
      title: 'Validade CNH',
      dataIndex: 'license_valid_until',
      key: 'license_valid_until',
      width: '15%',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone', width: '15%' },
    { title: 'Tipo', dataIndex: 'type', key: 'type', width: '10%' },
    {
      title: 'Ações',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button onClick={() => message.info(`Editando motorista ID: ${record.id}`)}>
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este motorista?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <Form form={form} layout="inline" onFinish={onSearch} style={{ alignItems: 'flex-end' }}>
          <Form.Item label="Nome" name="name">
            <Input placeholder="Digite o nome" />
          </Form.Item>
          <Form.Item label="CNH" name="license_number">
            <Input placeholder="Número da CNH" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                <SearchOutlined /> Buscar
              </Button>
              <Button type="primary" onClick={onAdd}>
                <PlusOutlined /> Adicionar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Motoristas">
        <Table<Driver>
          rowKey="id"
          dataSource={drivers}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
