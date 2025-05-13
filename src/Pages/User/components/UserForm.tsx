import { Form, Input, DatePicker, InputNumber, Switch, Button, Row, Col, Checkbox, Select } from 'antd';
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

// Opções baseadas nos enums type_contract e role_user
const typeOptions = [
  { label: 'Contratado', value: 'CONTRATADO' },
  { label: 'Diarista', value: 'DIARISTA' },
];

const roleOptions = [
  { label: 'Gestor', value: 'MANAGE' },
  { label: 'Secretario(a)', value: 'SECRETARY' },
  { label: 'Adiminstrador Local', value: 'ADMIN_LOCAL' },
  { label: 'Digitador', value: 'TYPIST' },
  { label: 'Motorista', value: 'DRIVE' },
  { label: 'Digitador Fornecedor', value: 'TYPIST_SUPPLY' },
];

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