import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  DatePicker,
  Select,
  Button,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import api from '../../services/api';
import { Veiculo } from '../../common/store/VehicleStore';
import ptBR from 'antd/lib/locale/pt_BR';
import ptBRDatePicker from 'antd/es/date-picker/locale/pt_BR';

import moment from 'moment';
interface FuelLog {
  id: number;
  uuid: string;
  vehicle_id: number;
  driver_id?: number;
  authorizer_id?: number;
  attendant_id?: number;
  person_id?: number;
  supply_date: string;
  deadline?: string;
  liters: number;
  cost: number;
  odometer: number;
  fuel_type: string;
  supply_type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Fuel() {
  const [createForm] = Form.useForm();
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [typesFuel, setTypesFuel] = useState<string[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);


  // Carrega logs e veículos ao montar
  useEffect(() => {
    loadFuelLogs();
    api
      .get<Veiculo[]>('/vehicle')
      .then(({ data }) => setVeiculos(data))
      .catch(err => {
        console.error('Erro ao carregar veículos', err);
        message.error('Não foi possível carregar a lista de veículos.');
      });
  }, []);

  // Carrega logs e veículos ao montar
  useEffect(() => {
    loadFuelLogs();
    api
      .get<string[]>('/fuel-log/types')
      .then(({ data }) => setTypesFuel(data))
      .catch(err => {
        console.error('Erro ao carregar typoes de combustivel', err);

      });
  }, []);
  console.log(typesFuel)
  const loadFuelLogs = async () => {
    try {
      const response = await api.get<FuelLog[]>('/fuel-log');
      setFuelLogs(response.data);
    } catch (error) {
      console.error('Erro ao buscar registros de abastecimento:', error);
      message.error('Não foi possível carregar os registros.');
    }
  };

  const onCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        supply_date: values.supply_date.toISOString(),
        deadline: values.deadline ? values.deadline.toISOString() : null,
      };
      await api.post('/fuel-log', payload);
      message.success('Registro de abastecimento criado com sucesso!');
      createForm.resetFields();
      loadFuelLogs();
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      message.error('Falha ao criar registro de abastecimento.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/fuel-log/${id}`);
      setFuelLogs(prev => prev.filter(log => log.id !== id));
      message.success('Registro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      message.error('Não foi possível remover o registro.');
    }
  };

  const columns: ColumnsType<FuelLog> = [
    {
      title: 'Veículo',
      key: 'vehicle',
      width: '12%',
      render: (_: any, record: FuelLog) => {
        const vehicle = veiculos.find(v => v.id === record.vehicle_id);
        return vehicle
          ? `${vehicle.mark} ${vehicle.model}`
          : `#${record.vehicle_id}`;
      },
    },
    {
      title: 'Data',
      dataIndex: 'supply_date',
      key: 'supply_date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      width: '15%',
    },
    { title: 'Litros', dataIndex: 'liters', key: 'liters', width: '10%' },
    { title: 'Custo', dataIndex: 'cost', key: 'cost', width: '10%' },
    { title: 'Odômetro', dataIndex: 'odometer', key: 'odometer', width: '10%' },
    {
      title: 'Tipo Combustível',
      dataIndex: 'fuel_type',
      key: 'fuel_type',
      width: '15%',
    },
    {
      title: 'Tipo Abastecimento',
      dataIndex: 'supply_type',
      key: 'supply_type',
      width: '15%',
    },
    {
      title: 'Ações',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Deseja excluir este registro?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card title="Registrar Abastecimento">
        <Form form={createForm} layout="vertical" onFinish={onCreate}>
          <div style={{ display: 'flex', gap: "18px" }}>
            <Form.Item
              label="Veículo"
              name="vehicle_id"
              rules={[{ required: true, message: 'Selecione o veículo' }]}
              style={{ flex: '0 0 20vw' }}

            >
              <Select
                placeholder="Selecione o veículo"
                loading={!veiculos.length}
                style={{ width: '100%' }}
              >
                {veiculos.map(v => (
                  <Select.Option key={v.id} value={v.id}>
                    {`${v.mark} ${v.model}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Data de Abastecimento"
              name="supply_date"
              rules={[{ required: true, message: 'Informe a data' }]}
              style={{ flex: '0 0 10vw' }}
            >
              <DatePicker style={{ width: '100%' }}
                locale={ptBRDatePicker}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              label="Tipo de Combustível"
              name="fuel_type"
              rules={[{ required: true, message: 'Selecione o tipo de combustível' }]}
              style={{ flex: '0 0 20vw' }}
            >
              <Select placeholder="Selecione o tipo">
                {typesFuel.map(type => (
                  <Select.Option key={type} value={type}>
                    {/* Se quiser exibir em maiúsculo apenas a primeira letra: */}
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Abastecimentos">
        <Table<FuelLog>
          rowKey="id"
          dataSource={fuelLogs}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
