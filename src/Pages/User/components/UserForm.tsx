import React from 'react';
import { Form, Input, DatePicker, InputNumber, Switch, Button, Row, Col, Select } from 'antd';
import moment, { Moment } from 'moment';

export interface UserFormValues {
  cpf: string;
  full_name: string;
  cnh?: string | null;
  email?: string | null;
  phone_number?: string | null;
  nationality?: string | null;
  birth_date?: Moment | null;
  death_date?: Moment | null;
  mother_name?: string | null;
  father_name?: string | null;
  password_hash: string;
  is_password_temp: boolean;
  number_try: number;
  is_blocked: boolean;
  role: string;
  type: string;
  accepted_terms: boolean;
  accepted_terms_at?: Moment | null;
  accepted_terms_version?: number | null;
  subscriber_id?: number;
  supplier_id?: number | null;
  department_ids?: number[];
}

type Props = {
  initialValues: Partial<UserFormValues>;
  onFinish: (values: UserFormValues) => void;
  onCancel?: () => void;
  roleOptions?: { label: string; value: string }[];
  typeOptions?: { label: string; value: string }[];
  departmentOptions?: { label: string; value: number }[];
};

const defaultTypeOptions = [
  { label: 'Contratado', value: 'CONTRATADO' },
  { label: 'Diarista', value: 'DIARISTA' },
];

const defaultRoleOptions = [
  { label: 'Gestor', value: 'MANAGER' },
  { label: 'Secretário(a)', value: 'SECRETARY' },
  { label: 'Administrador Local', value: 'ADMIN_LOCAL' },
  { label: 'Digitador', value: 'TYPIST' },
  { label: 'Motorista', value: 'DRIVER' },
  { label: 'Digitador Fornecedor', value: 'TYPIST_SUPPLY' },
];

export default function UserForm({
  initialValues,
  onFinish,
  onCancel,
  roleOptions = defaultRoleOptions,
  typeOptions = defaultTypeOptions,
  departmentOptions = [],
}: Props) {
  return (
    <Form<UserFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        birth_date: initialValues.birth_date ? moment(initialValues.birth_date) : undefined,
        death_date: initialValues.death_date ? moment(initialValues.death_date) : undefined,
        accepted_terms_at: initialValues.accepted_terms_at
          ? moment(initialValues.accepted_terms_at)
          : undefined,
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="cpf" label="CPF" rules={[{ required: true, message: 'Informe o CPF' }]}>            
            <Input placeholder="00000000000" maxLength={11} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="full_name" label="Nome Completo" rules={[{ required: true, message: 'Informe o nome completo' }]}>            
            <Input placeholder="Nome completo" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="cnh" label="CNH">
            <Input placeholder="Número da CNH" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="email" label="E-mail">
            <Input placeholder="email@exemplo.com" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="phone_number" label="Telefone">
            <Input placeholder="(00) 00000-0000" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="nationality" label="Nacionalidade">
            <Input placeholder="Nacionalidade" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="birth_date" label="Data de Nascimento">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="death_date" label="Data de Falecimento">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="mother_name" label="Nome da Mãe">
            <Input placeholder="Nome da mãe" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="father_name" label="Nome do Pai">
            <Input placeholder="Nome do pai" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="password_hash"
            label="Senha"
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password placeholder="Senha" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="is_password_temp" label="Senha Temporária" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="number_try" label="Tentativas de Login">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="is_blocked" label="Conta Bloqueada" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="role" label="Função" rules={[{ required: true, message: 'Informe a função' }]}>            
            <Select placeholder="Selecione a função">
              {roleOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="type" label="Tipo" rules={[{ required: true, message: 'Informe o tipo' }]}>            
            <Select placeholder="Selecione o tipo">
              {typeOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={4}>
          <Form.Item name="accepted_terms" label="Aceitou Termos" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="accepted_terms_at" label="Data Aceite">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="accepted_terms_version" label="Versão Termos">
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="subscriber_id" label="Assinante">
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="supplier_id" label="Fornecedor">
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="department_ids" label="Departamentos">
            <Select mode="multiple" placeholder="Selecione departamentos">
              {departmentOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
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
