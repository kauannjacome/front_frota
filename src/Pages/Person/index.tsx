// src/components/Person.tsx
import React, { useState } from "react";
import { Card, Form, Input, Button, message, Space, Tag, Popconfirm, Col, Row } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../services/api';
import Table, { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  // Buscar pessoas com base nos filtros do formulário
  const onFinish = async (values: any) => {
    try {
      const response = await api.get<Person[]>('/person', { params: values });
      setPersons(response.data);
      message.success('Busca realizada com sucesso!');
      // Não resetamos campos aqui, para permitir ajustar filtros
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
        <Space size="middle">
          <Button
             color="cyan" variant="solid"
            onClick={() => {  navigate(`/person/edit/${record.id}`); }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta pessoa?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button  color="danger" variant="solid">Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 0, gap: "20px" }}>
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
              <Form.Item label="Nome" name="full_name">
                <Input placeholder="Digite o nome" allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="CPF" name="cpf">
                <Input
                  placeholder="000.000.000-00"
                  maxLength={14}
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
                  color="orange" variant="solid"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() =>  navigate('/person/create')}
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
          rowClassName={record => record.deletedAt ? 'ant-table-row-disabled' : ''}
        />
      </Card>
    </div>
  );
}
