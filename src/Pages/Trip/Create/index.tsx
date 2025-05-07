import { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Card, Table, Row, Col, Button } from 'antd';
import { states, cities } from 'estados-cidades';
import moment from 'moment';
import { TripStatusOptions } from '../../../common/types/constantsTypes';
import type { Person } from '../../../common/types';
import type { ColumnsType } from 'antd/es/table';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function CreateTrip() {
  const [ufs, setUfs] = useState<string[]>([]);
  const [startCities, setStartCities] = useState<string[]>([]);
  const [endCities, setEndCities] = useState<string[]>([]);
  const [startUf, setStartUf] = useState<string>();
  const [endUf, setEndUf] = useState<string>();
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

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

  const columns: ColumnsType<Person> = [
    { title: 'Nome Completo', dataIndex: 'full_name', key: 'full_name', width: '25%' },
    {
      title: 'Nascimento',
      dataIndex: 'birth_date',
      key: 'birth_date',
      width: '15%',
      render: d => moment(d).format('DD/MM/YYYY'),
    },
    { title: 'Local de Entrega', dataIndex: 'dropoff_location', key: 'dropoff_location', width: '25%' },
    { title: 'Notas', dataIndex: 'notes', key: 'notes', width: '35%' },
  ];

  const handleFinish = (values: any) => {
    console.log('Formulario enviado:', values);
    // chame sua API aqui...
  };

  return (
    <div style={{ padding: 24 }}>
            <Card >
      <Form layout="vertical" onFinish={handleFinish}>
        {/* Primeira linha: início e fim */}
        <Row gutter={16}>
          <Col span={3}>
            <Form.Item label="Estado início" name="start_state">
              <Select
                placeholder="UF"
                showSearch
                allowClear
                onChange={uf => setStartUf(uf)}
              >
                {ufs.map(uf => (
                  <Option key={uf} value={uf}>{uf}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Cidade início" name="start_city">
              <Select
                placeholder="Cidade"
                showSearch
                allowClear
                disabled={!startUf}
                loading={loadingStart}
              >
                {startCities.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Data início" name="start_time">
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Estado final" name="end_state">
              <Select
                placeholder="UF"
                showSearch
                allowClear
                onChange={uf => setEndUf(uf)}
              >
                {ufs.map(uf => (
                  <Option key={uf} value={uf}>{uf}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Cidade final" name="end_city">
              <Select
                placeholder="Cidade"
                showSearch
                allowClear
                disabled={!endUf}
                loading={loadingEnd}
              >
                {endCities.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Data final" name="end_time">
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
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
                {TripStatusOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      </Card>
      <Card title="Lista de Pessoas" style={{ marginTop: 24 }}>
        <Table<Person>
          rowKey="id"

          columns={columns}
          pagination={{ pageSize: 100 }}
        />
      </Card>

      <Button color="primary" variant="solid"   icon={<SaveOutlined />} >
        Salvar
      </Button>
      <Button color="danger" variant="solid"  icon={<CloseOutlined />}>
        Cancelar
      </Button>
    </div>
  );
}
