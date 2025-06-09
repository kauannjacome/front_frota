import { useState } from "react";
import { Card, Form, Input, Button, message, Space, Tag, Popconfirm, Row, Col } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../services/api';
import Table, { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import SupplierDetailsDrawer from "./components/SupplierDetailsDrawer";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  const navigate = useNavigate();

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
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              setSelectedSupplierId(record.id);
              setDrawerOpen(true)

            }}
          />


          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={(e) => {

              message.info(`Imprimir viagem ID: ${record.id}`);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {

              navigate(`/supplier/edit/${record.id}`);;
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
    <div style={{ display: "flex", flexDirection: "column", padding: 0, gap: "20px" }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="supplierForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="name">
                <Input
                  placeholder="Digite o nome"
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
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button
              type="primary"
              htmlType="button"
              icon={<SearchOutlined />}
              onClick={fetchSuppliers}
            >
              Buscar
            </Button>
            <Button
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate('/supplier/create')}
            >
              Adicionar
            </Button>
          </Form.Item>
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

      <SupplierDetailsDrawer
        open={drawerOpen}
        supplier_id={selectedSupplierId}
        onClose={() => {

          setDrawerOpen(false);
          setSelectedSupplierId(null);
        }

        }
      />
    </div>
  );
}
