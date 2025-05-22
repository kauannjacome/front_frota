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
import { useForm } from "antd/es/form/Form";

export interface FuelLogFormValues {
  vehicle_id?: number;
  driver_id?: number;
  authorizer_id?: number;
  attendant_id?: number;
  person_id?: number;
  supplier_id?: number;
  supply_date: moment.Moment;
  deadline?: moment.Moment;
  liters?: number;
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
  name: string;
}

interface Supplier {
  id: number;
  name: string;
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
  const [form] = useForm<FuelLogFormValues>();
  const supplyType = Form.useWatch('supply_type', form);
  return (
    <Form<FuelLogFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        supply_type: initialValues.supply_type ?? 'COMPLETE',
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
                  {driver.name}
                </Select.Option>
              ))}
            </Select>
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
          <Form.Item name="supply_type" label="Tipo de Abastecimento">
            <Select placeholder="Selecione o tipo"   onChange={setStatus} >
              <Select.Option value="COMPLETE">Completo</Select.Option>
              <Select.Option value="LITRO_ESPECIFICADO">Parcial</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* restante do formulário permanece igual */}

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="deadline" label="Prazo Limite">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="fuel_type"
            label="Tipo de Combustível"
            rules={[
              { required: true, message: "Selecione o tipo de combustível" },
            ]}
          >
            <Select placeholder="Selecione o tipo">
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
          <Form.Item name="cost" label="Custo">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) => (value ? `R$ ${value}` : "")}
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
            rules={[
              { required: true, message: "Informe a data de abastecimento" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
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
