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
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,

  EyeOutlined,
} from "@ant-design/icons";
import api from "../../services/api";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import {
  TripStatusColors,
  TripStatusOptions,
} from "../../common/types/constantsTypes";
import { useNavigate } from "react-router-dom";
import { Veiculo } from "../../common/store/VehicleStore";
import TripDetailsDrawer from "./components/TripDetailsDrawer";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');


interface Trip {
  id: number;
  purpose: string;
  journey_start: string;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  status: string;
  vehicle_id: number;
  driver_id: number;
}

export default function Trip() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

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
    const params: Record<string, any> = {};
    if (values.vehicle_id) params.vehicle_id = values.vehicle_id;
    if (values.purpose) params.purpose = values.purpose;
    if (values.status) params.status = values.status;
    if (values.end_city) params.end_city = values.end_city;
    if (values.journey_start) {
      params.journey_start = values.journey_start.toDate().toISOString();
    }

    try {
      const response = await api.get<Trip[]>("/trip/search", { params });
      setTrips(response.data);
      message.success("Dados de viagem carregados com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
      message.error("Não foi possível buscar as viagens.");
    }
  };
  useEffect(() => {
    // Pega os valores atuais do formulário
    const values = form.getFieldsValue();
    // Chama onFinish passando esses valores
    onFinish(values);
  }, []); // só na montagem
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
      title: "Data de Início",
      dataIndex: "journey_start",
      key: "journey_start",
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
        const label =
          TripStatusOptions.find((o) => o.value === status)?.label || status;
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Ações",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              setSelectedTripId(record.id);
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

              navigate(`/trip/edit/${record.id}`);
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
          initialValues={{ journey_start: dayjs() }}
       
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
              <Form.Item name="end_city" label="Destino (cidade)">
                <Input placeholder="Cidade de destino" allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="journey_start" label="Data">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY "
               
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: "left" }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>

            <Button
              style={{ marginLeft: 12 }}
              type="default"
              icon={<PlusOutlined />}
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
          showHeader={true}

        />
      </Card>
      <TripDetailsDrawer
        open={drawerOpen}
        trip_id={selectedTripId}
        onClose={() => {

          setDrawerOpen(false);
          setSelectedTripId(null);
        }

        }
      />
    </div>
  );
}
