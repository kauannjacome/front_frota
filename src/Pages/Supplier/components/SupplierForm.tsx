import React from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';

export type SupplierFormValues = {
  name: string;
  telephone?: string;
  email?: string;
  cnpj?: string;
  category: string;
};

// Lista de categorias do fornecedor
const supplierCategories = [
  { value: 'POSTO_COMBUSTIVEL', label: 'Posto de Combustível' },
  { value: 'FORNECEDOR_PECAS', label: 'Peças de Reposição' },
  { value: 'COMPANHIA_TRANSPORTE', label: 'Emissão de Tickets/Passagens' },

];

interface Props {
  initialValues: Partial<SupplierFormValues>;
  onFinish: (values: SupplierFormValues) => void;
  onCancel?: () => void;
}

export default function SupplierForm({ initialValues, onFinish, onCancel }: Props) {
  return (
    <Form<SupplierFormValues>
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Informe o nome da empresa' }]}
          >
            <Input placeholder="Transporte Parceiro" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: 'Informe a categoria' }]}
          >
            <Select placeholder="Selecione a categoria">
              {supplierCategories.map(cat => (
                <Select.Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="telephone" label="Telefone">
            <Input placeholder="(00) 00000-0000" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="email" label="E-mail">
            <Input placeholder="email@parceiro.com" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="cnpj" label="CNPJ">
            <Input placeholder="00.000.000/0001-00" />
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
