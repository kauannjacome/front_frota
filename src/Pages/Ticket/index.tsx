import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Popconfirm,
  DatePicker,
  Col,
  Row,
  Select,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import api from "../../services/api";
import { useSupplierStore } from "../../common/store/SupplierStore";
import { useNavigate } from "react-router-dom";
import { states, cities } from "estados-cidades";
import moment from "moment";

interface Ticket {
  id: number;
  uuid: string;
  supplier_id: number;
  passenger_id: number;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  travel_date: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
interface Person {
  id: number;
  full_name: string;
}
const { Option } = Select;
export default function Ticket() {
  moment.locale("pt-br");
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [startCities, setStartCities] = useState<string[]>([]);
  const [startUf, setStartUf] = useState<string>();

  const suppliers = useSupplierStore((state) => state.suppliers) ?? [];
  const navigate = useNavigate();
  const fetchSuppliers = useSupplierStore((state) => state.fetchSuppliers);
  const onFinish = async (values: any) => {
    try {
      const params = {
        supplier_id: values.supplier_id,
        passenger_id: values.passenger_id,
        start_state: values.start_state,
        start_city: values.start_city,
        end_state: values.end_state,
        end_city: values.end_city,
        travel_date: values.travel_date
          ? values.travel_date.format("YYYY-MM-DD")
          : undefined,
      };
      console.log("params", params);
      const response = await api.get<Ticket[]>("/ticket/search", { params });
      setTickets(response.data);
      message.success("Passagens carregadas com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar passagens:", error);
      message.error("Não foi possível carregar as passagens.");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/ticket/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      message.success("Passagem excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir passagem:", error);
      message.error("Não foi possível excluir a passagem.");
    }
  };

  const columns: ColumnsType<Ticket> = [
    {
      title: "Fornecedor",
      dataIndex: "supplier_id",
      key: "supplier_id",
      width: "15%",
      render: (supplierId: number) => {
        const supplier = suppliers.find((s) => s.id === supplierId);
        return supplier ? supplier.name : supplierId;
      },
    },
    {
      title: "Passageiro",
      dataIndex: "passenger_id",
      key: "passenger_id",
      render: (_: any, record: Ticket) => {
        const person = persons.find((p) => p.id === record.passenger_id);
        return person ? person.full_name : record.passenger_id;
      },
      width: "30%",
    },
    {
      title: "Destino",
      key: "destination",
      render: (_, record) => `${record.end_state} - ${record.end_city}`,
      width: "15%",
    },
    {
      title: "Data de Viagem",
      dataIndex: "travel_date",
      key: "travel_date",
      render: (date) => moment(date).format("DD/MM/YYYY") || "-",
      width: "10%",
    },
    {
      title: "Ações",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button variant="solid" color="purple" onClick={() => {}}>
            Imprimir
          </Button>

          <Button
            color="cyan" variant="solid"
            onClick={() => {
              navigate(`/ticket/edit/${record.id}`);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir esta passagem?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" danger>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: "15%",
    },
  ];
  useEffect(() => {
    setUfs(states());
  }, []);

  // Chama fetchSuppliers só uma vez, ao montar o componente
  useEffect(() => {
    fetchSuppliers();

    api
      .get<Person[]>("/person")
      .then((res) => {
        setPersons(res.data); // extrai o .data antes de setar
      })
      .catch((err) => {
        console.error("Erro ao buscar pessoas:", err);
        message.error("Não foi possível carregar os passageiros.");
      });
  }, [fetchSuppliers]);

  console.log(suppliers);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Card>
        <Form
          form={form}
          layout="horizontal"
          name="ticketForm"
          onFinish={onFinish}
        >
          <Row gutter={[16, 8]}>
            <Col span={7}>
              <Form.Item label="Fornecedor" name="supplier_id">
                <Select
                  placeholder="Selecione um fornecedor"
                  allowClear
                  options={suppliers.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    option!.label
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item label="Estado final" name="start_state">
                <Select
                  placeholder="UF"
                  showSearch
                  allowClear
                  onChange={setStartUf}
                >
                  {ufs.map((uf) => (
                    <Option key={uf} value={uf}>
                      {uf}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cidade final" name="end_city">
                <Select
                  placeholder="Cidade"
                  showSearch
                  allowClear
                  disabled={!startUf}
                >
                  {startCities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={10}>
              <Form.Item label="Passageiro" name="passenger_id">
                <Select
                  placeholder="Selecione um passageiro"
                  allowClear
                  options={persons.map((p) => ({
                    value: p.id,
                    label: p.full_name,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    option!.label
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Data Viagem" name="travel_date">
                <DatePicker style={{ width: "100%" }} allowClear />
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
              onClick={() => navigate("/ticket/create")}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Lista de Passagens">
        <Table<Ticket>
          rowKey="id"
          dataSource={tickets}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
