import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  message,
  Row,
  Col,
  Popconfirm,
  Space,
  DatePicker,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from '../../services/api';
import { Veiculo } from "../../common/store/VehicleStore";
import { useNavigate } from "react-router-dom";
import MaintenanceDetailsDrawer from "./components/MaintenanceDetailsDrawer";

interface Maintenance {
  id: number;
  vehicle_id: number;
  type: string;
  date: string;
  description: string;
  cost: number;
  next_due: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Maintenance() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<Maintenance[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Buscar manutenções quando submeter o formulário
  const onFinish = async (values: any) => {
    try {
      const params = {
        ...values,
        date: values.date
          ? values.date.format('YYYY-MM-DD')
          : undefined,
      };
      const response = await api.get<Maintenance[]>('/maintenance/search', { params });
      setRecords(response.data);
      message.success('Manutenções carregadas com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error);
      message.error('Não foi possível carregar manutenções.');
    }
  };

  // Deletar manutenção
  const onDelete = async (id: number) => {
    try {
      await api.delete(`/maintenance/${id}`);
      setRecords(prev => prev.filter(r => r.id !== id));
      message.success('Manutenção excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      message.error('Não foi possível excluir manutenção.');
    }
  };

  // Carregar lista de veículos
  useEffect(() => {
    api.get<Veiculo[]>('/vehicle')
      .then(({ data }) => setVeiculos(data))
      .catch(err => {
        console.error('Erro ao carregar veículos', err);
        message.error('Não foi possível carregar a lista de veículos.');
      });
  }, []);

  const columns: ColumnsType<Maintenance> = [
    {
      title: 'Veículo',
      key: 'vehicle',
      width: '12%',
      render: (_: any, record) => {
        const vehicle = veiculos.find(v => v.id === record.vehicle_id);
        return vehicle ? `${vehicle.mark} ${vehicle.model}` : `#${record.vehicle_id}`;
      }
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type: string) => (
        <span style={{ textTransform: 'capitalize' }}>{type.toLowerCase()}</span>
      )
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      render: date => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      width: '25%'
    },
    {
      title: 'Custo',
      dataIndex: 'cost',
      key: 'cost',
      width: '10%',
      render: cost => `R$ ${cost.toFixed(2)}`
    },
    {
      title: 'Ações',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMaintenanceId(record.id);
              setDrawerOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => {
              message.info(`Imprimir manutenção ID: ${record.id}`);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/maintenance/edit/${record.id}`)}
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={async () => await onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          name="maintenanceForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Veículo" name="vehicle_id">
                <Select
                  placeholder="Selecione o veículo"
                  loading={!veiculos.length}
                  allowClear
                  showSearch
                  options={veiculos.map(v => ({ value: v.id, label: `${v.mark} ${v.model}` }))}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Data" name="date">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Tipo" name="type">
                <Select placeholder="Selecione o tipo de manutenção" allowClear style={{ width: '100%' }}>
                  <Select.Option value="PREVENTIVA">Preventiva</Select.Option>
                  <Select.Option value="CORRETIVA">Corretiva</Select.Option>
                  <Select.Option value="INSPECAO">Inspeção</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate('/maintenance/create')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Manutenções">
        <Table<Maintenance>
          rowKey="id"
          dataSource={records}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <MaintenanceDetailsDrawer
        open={drawerOpen}
        maintenance_id={selectedMaintenanceId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedMaintenanceId(null);
        }}
      />
    </div>
  );
}
