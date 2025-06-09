// src/pages/FuelPrice/index.tsx
import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  message,
  Popconfirm,
  Row,
  Col,
  Space,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface FuelPrice {
  id: number;
  uuid: string;
  description: string | null;
  fuel_type: string;
  price: number;
  supplier_id: number;
  subscriber_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  supplier: {
    id: number;
    uuid: string;
    name: string;
    telephone: string;
    email: string;
    cnpj: string;
    category: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export default function FuelPrice() {
  const [form] = Form.useForm();
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Busca os preços, faz filtro simples por tipo de combustível
  const onSearch = async (values: any) => {
    try {
      const response = await api.get<FuelPrice[]>("/fuel-price");
      let data = response.data;

      if (values.fuel_type) {
        data = data.filter((p) => p.fuel_type === values.fuel_type);
      }

      setPrices(data);
    } catch (error) {
      console.error("Erro ao buscar preços de combustível:", error);
      message.error("Não foi possível carregar os preços.");
    }
  };

  // Busca inicial
  useEffect(() => {
    onSearch(form.getFieldsValue());
  }, []);

  // Exclui (soft delete)
  const onDelete = async (id: number) => {
    try {
      await api.delete(`/fuel-price/${id}`);
      setPrices((prev) => prev.filter((p) => p.id !== id));
      message.success("Preço removido com sucesso!");
    } catch (error) {
      console.error("Falha ao remover preço:", error);
      message.error("Não foi possível remover o preço.");
    }
  };

  const columns: ColumnsType<FuelPrice> = [
   
       {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "25%",
      render: (text: string | null) => text || "–",
    },
     {
      title: "Tipo de Combustível",
      dataIndex: "fuel_type",
      key: "fuel_type",
      width: "20%",
    },
    {
      title: "Preço (R$)",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (value: number) => value.toFixed(2),
    },
    {
      title: "Fornecedor",
      dataIndex: ["supplier", "name"],
      key: "supplier",
      width: "25%",
    },

    {
      title: "Ações",
      key: "action",
      width: "15%",
      render: (_: any, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPriceId(record.id);
              setDrawerOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/fuel-price/edit/${record.id}`)}
          />
          <Popconfirm
            title="Confirma remoção deste preço?"
            onConfirm={async () => {
              await onDelete(record.id);
            }}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" icon={<DeleteOutlined />} />
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
          layout="vertical"
          onFinish={onSearch}
          initialValues={{}}
          name="priceFilterForm"
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Tipo de Combustível" name="fuel_type">
                <Select placeholder="Selecione o tipo" allowClear>
                  <Select.Option value="GASOLINA">Gasolina</Select.Option>
                  <Select.Option value="DIESEL">Diesel</Select.Option>
                  <Select.Option value="ETANOL">Etanol</Select.Option>
                  <Select.Option value="ELETRICO">Elétrico</Select.Option>
                  <Select.Option value="OUTRO">Outro</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              Buscar
            </Button>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate(`/fuel-price/create`)}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Preços de Combustível">
        <Table<FuelPrice>
          rowKey="id"
          dataSource={prices}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>


    </div>
  );
}
