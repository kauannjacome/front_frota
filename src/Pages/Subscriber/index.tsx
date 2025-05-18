import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Space, Tag, Popconfirm, Row, Col } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

interface Subscriber {
  id: number;
  name: string;
  subscriber_name: string;
  cnpj: string;
  email: string;
  telephone: string;
  city: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Subscriber() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Fetch all subscribers
  const loadSubscribers = async (params: any = {}) => {
    try {
      const response = await api.get<Subscriber[]>('/subscriber', { params });
      setSubscribers(response.data);
    } catch (error) {
      console.error('Erro ao carregar assinantes:', error);
      message.error('Não foi possível carregar assinantes.');
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await api.post('/subscriber', values);
      message.success('Assinante adicionado com sucesso!');
      form.resetFields();
      loadSubscribers();
    } catch (error) {
      console.error('Erro ao adicionar assinante:', error);
      message.error('Não foi possível adicionar o assinante.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/subscriber/${id}`);
      setSubscribers(prev => prev.filter(s => s.id !== id));
      message.success('Assinante excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir assinante:', error);
      message.error('Não foi possível excluir o assinante.');
    }
  };

  const columns: ColumnsType<Subscriber> = [
    { title: 'Razão Social', dataIndex: 'name', key: 'name', width: '20%' },
    { title: 'Nome Fantasia', dataIndex: 'subscriber_name', key: 'subscriber_name', width: '20%' },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj', width: '15%' },
    { title: 'E-mail', dataIndex: 'email', key: 'email', width: '20%' },
    { title: 'Telefone', dataIndex: 'telephone', key: 'telephone', width: '15%' },
    { title: 'Cidade', dataIndex: 'city', key: 'city', width: '15%' },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: '10%',
      render: (status: string) => {
        const color = status === 'PAGO' ? 'green' : status === 'PENDENTE' ? 'volcano' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Ações', key: 'action', width: '20%',

      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {

              navigate(`/subscriber/edit/${record.id}`);
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
    }]




  const onSearch = () => {
    const values = form.getFieldsValue();
    loadSubscribers(values);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="subscriberForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="subscriber_name">
                <Input
                  placeholder="Digite o nome fantasia"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="CNPJ" name="cnpj">
                <Input
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Cidade" name="city">
                <Input
                  placeholder="Digite a cidade"
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
              onClick={() => navigate('/subscriber/create')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Assinantes">
        <Table<Subscriber>
          rowKey="id"
          dataSource={subscribers}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
