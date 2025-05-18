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
  Space,
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
import api from "../../services/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Veiculo } from "../../common/store/VehicleStore";
import FuelLogDrawer from "./components/FuelLogDrawer";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

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
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

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



  // Busca registros
  const onSearch = async (values: any) => {
    try {
      const params = {
        ...values,
        supply_date: values.supply_date
          ? values.supply_date.format('YYYY-MM-DD')
          : undefined,
      };
      const response = await api.get<FuelLog[]>("/fuel-log/search", {
        params: params,
      });
      console.log(response)
      setFuelLogs(response.data);
    } catch (error) {
      console.error("Erro ao buscar registros de abastecimento:", error);
      message.error("Não foi possível carregar os registros.");
    }
  };

  useEffect(() => {
    // Pega os valores atuais do formulário
    const values = createForm.getFieldsValue();
    // Chama onFinish passando esses valores
    onSearch(values);
  }, []); // só na montagem

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





  const printPdfDirect = async (id: number) => {
    try {
      const response = await api.get<Blob>(`/fuel-log/pdf/${id}`, {
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
            onClick={() => 
                printPdfDirect(record.id)}
              
            
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
          initialValues={{ supply_date: dayjs() }}
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
