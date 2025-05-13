import React, { useEffect, useState } from "react";
import { Card, Form, Input, InputNumber, Button, message, Space, Popconfirm, Row, Col, Tag } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

interface Department {
  id: number;
  uuid: string;
  subscriber_id: number;
  name: string;
  department_logo: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function Department() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<Department[]>([]);

  // Fetch all departments
  const loadDepartments = async (params: any = {}) => {
    try {
      const response = await api.get<Department[]>('/department', { params });
      setDepartments(response.data);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      message.error('Não foi possível carregar departamentos.');
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await api.post('/department', values);
      message.success('Departamento adicionado com sucesso!');
      form.resetFields();
      loadDepartments();
    } catch (error) {
      console.error('Erro ao adicionar departamento:', error);
      message.error('Não foi possível adicionar o departamento.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/department/${id}`);
      setDepartments(prev => prev.filter(d => d.id !== id));
      message.success('Departamento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir departamento:', error);
      message.error('Não foi possível excluir o departamento.');
    }
  };

  const columns: ColumnsType<Department> = [

    { title: 'Nome', dataIndex: 'name', key: 'name', width: '20%' },
  
    {
      title: 'Ações',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/department/edit/${record.id}`)}>Editar</Button>
          <Popconfirm
            title="Excluir"
            description="Tem certeza que deseja excluir este departamento?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const onSearch = () => {
    const values = form.getFieldsValue();
    loadDepartments(values);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <Form form={form} layout="horizontal" name="departmentForm" onFinish={onFinish}>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="ID Assinante" name="subscriber_id">
                <InputNumber style={{ width: '100%' }} placeholder="Digite o ID do assinante" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="name">
                <Input placeholder="Digite o nome do departamento" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Logo (URL)" name="department_logo">
                <Input placeholder="URL do logo" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Buscar</Button>
            <Button
              type="default"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate('/department/create')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Departamentos">
        <Table<Department>
          rowKey="id"
          dataSource={departments}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
