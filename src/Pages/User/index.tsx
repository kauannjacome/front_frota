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
  Row,
  Col,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../services/api';
import Table, { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import UserDetailsDrawer from "./components/UserDetailsDrawer";

const { Option } = Select;

interface User {
  id: number;
  uuid: string;
  cpf: string;
  full_name: string;
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const navigate = useNavigate();
  const fetchUsers = async (values?: any) => {
    try {
      // Você pode passar params para filtro no back-end, ex: cpf, name, role...
      const response = await api.get<User[]>('/user/search', {
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
    { title: 'Nome', dataIndex: 'full_name', key: 'full_name', width: '20%' },
    { title: 'CPF', dataIndex: 'cpf', key: 'cpf', width: '15%' },

    { title: 'E-mail', dataIndex: 'email', key: 'email', width: '20%' },

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
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
             onClick={(e) => {
              setSelectedUserId(record.id);
              setDrawerOpen(true)

            }}
          />
          
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {

            navigate(`/user/edit/${record.id}`);
            }}
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={async () => {

              await onDelete(record.id);
            }}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}

            />
          </Popconfirm>
        </Space>
      ),


    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="userForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="full_name">
                <Input
                  placeholder="Digite o nome"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="CPF" name="cpf">
                <Input
                  placeholder="Digite o CPF"
                  maxLength={11}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Cargo" name="role">
                <Select
                  placeholder="Selecione o cargo"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Select.Option value="ADMIN_LOCAL">ADMIN_LOCAL</Select.Option>
                  <Select.Option value="ADMIN_GLOBAL">ADMIN_GLOBAL</Select.Option>
                  <Select.Option value="USER">USER</Select.Option>
                  {/* Adicione mais roles conforme seu enum */}
                </Select>
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
                 color="orange" variant="solid"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() =>  navigate('/user/create')}
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
            <UserDetailsDrawer
              open={drawerOpen}
              user_id={selectedUserId}
              onClose={() => {
      
                setDrawerOpen(false);
                setSelectedUserId(null);
              }
      
              }
            />
    </div>
  );
}
