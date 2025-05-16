import  { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Table,
  Row,
  Col,
  Button,
  AutoComplete,
  Spin,
} from 'antd';
import { states, cities } from 'estados-cidades';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import type { Veiculo } from '../../../common/store/VehicleStore';
import type { Person } from '../../../common/types';
import { TripStatusOptions } from '../../../common/types/constantsTypes';

export interface TripFormValues {
  start_state?: string;
  start_city?: string;
  end_state?: string;
  end_city?: string;
  start_time?: moment.Moment;
  back_time?: moment.Moment;
  purpose?: string;
  driver_id?: number;
  vehicle_id?: number;
  status?: string;
}

export interface PersonRow extends Person {
  dropoff_location: string;
  notes: string;
}

type Driver = { id: number; name: string };

type Props = {
  initialValues?: Partial<TripFormValues>;
  initialPersons?: PersonRow[];
  onFinish: (values: TripFormValues, persons: PersonRow[]) => void;
  onCancel?: () => void;
  loading?: boolean;
};

const { Option } = Select;

export default function TripForm({
  initialValues = {},
  initialPersons = [],
  onFinish,
  onCancel,
  loading = false,
}: Props) {
  const [form] = Form.useForm<TripFormValues>();
  // lista de UFs
  const ufs = states();

  // watchers do Form para 'start_state' e 'end_state'
  const startUf = Form.useWatch('start_state', form);
  const endUf = Form.useWatch('end_state', form);

  // cidades carregadas
  const [startCities, setStartCities] = useState<string[]>([]);
  const [endCities, setEndCities] = useState<string[]>([]);

  // sugestões de pessoa no AutoComplete
  const [suggestions, setSuggestions] = useState<{ label: string; value: string }[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [persons, setPersons] = useState<PersonRow[]>(initialPersons);

  // carrega veículos e motoristas
  useEffect(() => {
    api.get<Veiculo[]>('/vehicle')
      .then(res => setVeiculos(res.data))
      .catch(console.error);

    api.get<Driver[]>('/user/driver')
      .then(res => setDrivers(res.data))
      .catch(console.error);
  }, []);

  // carrega cidades de partida quando startUf mudar
  useEffect(() => {
    if (startUf) {
      setStartCities(cities(startUf));
    } else {
      setStartCities([]);
    }
  }, [startUf]);

  // carrega cidades de destino quando endUf mudar
  useEffect(() => {
    if (endUf) {
      setEndCities(cities(endUf));
    } else {
      setEndCities([]);
    }
  }, [endUf]);

  // manipula texto na tabela
  const handleInputChange = (
    id: number,
    field: 'dropoff_location' | 'notes',
    value: string
  ) => {
    setPersons(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // busca pessoas para AutoComplete
  const handleSearch = async (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    try {
      const { data } = await api.get<Person[]>('/person/search', { params: { quickSearch: value } });
      setSuggestions(data.map(p => ({ label: p.full_name, value: p.id.toString() })));
    } catch (err) {
      console.error('Erro ao buscar pessoas', err);
    }
  };

  // adiciona pessoa selecionada
  const handleSelect = (_: string, option: { value: string }) => {
    const id = Number(option.value);
    if (persons.some(p => p.id === id)) return;
    api.get<Person>(`/person/${id}`)
      .then(res => {
        const newPerson: PersonRow = { ...res.data, dropoff_location: '', notes: '' };
        setPersons(prev => [...prev, newPerson]);
      })
      .catch(err => console.error('Erro ao carregar pessoa', err));
  };

  // remove pessoa da lista
  const handleRemove = (id: number) => {
    setPersons(prev => prev.filter(p => p.id !== id));
  };

  // definição de colunas da tabela
  const columns: ColumnsType<PersonRow> = [
    { title: 'Nome Completo', dataIndex: 'full_name', key: 'full_name' },
    {
      title: 'Nascimento',
      dataIndex: 'birth_date',
      key: 'birth_date',
      render: date => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Local de Entrega',
      dataIndex: 'dropoff_location',
      key: 'dropoff_location',
      render: (_: any, record) => (
        <Input
          value={record.dropoff_location}
          onChange={e => handleInputChange(record.id, 'dropoff_location', e.target.value)}
          onBlur={() => console.log('Salvo:', record.id, record.dropoff_location)}
        />
      ),
    },
    {
      title: 'Notas',
      dataIndex: 'notes',
      key: 'notes',
      render: (_: any, record) => (
        <Input
          value={record.notes}
          onChange={e => handleInputChange(record.id, 'notes', e.target.value)}
          onBlur={() => console.log('Salvo:', record.id, record.notes)}
        />
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record) => (
        <Button type="link" onClick={() => handleRemove(record.id)}>
          Remover
        </Button>
      ),
    },
  ];

  // quando o formulário for enviado
  const onFormFinish = (values: TripFormValues) => {
    onFinish(values, persons);
  };

  return (
    <Spin spinning={loading}>
      <Form<TripFormValues>
        form={form}
        initialValues={initialValues}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <Card>
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item name="start_state" label="Estado início">
                <Select placeholder="UF" showSearch allowClear>
                  {ufs.map(uf => (
                    <Option key={uf} value={uf}>
                      {uf}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="start_city" label="Cidade início">
                <Select
                  placeholder="Cidade"
                  showSearch
                  allowClear
                  disabled={!startUf}
                >
                  {startCities.map(city => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="end_state" label="Estado final">
                <Select placeholder="UF" showSearch allowClear>
                  {ufs.map(uf => (
                    <Option key={uf} value={uf}>
                      {uf}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="end_city" label="Cidade final">
                <Select
                  placeholder="Cidade"
                  showSearch
                  allowClear
                  disabled={!endUf}
                >
                  {endCities.map(city => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="start_time" label="Data Ida">
                <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="back_time" label="Data Volta">
                <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="purpose" label="Propósito">
                <Input placeholder="Insira o propósito da viagem" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="driver_id" label="Motorista">
                <Select placeholder="Selecione o motorista" showSearch allowClear loading={!drivers.length}>
                  {drivers.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="vehicle_id" label="Veículo">
                <Select
                  placeholder="Selecione o veículo"
                  showSearch
                  allowClear
                  loading={!veiculos.length}
                  options={veiculos.map(v => ({ value: v.id, label: `${v.mark} ${v.model}` }))}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Selecione o status" allowClear>
                  {TripStatusOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 24 }}>
          <Row gutter={[8, 0]} wrap={false} align="middle" style={{ marginBottom: 24 }}>
            <Col flex="auto">
              <AutoComplete
                style={{ width: '80%' }}
                options={suggestions}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder="Digite nome da pessoa"
                filterOption={false}
              >
                <Input.Search enterButton />
              </AutoComplete>
            </Col>
            <Col flex="none">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Salvar
              </Button>
            </Col>
            <Col flex="none">
              <Button icon={<CloseOutlined />} onClick={onCancel}>
                Cancelar
              </Button>
            </Col>
          </Row>
          <Table<PersonRow>
            rowKey="id"
            columns={columns}
            dataSource={persons}
            pagination={{ pageSize: 100 }}
          />
        </Card>
      </Form>
    </Spin>
  );
}
