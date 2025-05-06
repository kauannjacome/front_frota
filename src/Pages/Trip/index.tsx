import { useState } from "react";
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
  TimePicker,
  Select,
  Switch,
  Col,
  Row,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from "../../services/api";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";

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
  const [form] = Form.useForm();
  const [trips, setTrips] = useState<Trip[]>([]);
  const { Option } = Select;

  const onFinish = async (values: any) => {
    try {
      const response = await api.get<Trip[]>("/trip", { params: values });
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
        date ? moment(date).format("DD/MM/YYYY") : "-",
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
        let color = "geekblue";
        if (status === "APROVADO") color = "green";
        if (status === "REJEITADO") color = "volcano";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ações",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">

          <Button
            type="default"
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
            <Button danger>Excluir</Button>
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
          onSubmitCapture={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="purpose" label="Propósito">
                <Input placeholder="Digite o propósito" allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Selecione o status" allowClear>
                  <Option value="PENDENTE">Pendente</Option>
                  <Option value="APROVADO">Aprovado</Option>
                  <Option value="EM_ANDAMENTO">Em andamento</Option>
                  <Option value="CONCLUIDO">Concluído</Option>
                  <Option value="CANCELADO">Cancelado</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="request_date" label="Data">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: 'left' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>

            <Button
               color="cyan" variant="solid"
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => message.info('Abrir formulário de criação')}
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
