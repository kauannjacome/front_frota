import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
} from 'antd';
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

interface UserStorage {
  id: string;
  full_name: string;
  role: string;
  subscribe_name?: string;
  subscribe_id?: string;
  state?: string;
  city?: string;
}

type Props = {
  initialValues: Partial<UserFormValues>;
  onFinish: (values: UserFormValues) => void;
  onCancel?: () => void;
  typeOptions?: { label: string; value: string }[];
  departmentOptions?: { label: string; value: number }[];
};

const defaultTypeOptions = [
  { label: 'Contratado', value: 'CONTRATADO' },
  { label: 'Diarista', value: 'DIARISTA' },
];

// 1) Array completo de roles, incluindo quem pode vê-los em cada opção
const allRoleOptions: Array<{
  label: string;
  value: string;
  allowedFor: string[];
}> = [
  { label: 'Gestor', value: 'MANAGER', allowedFor: ['MANAGER'] },
  { label: 'Secretário(a)', value: 'SECRETARY', allowedFor: ['MANAGER'] },
  {
    label: 'Administrador Local',
    value: 'ADMIN_LOCAL',
    allowedFor: ['MANAGER', 'ADMIN_LOCAL'],
  },
    {
    label: 'Supervisor',
    value: 'SUPERVISOR',
    allowedFor: ['MANAGER', 'ADMIN_LOCAL', 'SECRETARY'],
  },
  {
    label: 'Digitador',
    value: 'TYPIST',
    allowedFor: ['MANAGER', 'ADMIN_LOCAL', 'SECRETARY','SUPERVISOR'],
  },
  {
    label: 'Motorista',
    value: 'DRIVER',
    allowedFor: ['MANAGER', 'ADMIN_LOCAL','SUPERVISOR'],
  },
  {
    label: 'Digitador Fornecedor',
    value: 'TYPIST_SUPPLY',
    allowedFor: ['MANAGER'],
  },
    {
    label: 'Administrador Fornecedor',
    value: 'ADMIN_SUPPLY',
    allowedFor: ['MANAGER'],
  },
  {
    label: 'Digitador Fornecedor',
    value: 'TYPIST_SUPPLY',
    allowedFor: ['MANAGER'],
  },
];

export default function UserForm({
  initialValues,
  onFinish,
  onCancel,
  typeOptions = defaultTypeOptions,
  departmentOptions = [],
}: Props) {
  // 2) Estado para armazenar os dados de userStorage
  const [userStorage, setUserStorage] = useState<UserStorage | null>(null);

  // 3) Ao montar o componente, recuperar userStorage do localStorage
  useEffect(() => {
    const raw = localStorage.getItem('userStorage');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as UserStorage;
        setUserStorage(parsed);
      } catch {
        // Se der erro ao parsear, ignora
      }
    }
  }, []);

  // 4) Extrai a role atual (ou null se não houver userStorage)
  const currentRole = userStorage?.role ?? null;

  // 5) Filtra as opções de “role” com base em currentRole
  const filteredRoleOptions = allRoleOptions.filter((opt) => {
    // Se não houver userStorage (currentRole = null), exibimos todas as opções
    if (!currentRole) {
      return true;
    }
    // Caso haja currentRole, exibimos apenas os itens cujo allowedFor inclui essa role
    return opt.allowedFor.includes(currentRole);
  });

  return (
    <Form<UserFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        birth_date: initialValues.birth_date
          ? moment(initialValues.birth_date)
          : undefined,
        death_date: initialValues.death_date
          ? moment(initialValues.death_date)
          : undefined,
        accepted_terms_at: initialValues.accepted_terms_at
          ? moment(initialValues.accepted_terms_at)
          : undefined,
        // Pré-seleciona “role” usando initialValues.role ou currentRole
        role: initialValues.role || currentRole,
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="cpf"
            label="CPF"
            rules={[{ required: true, message: 'Informe o CPF' }]}
          >
            <Input placeholder="00000000000" maxLength={11} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="full_name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Informe o nome completo' }]}
          >
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

        <Col span={8}>
          <Form.Item
            name="role"
            label="Função"
            rules={[{ required: true, message: 'Informe a função' }]}
          >
            <Select placeholder="Selecione a função">
              {filteredRoleOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Informe o tipo' }]}
          >
            <Select placeholder="Selecione o tipo">
              {typeOptions?.map((opt) => (
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
