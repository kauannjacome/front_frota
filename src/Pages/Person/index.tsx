// src/components/Person.tsx
import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Col,
  Row,
  Dropdown,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  EllipsisOutlined,
  PrinterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from '../../services/api';
import Table, { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import PersonDetailsDrawer from "./components/PersonDetailsDrawer";

interface Person {
  id: number;
  uuid: string;
  cpf: string;
  cns?: string | null;
  full_name: string;
  social_name?: string | null;
  birth_date: string;
  death_date?: string | null;
  mother_name?: string | null;
  father_name?: string | null;
  postal_code?: string | null;
  state?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street_type?: string | null;
  street_name?: string | null;
  house_number?: string | null;
  address_complement?: string | null;
  reference_point?: string | null;
  phone_number?: string | null;
  email?: string | null;
  sex?: string | null;
  termsAccepted: boolean;
  subscriber_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Person() {
  const [form] = Form.useForm();
  const [persons, setPersons] = useState<Person[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Buscar pessoas com base nos filtros do formulário
  const onFinish = async (values: any) => {
    try {
      const response = await api.get<Person[]>('/person/search', { params: values });
      setPersons(response.data);
      message.success('Busca realizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao buscar pessoas:', error);
      message.error('Não foi possível buscar as pessoas.');
    }
  };

  // Excluir (soft delete) pessoa
  const onDelete = async (id: number) => {
    try {
      await api.delete(`/person/${id}`);
      setPersons(prev => prev.filter(p => p.id !== id));
      message.success('Pessoa excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir pessoa:', error);
      message.error('Não foi possível excluir a pessoa.');
    }
  };

  // Colunas da tabela
  const columns: ColumnsType<Person> = [
    { title: 'Nome Completo', dataIndex: 'full_name', key: 'full_name', width: '25%' },
    { title: 'CPF', dataIndex: 'cpf', key: 'cpf', width: '15%' },
    {
      title: 'Nascimento',
      dataIndex: 'birth_date',
      key: 'birth_date',
      width: '15%',
      render: (d: string) => new Date(d).toLocaleDateString(),
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
              setSelectedPersonId(record.id);
              setDrawerOpen(true)

            }}
          />


          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {

               navigate(`/person/edit/${record.id}`);
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

          },
        ];

   

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Formulário de busca e adição */}
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="personForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Buscar" name="quickSearch">
                <Input placeholder="Digite o nome" allowClear />
              </Form.Item>
            </Col>

          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
            <Button
              type="default"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate('/person/create')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Tabela de pessoas */}
      <Card title="Lista de Pessoas">
        <Table<Person>
          rowKey="id"
          dataSource={persons}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowClassName={r => (r.deletedAt ? 'ant-table-row-disabled' : '')}
   
        />
      </Card>

      {/* Drawer de detalhes da pessoa */}
      <PersonDetailsDrawer
        open={drawerOpen}
        person_id={selectedPersonId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedPersonId(null);
        }}
      />
    </div>
  );
}
