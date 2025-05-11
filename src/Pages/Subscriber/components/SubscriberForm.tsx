// src/pages/components/SubscriberForm.tsx
import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

export interface SubscriberFormValues {
  name: string;
  subscriber_name: string;
  cnpj?: string;
  email?: string;
  telephone?: string;
  postal_code?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state_full_name?: string;
  state_acronyms?: string;
  status: string;
}

interface Props {
  initialValues: Partial<SubscriberFormValues>;
  onFinish: (values: SubscriberFormValues) => void;
  onCancel?: () => void;
}

export default function SubscriberForm({ initialValues, onFinish, onCancel }: Props) {
  return (
    <Form<SubscriberFormValues>
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Nome Curto"
            rules={[{ required: true, message: 'Informe o nome curto do assinante' }]}
          >
            <Input placeholder="Prefeitura de Exemplo" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="subscriber_name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Informe o nome completo do assinante' }]}
          >
            <Input placeholder="Prefeitura Municipal de Exemplo" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="cnpj" label="CNPJ">
            <Input placeholder="12.345.678/0001-99" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="email" label="E-mail">
            <Input placeholder="contato@prefeitura.exemplo" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="telephone" label="Telefone">
            <Input placeholder="(11) 99999-0001" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="postal_code" label="CEP">
            <Input placeholder="01000-000" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="street" label="Rua">
            <Input placeholder="Rua Exemplo" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="number" label="Número">
            <Input placeholder="100" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="neighborhood" label="Bairro">
            <Input placeholder="Centro" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="city" label="Cidade">
            <Input placeholder="Exemplo City" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="state_full_name" label="Estado">
            <Input placeholder="Estado Exemplo" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="state_acronyms" label="Sigla do Estado">
            <Input placeholder="EX" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Informe o status' }]}> 
            <Input placeholder="PAGO" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
        {onCancel && (
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
