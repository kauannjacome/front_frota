import React, { useState } from "react";
import { Card, Form, Input, Button, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../../services/api';
import Table, { ColumnsType } from "antd/es/table";

interface Supplier {
  id: number;
  uuid: string;
  subscriber_id: number;
  name: string;
  contact_info: string;
  cnpj: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Supplier() {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get<Supplier[]>('/supplier');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      message.error('Não foi possível buscar os fornecedores.');
    }
  };

  const onFinish = async (values: any) => {
    try {
      await api.post<Supplier>('/supplier', values);
      message.success('Fornecedor adicionado com sucesso!');
      form.resetFields();
      fetchSuppliers();
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      message.error('Não foi possível adicionar o fornecedor.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/supplier/${id}`);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      message.success('Fornecedor excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      message.error('Não foi possível excluir o fornecedor.');
    }
  };

  const columns: ColumnsType<Supplier> = [
    { title: 'Nome', dataIndex: 'name', key: 'name', width: '25%' },
    { title: 'Contato', dataIndex: 'contact_info', key: 'contact_info', width: '25%' },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj', width: '20%' },
    {
      title: 'Status', dataIndex: 'deletedAt', key: 'status', width: '10%',
      render: (deletedAt: string | null) => (
        <Tag color={!deletedAt ? 'green' : 'volcano'}>
          {!deletedAt ? 'Ativo' : 'Deletado'}
        </Tag>
      ),
    },
    {
      title: 'Ações', key: 'action', width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => { message.info(`Editar fornecedor ID: ${record.id}`); }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este fornecedor?"
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
    <div style={{ display: "flex", flexDirection: "column", padding: 0, gap: "20px" }}>
      <Card>
        <Form
          form={form}
          layout="inline"
          name="supplierForm"
          onFinish={onFinish}
        >
          <Form.Item label="Nome" name="name">
            <Input placeholder="Digite o nome" />
          </Form.Item>
          <Form.Item label="CNPJ" name="cnpj">
            <Input placeholder="00.000.000/0000-00" maxLength={18} />
          </Form.Item>
          <div style={{ display: "flex", padding: 0, gap: "20px", marginTop: "20px" }}>
            <Form.Item>
              <Button type="primary" htmlType="button" onClick={fetchSuppliers}>
                <SearchOutlined /> Buscar
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <PlusOutlined /> Adicionar
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="Lista de Fornecedores">
        <Table<Supplier>
          rowKey="id"
          dataSource={suppliers}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
