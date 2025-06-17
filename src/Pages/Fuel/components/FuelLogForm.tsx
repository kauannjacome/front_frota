import { useEffect, useState, useCallback } from "react";
import {
  Form,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import moment from "moment";
import debounce from "lodash/debounce";
import api from "../../../services/api";

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

interface Vehicle {
  id: number;
  surname: string;
  plate: string;
  mark: string;
  model: string;

}

interface Driver {
  id: number;
  full_name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface PriceOption {
  id: number;
  uuid: string;
  description: string;
  fuel_type: string;
  price: number;
}




export default function FuelLogForm({
  initialValues,
  onFinish,
  onCancel,
}: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [status, setStatus] = useState('');
  const [fetchingPrice, setFetchingPrice] = useState(false);
  // dentro do componente:
  const [fuelPrices, setFuelPrices] = useState<PriceOption[]>([]);
  const fetchVehicles = async (search?: string) => {
    setLoadingVehicles(true);
    try {
      const { data } = await api.get<Vehicle[]>("/vehicle", {
        params: search ? { q: search } : {},
      });
      setVehicles(data);
    } catch (err) {
      console.error("Erro ao buscar veículos:", err);
      message.error("Falha ao carregar lista de veículos.");
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchDrivers = async (search?: string) => {
    setLoadingDrivers(true);
    try {
      const { data } = await api.get<Driver[]>("/user/driver", {
        params: search ? { q: search } : {},
      });

      setDrivers(data);
    } catch (err) {
      console.error("Erro ao buscar motoristas:", err);
      message.error("Falha ao carregar lista de motoristas.");
    } finally {
      setLoadingDrivers(false);
    }
  };

  const fetchFuelPrices = async (supplierId: number) => {
    setFetchingPrice(true);
    try {
      const { data } = await api.get<PriceOption[]>(
        `/fuel-price/supplier/${supplierId}`
      );
      setFuelPrices(data);

    } finally {
      setFetchingPrice(false);
    }
  };


  const fetchSuppliers = async (search?: string) => {
    setLoadingSuppliers(true);
    try {
      const { data } = await api.get<Supplier[]>("/supplier/fuel", {
        params: search ? { q: search } : {},
      });
      setSuppliers(data);
    } catch (err) {
      console.error("Erro ao buscar fornecedores:", err);
      message.error("Falha ao carregar lista de fornecedores.");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // Debounced search handlers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleVehicleSearch = useCallback(
    debounce((value: string) => {
      fetchVehicles(value);
    }, 500),
    []
  );
  const handleSupplierChange = (value: number) => {
    // dispara o fetch de preços
    fetchFuelPrices(value);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDriverSearch = useCallback(
    debounce((value: string) => {
      fetchDrivers(value);
    }, 500),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSupplierSearch = useCallback(
    debounce((value: string) => {
      fetchSuppliers(value);
    }, 500),
    []
  );

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchSuppliers();
  }, []);



  const [form] = Form.useForm<FuelLogFormValues>();

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


  return (
    <Form<FuelLogFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        supply_type: initialValues.supply_type ?? 'LITRO_ESPECIFICADO',
        supply_date: initialValues.supply_date
          ? moment(initialValues.supply_date)
          : undefined,
        deadline: initialValues.deadline
          ? moment(initialValues.deadline)
          : undefined,
      }}
    >
      <Row gutter={16}>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Veículo" name="vehicle_id"
            rules={[{ required: true, message: "Selecione o veiculo" }]}
          >

            <Select
              placeholder="Selecione o veículo"
              loading={!vehicles.length}
              allowClear
              showSearch
              options={vehicles.map((v) => ({
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



        <Col span={6}>
          <Form.Item
            name="supplier_id"
            label="Fornecedor"
            rules={[{ required: true, message: "Selecione o fornecedor" }]}
          >
            <Select
              showSearch
              placeholder="Digite para buscar..."
              notFoundContent={loadingSuppliers ? <Spin size="small" /> : null}
              filterOption={false}
              onChange={handleSupplierChange}
              onSearch={handleSupplierSearch}
              loading={loadingSuppliers}
              allowClear
            >
              {suppliers.map((supplier) => (
                <Select.Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            name="price_id"
            label="Registro de Preço"
          >
            <Select
              placeholder={fetchingPrice ? "Carregando..." : "Selecione o preço"}
              disabled={fetchingPrice || fuelPrices.length === 0}
              allowClear
            >
              {fuelPrices.map(p => (
                <Select.Option key={p.id} value={p.id}>
                  {p.description} – R$ {p.price.toFixed(2)}-{p.fuel_type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="supply_type" label="Tipo de Abastecimento"
            rules={[{ required: true, message: "Selecione o Tipo de Abastecimento" }]}>
            <Select placeholder="Selecione o tipo" onChange={setStatus} >
              <Select.Option value="COMPLETE">Completo</Select.Option>
              <Select.Option value="LITRO_ESPECIFICADO">Parcial</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* restante do formulário permanece igual */}

      <Row gutter={16}>

        <Col span={6}>
          <Form.Item
            name="fuel_type"
            label="Tipo de Combustível"
            rules={[
              { required: true, message: "Selecione o tipo de combustível" },
            ]}
          >
            <Select placeholder="Selecione o tipo" disabled={!!priceId}  >
              <Select.Option value="GASOLINA">Gasolina</Select.Option>
              <Select.Option value="ETANOL">Álcool</Select.Option>
              <Select.Option value="DIESEL">Diesel</Select.Option>
              <Select.Option value="ELETRICO">Elétrico</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="liters" label="Litros">
            <InputNumber
              disabled={status === 'COMPLETE'}
              style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="price_liters" label="Preço do litro"
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.01}
              disabled={!!priceId}
              decimalSeparator=","
              formatter={(value) => (value ? `R$ ${value}` : "")}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cost" label="Custo">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.01}
              formatter={(value) => (value ? `R$ ${value}` : "")}
              decimalSeparator=","
              disabled
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="odometer" label="Hodômetro">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="supply_date"
            label="Data de Abastecimento"
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="deadline" label="Prazo Limite">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            name="driver_id"
            label="Motorista"

          >
            <Select
              showSearch
              placeholder="Digite para buscar..."
              notFoundContent={loadingDrivers ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={handleDriverSearch}
              loading={loadingDrivers}
              allowClear
            >
              {drivers.map((driver) => (
                <Select.Option key={driver.id} value={driver.id}>
                  {driver.full_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button variant="solid" color="purple" onClick={onCancel}>
          Salvar e Imprimir
        </Button>
        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
          Salvar
        </Button>


        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
