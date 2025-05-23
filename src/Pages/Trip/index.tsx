import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { states, cities } from "estados-cidades";

import api from "../../services/api";
import {
  TripStatusColors,
  TripStatusOptions,
} from "../../common/types/constantsTypes";
import { Veiculo } from "../../common/store/VehicleStore";
import TripDetailsDrawer from "./components/TripDetailsDrawer";

dayjs.locale("pt-br");

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
  const [endCities, setEndCities] = useState<string[]>([]);

  // lista de UFs
  const ufs = states();

  // watcher para estado final
  const endUf = Form.useWatch("end_state", form);

  // carrega cidades de destino quando endUf mudar
  useEffect(() => {
    setEndCities(endUf ? cities(endUf) : []);
  }, [endUf]);

  // carrega veículos
  useEffect(() => {
    api
      .get<Veiculo[]>("/vehicle")
      .then(({ data }) => setVeiculos(data))
      .catch((err) => {
        console.error("Erro ao carregar veículos", err);
        message.error("Não foi possível carregar a lista de veículos.");
      });
  }, []);

  // busca inicial ao montar
  useEffect(() => {
    onFinish(form.getFieldsValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    const params: Record<string, any> = {};
    if (values.vehicle_id) params.vehicle_id = values.vehicle_id;
    if (values.purpose) params.purpose = values.purpose;
    if (values.status) params.status = values.status;
    if (values.end_state) params.end_state = values.end_state;
    if (values.end_city) params.end_city = values.end_city;
    if (values.journey_start) {
      // values.journey_start é um Dayjs (DatePicker do Ant)
  params.journey_start = values.journey_start.format('YYYY-MM-DDTHH:mm:ssZ');
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

    const printPdfDirect = async (id: number) => {
    try {
      const response = await api.get<Blob>(`/trip/pdf/${id}`, {
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

  const columns: ColumnsType<Trip> = [
    {
      title: "Propósito",
      dataIndex: "purpose",
      key: "purpose",
      width: "15%",
    },
    {
      title: "Data de Início",
      dataIndex: "journey_start",
      key: "journey_start",
      width: "15%",
      render: (date: string) =>
        date
          ? moment(date).format("DD/MM/YYYY HH:mm")
          : "-",

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
            onClick={() => {
              setSelectedTripId(record.id);
              setDrawerOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
       
              onClick={() => printPdfDirect(record.id)}

          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/trip/edit/${record.id}`)}
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => onDelete(record.id)}
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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="tripForm"
          onFinish={onFinish}
          initialValues={{ journey_start: dayjs() }}
        >
          <Row gutter={[16, 8]}>
            <Col span={8}>
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
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col span={8}>
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
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="journey_start" label="Data de Início">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item name="end_state" label="Estado final">
                <Select placeholder="UF" showSearch allowClear>
                  {ufs.map((uf) => (
                    <Select.Option key={uf} value={uf}>
                      {uf}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="end_city" label="Cidade final">
                <Select
                  placeholder="Cidade"
                  showSearch
                  allowClear
                  disabled={!endUf}
                >
                  {endCities.map((city) => (
                    <Select.Option key={city} value={city}>
                      {city}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: "left" }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
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
        />
      </Card>

      <TripDetailsDrawer
        open={drawerOpen}
        trip_id={selectedTripId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTripId(null);
        }}
      />
    </div>
  );
}
