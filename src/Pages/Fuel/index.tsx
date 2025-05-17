import { useState, useEffect } from "react";
import {
  Card,
  Form,
  DatePicker,
  Select,
  Button,
  message,
  Popconfirm,
  Row,
  Col,
  Modal,
  Dropdown,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from "../../services/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Veiculo } from "../../common/store/VehicleStore";
import FuelLogDrawer from "./components/FuelLogDrawer";

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
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // **2. estados para o Drawer**
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Carrega veículos
  useEffect(() => {
    api
      .get<Veiculo[]>("/vehicle")
      .then(({ data }) => setVeiculos(data))
      .catch((err) => {
        console.error("Erro ao carregar veículos", err);
        message.error("Não foi possível carregar a lista de veículos.");
      });
  }, []);

  // Carrega tipos de combustível
  useEffect(() => {
    api
      .get<string[]>("/fuel-log/types")
      .then(({ data }) => setTypesFuel(data))
      .catch((err) => {
        console.error("Erro ao carregar tipos de combustível", err);
      });
  }, []);

  // Busca registros
  const onSearch = async (values: any) => {
    try {
      const response = await api.get<FuelLog[]>("/fuel-log/search", {
        params: values,
      });
      setFuelLogs(response.data);
    } catch (error) {
      console.error("Erro ao buscar registros de abastecimento:", error);
      message.error("Não foi possível carregar os registros.");
    }
  };

  // Exclui registro
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

  // Abre modal com PDF
  const openPdfModal = async (id: number) => {
    try {
      const response = await api.get<Blob>(`/fuel-log/pdf/${id}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
      setPdfModalVisible(true);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      message.error("Não foi possível gerar o PDF.");
    }
  };

  // Colunas da tabela
  const columns: ColumnsType<FuelLog> = [
    {
      title: "Veículo",
      key: "vehicle",
      width: "12%",
      render: (_, record) => {
        const v = veiculos.find((x) => x.id === record.vehicle_id);
        return v ? `${v.mark} ${v.model}` : `#${record.vehicle_id}`;
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
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLogId(record.id);
              setDrawerOpen(true);

            }}
          />

          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => openPdfModal(record.id)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/fuel/edit/${record.id}`)}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <Form
          form={createForm}
          layout="vertical"
          onFinish={onSearch}
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
                    label: `${v.surname} - ${v.plate}`,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Data de Abastecimento" name="supply_date">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Tipo de Combustível" name="fuel_type">
                <Select placeholder="Selecione o tipo" allowClear>
                  {typesFuel.map((tipo) => (
                    <Select.Option key={tipo} value={tipo}>
                      {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                    </Select.Option>
                  ))}
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

      <Modal
        title="Visualizar PDF"
        open={pdfModalVisible}
        onCancel={() => setPdfModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPdfModalVisible(false)}>
            Fechar
          </Button>,
          <Button
            key="print"
            type="primary"
            onClick={() => {
              const iframe = document.getElementById(
                "pdf-frame"
              ) as HTMLIFrameElement;
              iframe?.contentWindow?.focus();
              iframe?.contentWindow?.print();
            }}
          >
            Imprimir
          </Button>,
        ]}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ height: "80vh", padding: 0 }}
      >
        <iframe
          id="pdf-frame"
          src={pdfUrl}
          title="PDF"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </Modal>
      <FuelLogDrawer
        open={drawerOpen}
        log_id={selectedLogId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLogId(null);
        }}
      />
    </div>
  );
}
