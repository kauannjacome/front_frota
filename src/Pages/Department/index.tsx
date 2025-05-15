import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, Button, message, Space, Popconfirm, Row, Col } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

interface Subscriber {
  id: number;
  uuid: string;
  name: string;
  // outros campos, se necessário
}

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
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Carrega lista de assinantes
  const loadSubscribers = async () => {
    try {
      const response = await api.get<Subscriber[]>('/subscriber');
      setSubscribers(response.data);
    } catch (error) {
      console.error('Erro ao carregar assinantes:', error);
      message.error('Não foi possível carregar assinantes.');
    }
  };

  // Carrega departamentos com filtros opcionais
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
    loadSubscribers();
    loadDepartments();
  }, []);

  // Ação de busca (submete filtros)
  const onSearch = (values: any) => {
    loadDepartments(values);
  };

  // Excluir departamento
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
    { title: 'Nome', dataIndex: 'name', key: 'name', width: '60%' },
    {
      title: 'Ações',
      key: 'action',
      width: '40%',
      render: (_, record) => (
        <Space size="middle">
          <Button  color="cyan" variant="solid" onClick={() => navigate(`/department/edit/${record.id}`)}>Editar</Button>
          <Popconfirm
            title="Excluir"
            description="Tem certeza que deseja excluir este departamento?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button  color="danger" variant="solid">Excluir</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="departmentForm"
          onFinish={onSearch}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Assinante"
                name="subscriber_id"
                rules={[{ required: true, message: 'Selecione um assinante' }]}
              >
                <Select<number>
                  showSearch
                  placeholder="Selecione um assinante"
                  optionFilterProp="children"
                  // sem filterOption manual, usando o interno
                >
                  {subscribers.map(sub => (
                    <Select.Option key={sub.id} value={sub.id}>
                      {sub.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="name">
                <Input placeholder="Digite o nome do departamento" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
            <Button
                 color="orange" variant="solid"
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
