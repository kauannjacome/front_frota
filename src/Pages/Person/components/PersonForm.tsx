// src/components/PersonForm.tsx
import React from 'react';
import { Form, Input, DatePicker, Button, Switch, Card, Row, Col, Checkbox } from 'antd';
import moment from 'moment';

export interface PersonFormValues {
  id?: number;
  uuid?: string;
  cpf: string;
  cns?: string;
  full_name: string;
  social_name?: string;
  birth_date: moment.Moment;
  death_date?: moment.Moment;
  mother_name?: string;
  father_name?: string;
  postal_code?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street_type?: string;
  street_name?: string;
  house_number?: number;
  address_complement?: string;
  reference_point?: string;
  phone_number?: string;
  email?: string;
  sex?: string;
  termsAccepted: boolean;
  subscriber_id: number;
}

type Props = {
  initialValues: Partial<PersonFormValues>;
  onFinish: (values: PersonFormValues) => void;
  onCancel?: () => void;
};

export default function PersonForm({ initialValues, onFinish, onCancel }: Props) {
  return (
    <Form<PersonFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        birth_date: initialValues.birth_date ? moment(initialValues.birth_date) : undefined,
        death_date: initialValues.death_date ? moment(initialValues.death_date) : undefined,
      }}
    >
      {/* CPF / CNS / Nomes */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="cpf" label="CPF" rules={[{ required: true, message: 'Informe o CPF' }]}>
            <Input placeholder="000.000.000-00" maxLength={14} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="cns" label="CNS">
            <Input placeholder="Número do CNS" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="full_name" label="Nome Completo" rules={[{ required: true, message: 'Informe o nome completo' }]}>
            <Input placeholder="Nome completo" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="social_name" label="Nome Social">
            <Input placeholder="Nome social (opcional)" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="birth_date" label="Data de Nascimento" rules={[{ required: true, message: 'Informe a data de nascimento' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="death_date" label="Data de Óbito">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      {/* Dados de contato */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="phone_number" label="Telefone">
            <Input placeholder="(00) 0 0000-0000" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="email" label="E-mail">
            <Input placeholder="email@exemplo.com" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="sex" label="Sexo">
            <Input placeholder="M / F / Outro" />
          </Form.Item>
        </Col>
      </Row>

      {/* Endereço */}
      <Card size="small" title="Endereço" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="postal_code" label="CEP">
              <Input placeholder="00000-000" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="state" label="Estado">
              <Input placeholder="UF" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="city" label="Cidade">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="neighborhood" label="Bairro">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="street_type" label="Tipo de Via">
              <Input placeholder="Rua, Av., Trav., etc." />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="street_name" label="Nome da Via">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="house_number" label="Número">
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="address_complement" label="Complemento">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="reference_point" label="Ponto de Referência">
          <Input />
        </Form.Item>
      </Card>


      {/* Botões */}
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
