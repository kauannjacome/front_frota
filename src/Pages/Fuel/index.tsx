import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  DatePicker,
  Select,
  Button,
  message,
  Space,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from "../../services/api";
import { Veiculo } from "../../common/store/VehicleStore";
import ptBRDatePicker from "antd/es/date-picker/locale/pt_BR";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface FuelLog {
  id: number;
  uuid: string;
  vehicle_id: number;
  driver_id?: number;
  authorizer_id?: number;
  attendant_id?: number;
  person_id?: number;
  supply_date: string;
  deadline?: string;
  liters: number;
  cost: number;
  odometer: number;
  fuel_type: string;
  supply_type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Fuel() {
  const [createForm] = Form.useForm();
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [typesFuel, setTypesFuel] = useState<string[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const navigate = useNavigate();

  // Carrega logs e veículos ao montar
  useEffect(() => {
    loadFuelLogs();
    api
      .get<Veiculo[]>("/vehicle")
      .then(({ data }) => setVeiculos(data))
      .catch((err) => {
        console.error("Erro ao carregar veículos", err);
        message.error("Não foi possível carregar a lista de veículos.");
      });
  }, []);

  useEffect(() => {
    loadFuelLogs();
    api
      .get<string[]>("/fuel-log/types")
      .then(({ data }) => setTypesFuel(data))
      .catch((err) => {
        console.error("Erro ao carregar tipos de combustível", err);
      });
  }, []);

  const loadFuelLogs = async () => {
    try {
      const response = await api.get<FuelLog[]>("/fuel-log");
      setFuelLogs(response.data);
    } catch (error) {
      console.error("Erro ao buscar registros de abastecimento:", error);
      message.error("Não foi possível carregar os registros.");
    }
  };

  const onCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        supply_date: values.supply_date.toISOString(),
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };
      await api.post("/fuel-log", payload);
      message.success("Registro de abastecimento criado com sucesso!");
      createForm.resetFields();
      loadFuelLogs();
    } catch (error) {
      console.error("Erro ao criar registro:", error);
      message.error("Falha ao criar registro de abastecimento.");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/fuel-log/${id}`);
      setFuelLogs((prev) => prev.filter((log) => log.id !== id));
      message.success("Registro removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover registro:", error);
      message.error("Não foi possível remover o registro.");
    }
  };

  const columns: ColumnsType<FuelLog> = [
    {
      title: "Veículo",
      key: "vehicle",
      width: "12%",
      render: (_: any, record: FuelLog) => {
        const vehicle = veiculos.find((v) => v.id === record.vehicle_id);
        return vehicle
          ? `${vehicle.mark} ${vehicle.model}`
          : `#${record.vehicle_id}`;
      },
    },
    {
      title: "Data",
      dataIndex: "supply_date",
      key: "supply_date",
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
      width: "15%",
    },
    { title: "Litros", dataIndex: "liters", key: "liters", width: "10%" },
    {
      title: "Tipo Combustível",
      dataIndex: "fuel_type",
      key: "fuel_type",
      width: "15%",
    },
    {
      title: "Ações",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/maintenance/edit/${record.id}`)}>
            Editar
          </Button>
          <Popconfirm
            title="Deseja excluir este registro?"
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
          form={createForm}
          layout="horizontal"
          onFinish={onCreate}
          name="supplyForm"
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
                    label: `${v.mark} ${v.model}`,
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
              <Form.Item label="Data de Abastecimento" name="supply_date">
                <DatePicker
                  style={{ width: "100%" }}
                  locale={ptBRDatePicker}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Tipo de Combustível" name="fuel_type">
                <Select placeholder="Selecione o tipo" allowClear>
                  <Select.Option value="GASOLINA">Gasolina</Select.Option>
                  <Select.Option value="DIESEL">Diesel</Select.Option>
                  <Select.Option value="ETANOL">Etanol</Select.Option>
                  <Select.Option value="ELETRICO">Elétrico</Select.Option>
                  <Select.Option value="OUTRO">
                    Outro tipo de combustível
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16, textAlign: "left" }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
            <Button
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              onClick={() => navigate(`/fuel/create`)}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Abastecimentos">
        <Table<FuelLog>
          rowKey="id"
          dataSource={fuelLogs}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
