// src/components/FuelLogForm.tsx
import { Form, InputNumber, DatePicker, Select, Button, Row, Col, Input } from 'antd';
import moment from 'moment';

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
  fuel_type: 'GASOLINA' | 'ALCOOL' | 'DIESEL' | 'ELETRICO';
  supply_type?: 'COMPLETE' | 'PARTIAL';
}

type Props = {
  initialValues: Partial<FuelLogFormValues>;
  onFinish: (values: FuelLogFormValues) => void;
  onCancel?: () => void;
};

export default function FuelLogForm({ initialValues, onFinish, onCancel }: Props) {
  return (
    <Form<FuelLogFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        supply_date: initialValues.supply_date ? moment(initialValues.supply_date) : undefined,
        deadline: initialValues.deadline ? moment(initialValues.deadline) : undefined,
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="vehicle_id" label="Veículo (ID)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="driver_id" label="Motorista (ID)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="authorizer_id" label="Autorizador (ID)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="attendant_id" label="Atendente (ID)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="person_id" label="Pessoa Associada (ID)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="supplier_id" label="Fornecedor (ID)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="supply_date"
            label="Data de Abastecimento"
            rules={[{ required: true, message: 'Informe a data de abastecimento' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="deadline" label="Prazo (Deadline)">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="liters" label="Litros">
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cost" label="Custo">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => (value ? `R$ ${value}` : '')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="odometer" label="Hodômetro">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="fuel_type"
            label="Tipo de Combustível"
            rules={[{ required: true, message: 'Selecione o tipo de combustível' }]}
          >
            <Select placeholder="Selecione o tipo">
              <Select.Option value="GASOLINA">Gasolina</Select.Option>
              <Select.Option value="ALCOOL">Álcool</Select.Option>
              <Select.Option value="DIESEL">Diesel</Select.Option>
              <Select.Option value="ELETRICO">Elétrico</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="supply_type"
        label="Tipo de Abastecimento"
      >
        <Select placeholder="Selecione o tipo">
          <Select.Option value="COMPLETE">Completo</Select.Option>
          <Select.Option value="PARTIAL">Parcial</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Salvar</Button>
       <Button style={{ marginLeft: 8 }} onClick={onCancel}>Cancelar</Button>
      </Form.Item>
    </Form>
  );
}