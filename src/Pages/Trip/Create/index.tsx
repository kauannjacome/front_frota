import { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Card, Table, Row, Col, Button, AutoComplete } from 'antd';
import { states, cities } from 'estados-cidades';
import moment from 'moment';
import { TripStatusOptions } from '../../../common/types/constantsTypes';
import type { Person } from '../../../common/types';
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../../services/api';

// Extende Person com campos editáveis
interface PersonRow extends Person {
  dropoff_location: string;
  notes: string;
}

const { Option } = Select;

export default function CreateTrip() {
  const [ufs, setUfs] = useState<string[]>([]);
  const [startCities, setStartCities] = useState<string[]>([]);
  const [endCities, setEndCities] = useState<string[]>([]);
  const [startUf, setStartUf] = useState<string>();
  const [endUf, setEndUf] = useState<string>();
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  const [suggestions, setSuggestions] = useState<{ label: string; value: string }[]>([]);
  // Estado agora usa PersonRow
  const [persons, setPersons] = useState<PersonRow[]>([]);

  useEffect(() => {
    setUfs(states());
  }, []);

  useEffect(() => {
    if (!startUf) {
      setStartCities([]);
      return;
    }
    setLoadingStart(true);
    setStartCities(cities(startUf));
    setLoadingStart(false);
  }, [startUf]);

  useEffect(() => {
    if (!endUf) {
      setEndCities([]);
      return;
    }
    setLoadingEnd(true);
    setEndCities(cities(endUf));
    setLoadingEnd(false);
  }, [endUf]);

  // Handle inline edits para dropoff_location e notes
  const handleInputChange = (
    id: number,
    field: 'dropoff_location' | 'notes',
    value: string
  ) => {
    setPersons(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
    // Opcional: persistir imediatamente
    // api.patch(`/person/${id}`, { [field]: value }).catch(console.error);
  };

  const columns: ColumnsType<PersonRow> = [
    { title: 'Nome Completo', dataIndex: 'full_name', key: 'full_name', width: '25%' },
    {
      title: 'Nascimento',
      dataIndex: 'birth_date',
      key: 'birth_date',
      width: '15%',
      render: date => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Local de Entrega',
      dataIndex: 'dropoff_location',
      key: 'dropoff_location',
      width: '25%',
      render: (_: string, record: PersonRow) => (
        <Input
          value={record.dropoff_location}
          onChange={e =>
            handleInputChange(record.id, 'dropoff_location', e.target.value)
          }
          onBlur={() => console.log('Salvo:', record.id, record.dropoff_location)}
        />
      ),
    },
    {
      title: 'Notas',
      dataIndex: 'notes',
      key: 'notes',
      width: '25%',
      render: (_: string, record: PersonRow) => (
        <Input
          value={record.notes}
          onChange={e =>
            handleInputChange(record.id, 'notes', e.target.value)
          }
          onBlur={() => console.log('Salvo:', record.id, record.notes)}
        />
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: '10%',
      render: (_: any, record: PersonRow) => (
        <Button type="link" onClick={() => handleRemove(record.id)}>
          Remover
        </Button>
      ),
    },
  ];

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

  const handleSelect = (_: string, option: any) => {
    const id = Number(option.value);
    if (persons.some(p => p.id === id)) return;
    api.get<Person>(`/person/${id}`)
      .then(res => {
        // Adiciona campos vazios para edição
        const newPerson: PersonRow = {
          ...res.data,
          dropoff_location: '',
          notes: '',
        };
        setPersons(prev => [...prev, newPerson]);
      })
      .catch(err => console.error('Erro ao carregar pessoa', err));
  };

  const handleRemove = (id: number) => {
    setPersons(prev => prev.filter(p => p.id !== id));
  };

  const handleFinish = (values: any) => {
    console.log('Formulário enviado:', values, 'Pessoas:', persons);
    // TODO: chamar API para salvar viagem com persons
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Form layout="vertical" onFinish={handleFinish}>
          {/* Primeira linha: início e fim */}
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item label="Estado início" name="start_state">
                <Select placeholder="UF" showSearch allowClear onChange={setStartUf}>
                  {ufs.map(uf => <Option key={uf} value={uf}>{uf}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Cidade início" name="start_city">
                <Select placeholder="Cidade" showSearch allowClear disabled={!startUf} loading={loadingStart}>
                  {startCities.map(city => <Option key={city} value={city}>{city}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Data início" name="start_time">
                <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Estado final" name="end_state">
                <Select placeholder="UF" showSearch allowClear onChange={setEndUf}>
                  {ufs.map(uf => <Option key={uf} value={uf}>{uf}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Cidade final" name="end_city">
                <Select placeholder="Cidade" showSearch allowClear disabled={!endUf} loading={loadingEnd}>
                  {endCities.map(city => <Option key={city} value={city}>{city}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Data final" name="end_time">
                <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Segunda linha: propósito, motorista, veículo, status */}
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="purpose" label="Propósito">
                <Input placeholder="Insira o propósito da viagem" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="driver_id" label="Motorista">
                <Select placeholder="Selecione o motorista" showSearch allowClear>
                  <Option value={1}>Motorista 1</Option>
                  <Option value={2}>Motorista 2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="vehicle_id" label="Veículo">
                <Select placeholder="Selecione o veículo" showSearch allowClear>
                  <Option value={1}>Veículo 1</Option>
                  <Option value={2}>Veículo 2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="Status" initialValue="PENDENTE">
                <Select placeholder="Selecione o status" allowClear>
                  {TripStatusOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Card>

      <Card style={{ marginTop: 24, gap: 5 }}>
        {/* Autocomplete para pessoas */}
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
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ width: 160 }}
            >
              Salvar
            </Button>
          </Col>
          <Col flex="none">
            <Button icon={<CloseOutlined />}>Cancelar</Button>
          </Col>
        </Row>

        <Table<PersonRow>
          rowKey="id"
          columns={columns}
          dataSource={persons}
          pagination={{ pageSize: 100 }}
        />
      </Card>
    </div>
  );
}