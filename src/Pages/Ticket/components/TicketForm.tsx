import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  InputNumber,
  Switch,
  Row,
  Col,
  Select,
  message,
} from "antd";
import moment from "moment";
import { states, cities } from "estados-cidades";
import { useSupplierStore } from "../../../common/store/SupplierStore";
import api from "../../../services/api";
export interface TicketFormValues {
  id?: number;
  uuid?: string;
  supplier_id: number;
  passenger_id: number;
  authorizer_id?: number;
  attendant_id?: number;
  start_state: string;
  start_city: string;
  end_state: string;
  end_city: string;
  travel_date?: moment.Moment;
  attendant_viewed: boolean;
  cost?: number;
}

type TicketFormProps = {
  initialValues: Partial<TicketFormValues>;
  onFinish: (values: TicketFormValues) => void;
  onCancel?: () => void;
};

const { Option } = Select;

interface Person {
  id: number;
  full_name: string;
}

export default function TicketForm({
  initialValues,
  onFinish,
  onCancel,
}: TicketFormProps) {
  const [ufs, setUfs] = useState<string[]>([]);
  const [startCities, setStartCities] = useState<string[]>([]);
  const [endCities, setEndCities] = useState<string[]>([]);
  const [startUf, setStartUf] = useState<string>();
  const [endUf, setEndUf] = useState<string>();
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const suppliers = useSupplierStore((state) => state.suppliers) ?? [];
  const fetchSuppliers = useSupplierStore((state) => state.fetchSuppliers);

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

  useEffect(() => {
    setUfs(states());
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (!startUf) {
      setStartCities([]);
      return;
    }
    setLoadingStart(true);
    setStartCities(cities(startUf));
    setLoadingStart(false);
  }, [startUf]);

  useEffect(() => {
    if (!endUf) {
      setEndCities([]);
      return;
    }
    setLoadingEnd(true);
    setEndCities(cities(endUf));
    setLoadingEnd(false);
  }, [endUf]);

  return (
    <Form<TicketFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        travel_date: initialValues.travel_date
          ? moment(initialValues.travel_date)
          : undefined,
        attendant_viewed: initialValues.attendant_viewed ?? false,
      }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name="supplier_id"
            label="Fornecedor"
            rules={[{ required: true, message: "Informe o fornecedor" }]}
          >
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
        <Col span={8}>
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
        <Col span={4}>
          <Form.Item name="travel_date" label="Data da Viagem">
            <DatePicker style={{ width: "100%" }} showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cost" label="Custo">
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={3}>
          <Form.Item label="Estado início" name="start_state">
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
        <Col span={9}>
          <Form.Item label="Cidade início" name="start_city">
            <Select
              placeholder="Cidade"
              showSearch
              allowClear
              disabled={!startUf}
              loading={loadingStart}
            >
              {startCities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label="Estado final" name="end_state">
            <Select placeholder="UF" showSearch allowClear onChange={setEndUf}>
              {ufs.map((uf) => (
                <Option key={uf} value={uf}>
                  {uf}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item label="Cidade final" name="end_city">
            <Select
              placeholder="Cidade"
              showSearch
              allowClear
              disabled={!endUf}
              loading={loadingEnd}
            >
              {endCities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} align="middle"></Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>

        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
