import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Tag,
  Popconfirm,
  DatePicker,
  Select,
  Col,
  Row,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import {
  TripStatusColors,
  TripStatusOptions,
} from "../../../common/types/constantsTypes";
import { useNavigate } from "react-router-dom";
import { Veiculo } from "../../../common/store/VehicleStore";

interface Trip {
  id: number;
  department_id: number;
  subscriber_id: number;
  purpose: string;
  notes?: string | null;
  request_date: string;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  start_time: string;
  end_time: string;
  distance_km: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  vehicle_id: number;
  driver_id: number;
}

export default function Trip() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const { Option } = Select;
  useEffect(() => {
    api
      .get<Veiculo[]>("/vehicle")
      .then(({ data }) => setVeiculos(data))
      .catch((err) => {
        console.error("Erro ao carregar veículos", err);
        message.error("Não foi possível carregar a lista de veículos.");
      });
  }, []);

  const onFinish = async (values: any) => {
    try {
      const response = await api.get<Trip[]>("/trip/search", {
        params: values,
      });
      setTrips(response.data);
      message.success("Dados de viagem carregados com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
      message.error("Não foi possível buscar as viagens.");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/trip/${id}`);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      message.success("Viagem excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir viagem:", error);
      message.error("Não foi possível excluir a viagem.");
    }
  };

  const columns: ColumnsType<Trip> = [
    { title: "Propósito", dataIndex: "purpose", key: "purpose", width: "15%" },
    {
      title: "Data de Solicitação",
      dataIndex: "request_date",
      key: "request_date",
      width: "15%",
      render: (date: string) =>
        date ? moment(date).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Origem",
      key: "origin",
      width: "15%",
      render: (_, record) => (
        <>
          {record.start_city}, {record.start_state}
        </>
      ),
    },
    {
      title: "Destino",
      key: "destination",
      width: "15%",
      render: (_, record) => (
        <>
          {record.end_city}, {record.end_state}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => {
        const color = TripStatusColors[status] || "geekblue";
        // Se você quiser exibir o label em vez do código:
        const label =
          TripStatusOptions.find((o) => o.value === status)?.label || status;
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Ações",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button variant="solid" color="purple" onClick={() => {}}>
            Imprimir
          </Button>
          <Button
             color="cyan" variant="solid"
            onClick={() => message.info(`Editar viagem ID: ${record.id}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta viagem?"
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 0,
        gap: "20px",
      }}
    >
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="tripForm"
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
                  options={veiculos.map((v) => ({
                    value: v.id,
                    label: `${v.surname} ${v.plate}`,
                  }))}
                  filterOption={(input, option) =>
                    // garante sempre retornar boolean
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="purpose" label="Propósito">
                <Input placeholder="Digite o propósito" allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="Status">
                <Select
                  placeholder="Selecione o status"
                  allowClear
                  showSearch
                  options={TripStatusOptions.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="request_date" label="Data">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: "left" }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>

            <Button
           color="orange" variant="solid"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate("/trip/create")}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Viagens">
        <Table<Trip>
          rowKey="id"
          dataSource={trips}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
