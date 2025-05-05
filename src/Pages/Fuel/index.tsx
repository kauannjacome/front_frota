import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, DatePicker, Select, Button, message, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import api from '../../services/api';
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

  // Carrega todos os registros ao montar o componente
  useEffect(() => {
    loadFuelLogs();
  }, []);

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
    { title: 'Veículo', dataIndex: 'vehicle_id', key: 'vehicle_id', width: '10%' },
    {
      title: 'Data', dataIndex: 'supply_date', key: 'supply_date',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      width: '15%'
    },
    { title: 'Litros', dataIndex: 'liters', key: 'liters', width: '10%' },
    { title: 'Custo', dataIndex: 'cost', key: 'cost', width: '10%' },
    { title: 'Odômetro', dataIndex: 'odometer', key: 'odometer', width: '10%' },
    { title: 'Tipo Combustível', dataIndex: 'fuel_type', key: 'fuel_type', width: '15%' },
    { title: 'Tipo Abastecimento', dataIndex: 'supply_type', key: 'supply_type', width: '15%' },
    {
      title: 'Ações', key: 'action', width: '10%', render: (_, record) => (
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
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card title="Registrar Abastecimento">
        <Form
          form={createForm}
          layout="vertical"
          onFinish={onCreate}
        >
          <Form.Item
            label="ID do Veículo"
            name="vehicle_id"
            rules={[{ required: true, message: 'Informe o ID do veículo' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Data de Abastecimento"
            name="supply_date"
            rules={[{ required: true, message: 'Informe a data' }]}
          >
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>

      

          <Form.Item
            label="Tipo de Combustível"
            name="fuel_type"
            rules={[{ required: true, message: 'Selecione o tipo de combustível' }]}
          >
            <Select>
              <Select.Option value="GASOLINA">Gasolina</Select.Option>
              <Select.Option value="DIESEL">Diesel</Select.Option>
              <Select.Option value="ETANOL">Etanol</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tipo de Abastecimento"
            name="supply_type"
            rules={[{ required: true, message: 'Selecione o tipo de abastecimento' }]}
          >
            <Select>
              <Select.Option value="COMPLETE">Completo</Select.Option>
              <Select.Option value="PARCIAL">Parcial</Select.Option>
            </Select>
          </Form.Item>

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
