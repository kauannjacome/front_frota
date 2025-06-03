// src/components/MaintenanceForm.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Row, Col, message, Spin } from 'antd';
import moment from 'moment';
import { Supplier, Vehicle } from '../../../common/types';
import api from '../../../services/api';
import { debounce } from 'lodash';

export interface MaintenanceFormValues {
  subscriber_id: number;
  vehicle_id: number;
  supplier_id?: number;
  authorizer_id?: number;
  attendant_id?: number;
  type: 'PREVENTIVA' | 'CORRETIVA' | 'INSPECAO';
  date: moment.Moment;
  description?: string;
  cost?: number;
  next_due?: moment.Moment;
}

type Props = {
  initialValues: Partial<MaintenanceFormValues>;
  onFinish: (values: MaintenanceFormValues) => void;
  onCancel?: () => void;
};

export default function MaintenanceForm({ initialValues, onFinish, onCancel }: Props) {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

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

  const handleSupplierSearch = useCallback(
    debounce((value: string) => {
      fetchSuppliers(value);
    }, 500),
    []
  );

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

  useEffect(() => {
    fetchVehicles();
    fetchSuppliers()

  }, []);
  return (
    <Form<MaintenanceFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : undefined,
        next_due: initialValues.next_due ? moment(initialValues.next_due) : undefined,
      }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name="vehicle_id"
            label="Veículo"
            rules={[{ required: true, message: 'Informe o veículo' }]}
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
          <Form.Item name="supplier_id" label="Fornecedor">
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
          <Form.Item
            name="type"
            label="Tipo de Manutenção"
            rules={[{ required: true, message: 'Selecione o tipo de manutenção' }]}
          >
            <Select placeholder="Selecione o tipo">
              <Select.Option value="PREVENTIVA">Preventiva</Select.Option>
              <Select.Option value="CORRETIVA">Corretiva</Select.Option>
              <Select.Option value="INSPECAO">Inspeção</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="date"
            label="Data"

          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

      </Row>



      <Form.Item name="description" label="Descrição">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="cost" label="Custo">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => (value ? `R$ ${value}` : '')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="next_due" label="Próxima Manutenção">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>



      <Form.Item>
        <Button type="primary" htmlType="submit">Salvar</Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>Cancelar</Button>
      </Form.Item>
    </Form>
  );
}

