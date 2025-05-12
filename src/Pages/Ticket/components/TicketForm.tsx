import React from 'react';
import { Form, Input, DatePicker, Button, InputNumber, Switch, Row, Col } from 'antd';
import moment from 'moment';

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

export default function TicketForm({ initialValues, onFinish, onCancel }: TicketFormProps) {
  return (
    <Form<TicketFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        travel_date: initialValues.travel_date ? moment(initialValues.travel_date) : undefined,
        attendant_viewed: initialValues.attendant_viewed ?? false,
      }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name="supplier_id"
            label="Fornecedor (ID)"
            rules={[{ required: true, message: 'Informe o ID do fornecedor' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="passenger_id"
            label="Passageiro (ID)"
            rules={[{ required: true, message: 'Informe o ID do passageiro' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="travel_date" label="Data da Viagem">
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cost" label="Custo">
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>

        <Col span={4}>
          <Form.Item
            name="start_state"
            label="Estado de Origem"
            rules={[{ required: true, message: 'Informe o estado de origem' }]}
          >
            <Input placeholder="UF" maxLength={2} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="start_city"
            label="Cidade de Origem"
            rules={[{ required: true, message: 'Informe a cidade de origem' }]}
          >
            <Input placeholder="Cidade" />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item
            name="end_state"
            label="Estado de Destino"
            rules={[{ required: true, message: 'Informe o estado de destino' }]}
          >
            <Input placeholder="UF" maxLength={2} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="end_city"
            label="Cidade de Destino"
            rules={[{ required: true, message: 'Informe a cidade de destino' }]}
          >
            <Input placeholder="Cidade" />
          </Form.Item>
        </Col>
 
      </Row>

      <Row gutter={16} align="middle">


      </Row>

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
