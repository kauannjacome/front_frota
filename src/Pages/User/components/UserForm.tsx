// src/pages/components/UserForm.tsx
import { Form, Input, DatePicker, InputNumber, Switch, Button, Row, Col, Checkbox } from 'antd';
import moment from 'moment';

export interface UserFormValues {
  cpf: string;
  name: string;
  cnh?: string | null;
  email?: string | null;
  phone_number?: string;
  password_hash: string;
  is_password_temp: boolean;
  number_try: number;
  is_blocked: boolean;
  role: string;
  type: string;
  accepted_terms: boolean;
  accepted_terms_at?: moment.Moment | null;
  accepted_terms_version?: string | null;
  subscriber_id: number;
  supplier_id?: number | null;
}

type Props = {
  initialValues: Partial<UserFormValues>;
  onFinish: (values: UserFormValues) => void;
  onCancel?: () => void;
};

export default function UserForm({ initialValues, onFinish, onCancel }: Props) {
  return (
    <Form<UserFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
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
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
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
          <Form.Item
            name="password_hash"
            label="Senha"
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password placeholder="Senha" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="is_password_temp" label="Senha Temporária" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="number_try" label="Número de tentativas">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="is_blocked" label="Bloqueado" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="role" label="Função" rules={[{ required: true, message: 'Informe a função' }]}>
            <Input placeholder="ADMIN_LOCAL" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="type" label="Tipo" rules={[{ required: true, message: 'Informe o tipo' }]}>
            <Input placeholder="CONTRATADO" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="accepted_terms" valuePropName="checked">
            <Checkbox>Aceitou termos</Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="accepted_terms_at" label="Data de aceitação">
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="accepted_terms_version" label="Versão dos termos">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="subscriber_id" hidden>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="supplier_id" hidden>
        <Input type="number" />
      </Form.Item>

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
