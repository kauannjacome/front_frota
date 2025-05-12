// src/components/MaintenanceForm.tsx
import React from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Row, Col } from 'antd';
import moment from 'moment';

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
            label="Veículo (ID)"
            rules={[{ required: true, message: 'Informe o ID do veículo' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="supplier_id" label="Fornecedor (ID)">
            <InputNumber style={{ width: '100%' }} />
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
            <DatePicker style={{ width: '100%' }} />
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

