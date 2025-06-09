import { useEffect, useState, useCallback } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Spin,
} from "antd";
import debounce from "lodash/debounce";
import api from "../../../services/api";
import { useForm } from "antd/es/form/Form";

export interface FuelPriceFormValues {
  description?: string;
  fuel_type: "GASOLINA" | "ETANOL" | "DIESEL" | "ELETRICO";
  price: number;
  supplier_id: number;
}

type Props = {
  initialValues?: Partial<FuelPriceFormValues>;
  onFinish: (values: FuelPriceFormValues) => void;
  onCancel?: () => void;
};

interface Supplier {
  id: number;
  name: string;
}


export default function FuelPriceForm({
  initialValues = {},
  onFinish,
  onCancel,
}: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [form] = useForm<FuelPriceFormValues>();



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

  // Debounced supplier search
  const handleSupplierSearch = useCallback(
    debounce((value: string) => {
      fetchSuppliers(value);
    }, 500),
    []
  );

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <Form<FuelPriceFormValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item name="description" label="Descrição">
        <Input placeholder="Descrição (opcional)" allowClear />
      </Form.Item>

      <Form.Item
        name="fuel_type"
        label="Tipo de Combustível"
        rules={[{ required: true, message: "Selecione o tipo de combustível" }]}
      >
        <Select placeholder="Selecione o tipo">
          <Select.Option value="GASOLINA">Gasolina</Select.Option>
          <Select.Option value="ETANOL">Álcool</Select.Option>
          <Select.Option value="DIESEL">Diesel</Select.Option>
          <Select.Option value="ELETRICO">Elétrico</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Preço"
        rules={[{ required: true, message: "Informe o preço" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          step={0.01}

          decimalSeparator=","

        />
      </Form.Item>

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
        >
          {suppliers.map((supplier) => (
            <Select.Option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
      </Form.Item>
    </Form>
  );
}
