import { useState } from "react";
import { Card, Form, Input, Button, message, Row, Col, Tag, Popconfirm, Dropdown, Space } from "antd";
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, PlusOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../services/api';
import Table, { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import VehicleDetailsDrawer from "./components/VehicleDetailsDrawer";

interface Vehicle {
  id: number;
  subscriber_id: number;
  surname: string;       // Adicionado campo "surname"
  mark: string;
  model: string;
  plate: string;         // Unificado com o campo do formulário
  renavam: string;
  type: string;
  inService: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Vehicle() {
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);                     // Estado para controlar o Drawer
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null); // Estado para o ID selecionado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await api.get<Vehicle[]>('/vehicle/search', { params: values });
      setVehicles(response.data);
      message.success('Busca realizada com sucesso!');
      form.resetFields();
    } catch (error) {
      console.error('Erro na busca de veículos:', error);
      message.error('Não foi possível realizar a busca.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/vehicle/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
      message.success('Veículo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      message.error('Não foi possível excluir o veículo.');
    }
  };

  const printPdfDirect = async (id: number) => {
    try {
      const response = await api.get<Blob>(`/vehicle/pdf/${id}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {

        iframe?.contentWindow?.focus();
        iframe?.contentWindow?.print();
      };
    } catch (err) {
      message.error("Falha ao gerar PDF para impressão");
    }
  };
  const columns: ColumnsType<Vehicle> = [
    { title: 'Nome', dataIndex: 'surname', key: 'surname', width: '20%' },
    { title: 'Marca', dataIndex: 'mark', key: 'mark', width: '20%' },
    { title: 'Modelo', dataIndex: 'model', key: 'model', width: '20%' },
    { title: 'Placa', dataIndex: 'plate', key: 'plate', width: '10%' },
    {
      title: 'Disponível', dataIndex: 'available', key: 'available', width: '10%',
      render: (available: boolean) => <Tag color={available ? 'green' : 'volcano'}>{available ? 'Sim' : 'Não'}</Tag>
    },
    {
      title: 'Ações', key: 'action', width: '20%',


      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedVehicleId(record.id);
              setDrawerOpen(true)

            }}
          />


          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => {

              printPdfDirect(record.id)
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {

              navigate(`/vehicle/edit/${record.id}`);
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
    <div style={{ display: "flex", flexDirection: "column", padding: 0, gap: "20px" }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="vehicleForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Nome" name="surname">
                <Input placeholder="Digite o apelido" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Placa" name="plate">
                <Input placeholder="AAA-1234" maxLength={8} allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Buscar</Button>
            <Button type="default" icon={<PlusOutlined />} style={{ marginLeft: 12 }} onClick={() => navigate('/vehicle/create')}>Adicionar</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Veículos">
        <Table<Vehicle>
          rowKey="id"
          dataSource={vehicles}
          columns={columns}
          pagination={{ pageSize: 10 }}

        />
      </Card>

      <VehicleDetailsDrawer
        open={drawerOpen}
        vehicle_id={selectedVehicleId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedVehicleId(null);
        }}
      />
    </div>
  );
}
