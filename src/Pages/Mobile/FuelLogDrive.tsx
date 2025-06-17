import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  Select,
  Grid,
  Typography,
  Row,
  Col,
  DatePicker,
  message,
  Spin,
  Divider,
} from "antd";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { debounce } from "lodash";
import moment from "moment";
import { FuelLogDto } from "../../types";

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Title } = Typography;


export interface FuelLogFormValues {
  vehicle_id?: number;
  driver_id?: number;
  authorizer_id?: number;
  attendant_id?: number;
  person_id?: number;
  supplier_id?: number;
  supply_date: moment.Moment;
  deadline?: moment.Moment;
  price_id?: number;
  liters?: number;
  price_liters?: number;
  cost?: number;
  odometer?: number;
  fuel_type: "GASOLINA" | "ALCOOL" | "DIESEL" | "ELETRICO";
  supply_type?: "COMPLETE" | "LITRO_ESPECIFICADO";
}

type Props = {
  initialValues: Partial<FuelLogFormValues>;
  onFinish: (values: FuelLogFormValues) => void;
  onCancel?: () => void;
};



interface Driver {
  id: number;
  full_name: string;
}

interface PriceOption {
  id: number;
  uuid: string;
  description: string;
  fuel_type: string;
  price: number;
}


export default function FuelLogDrive() {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [fuelPrices, setFuelPrices] = useState<PriceOption[]>([]);
  const [total, setTotal] = useState(0);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [initialValues, setInitialValues] = useState<FuelLogDto>();
  // Estilo responsivo do container
  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 400,
    margin: "0 auto",
    padding: screens.xs ? "0 16px" : undefined,
  };

  const onValuesChange = (_: any, values: any) => {
    const litros = values.litros || 0;
    const preco = values.preco || 0;
    setTotal(litros * preco);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    // enviar para API, etc.
  };






  const liters = Form.useWatch('liters', form);
  const priceLiters = Form.useWatch('price_liters', form);
  const priceId = Form.useWatch('price_id', form);
  useEffect(() => {
    if (typeof liters === 'number' && typeof priceLiters === 'number') {
      form.setFieldsValue({ cost: +(liters * priceLiters).toFixed(2) });
    } else {
      // opcional: limpa se um dos valores ficar indefinido
      form.setFieldsValue({ cost: undefined });
    }
  }, [liters, priceLiters, form]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<FuelLogDto>(`/fuel-log/${id}`);
        setInitialValues(res.data);
        const data = res.data;
        console.log(data)
        console.log('agora inicial valores')
        console.log(initialValues)

      } catch {

      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (typeof priceId === 'number') {
      const sel = fuelPrices.find(p => p.id === priceId);
      if (sel) {
        form.setFieldsValue({ price_liters: sel.price });
        form.setFieldsValue({ fuel_type: sel.fuel_type as FuelLogFormValues['fuel_type'] });
      }
    } else {
      form.setFieldsValue({ price_liters: undefined });
    }
  }, [priceId, fuelPrices, form]);


  useEffect(() => {
  if (initialValues) {
    // prepara todos os campos (já converte datas com moment, se precisar)
    form.setFieldsValue({
      ...initialValues,
      liters: initialValues.liters ?? 0,
      price_liters: initialValues.price_liters,
      supply_date: moment(initialValues.supply_date),
      deadline: initialValues.deadline ? moment(initialValues.deadline) : undefined,
      driver_id: initialValues.driver_id,
      // … outros campos
    });

    // garante que o Select tenha uma Option para esse driver
    setDrivers([{ id: initialValues.driver.id, full_name: initialValues.driver.full_name }]);
  }
}, [initialValues, form]);

  const litros = Form.useWatch('liters', form);

  return (
    <div style={containerStyle}>

    {!initialValues ? (
      <Spin />
    ) : (
      <Form
        form={form}
        name="fuel-log-form"
        layout="vertical"
        onValuesChange={onValuesChange}
        onFinish={onFinish}
      >
        <Row justify="center" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, alignItems: "center" }}>
              Fornecedor
            </Title>
          </Col>
        </Row>

        <Row justify="center" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {initialValues?.supplier.name
                ? initialValues?.supplier.name
                : "--"}
            </Title>
          </Col>
        </Row>
        <Divider />
        <Row justify="center" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, alignItems: "center" }}>
              Veiculo
            </Title>
          </Col>
        </Row>

        <Row justify="center" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {initialValues?.vehicle.plate
                ? `${initialValues.vehicle.surname} - ${initialValues.vehicle.plate}`
                : "--"}
            </Title>
          </Col>
        </Row>
        <Divider />


        {/* Quantidade de litros */}
        <Form.Item
          label="Litros"
          name="liters"
          rules={[{ required: true, message: "Por favor, informe a quantidade de litros!" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>



        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              Preço por litros:
            </Title>
          </Col>
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {initialValues?.price_liters
                ? initialValues?.price_liters
                : "--"}
            </Title>
          </Col>
        </Row>

        {/* Valor total calculado */}

        <Row justify="space-between" align="middle">
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              Valor Total:
            </Title>
          </Col>
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              R$ {initialValues?.price_liters
                ? initialValues?.price_liters * litros
                : "--"}

            </Title>
          </Col>
        </Row>

        <Row justify="space-between" align="middle">
          <Col span={24}>
            <Form.Item name="odometer" label="Hodômetro">
              <InputNumber style={{ width: "100%" }} min={0} step={1} />
            </Form.Item>
          </Col>

        </Row>

        <Row justify="space-between" align="middle">
          <Col span={24}>
            <Form.Item
              name="supply_date"
              label="Data de Abastecimento"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="space-between" align="middle">
          <Col span={24}>
            <Form.Item name="deadline" label="Prazo Limite">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item></Col>

        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              height: 50,
              fontSize: screens.xs ? 16 : 14,
              padding: "12px 0",
            }}
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>)}
    </div>
  );
}
