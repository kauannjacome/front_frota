import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Tag,
  Popconfirm,
  Select,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../../services/api';
import Table, { ColumnsType } from "antd/es/table";

const { Option } = Select;

interface User {
  id: number;
  uuid: string;
  cpf: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  role: string;
  is_blocked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function User() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async (values?: any) => {
    try {
      // Você pode passar params para filtro no back-end, ex: cpf, name, role...
      const response = await api.get<User[]>('/user', {
        params: values,
      });
      setUsers(response.data);
      message.success('Usuários carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      message.error('Não foi possível buscar os usuários.');
    }
  };

  const onFinish = (values: any) => {
    fetchUsers(values);
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/user/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      message.success('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      message.error('Não foi possível excluir o usuário.');
    }
  };

  const columns: ColumnsType<User> = [
    { title: 'CPF', dataIndex: 'cpf', key: 'cpf', width: '15%' },
    { title: 'Nome', dataIndex: 'name', key: 'name', width: '20%' },
    { title: 'E-mail', dataIndex: 'email', key: 'email', width: '20%' },
    { title: 'Telefone', dataIndex: 'phone_number', key: 'phone_number', width: '15%' },
    {
      title: 'Cargo',
      dataIndex: 'role',
      key: 'role',
      width: '10%',
      render: role => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Bloqueado',
      dataIndex: 'is_blocked',
      key: 'is_blocked',
      width: '10%',
      render: blocked => (
        <Tag color={blocked ? 'volcano' : 'green'}>
          {blocked ? 'Sim' : 'Não'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            onClick={() => message.info(`Editando usuário ID: ${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir"
            description="Tem certeza que deseja remover este usuário?"
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
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <Form
          form={form}
          layout="inline"
          name="userForm"
          onFinish={onFinish}
        >
          <Form.Item label="Nome" name="name">
            <Input placeholder="Digite o nome" />
          </Form.Item>
          <Form.Item label="CPF" name="cpf">
            <Input placeholder="Digite o CPF" maxLength={11} />
          </Form.Item>

          <Form.Item label="Cargo" name="role">
            <Select placeholder="Selecione o cargo" style={{ width: 160 }}>
              <Option value="ADMIN_LOCAL">ADMIN_LOCAL</Option>
              <Option value="ADMIN_GLOBAL">ADMIN_GLOBAL</Option>
              <Option value="USER">USER</Option>
              {/* Adicione mais roles conforme seu enum */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => message.info('Navegar para criação de usuário')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Usuários">
        <Table<User>
          rowKey="id"
          dataSource={users}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
