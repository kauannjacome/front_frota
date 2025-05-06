import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Space, Tag, Popconfirm, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../services/api';
import Table, { ColumnsType } from "antd/es/table";
import { Veiculo } from "../../common/store/VehicleStore";

interface Maintenance {
  id: number;
  vehicle_id: number;
  type: string;
  date: string;
  description: string;
  cost: number;
  next_due: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Maintenance() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<Maintenance[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState<string[]>([]);
  const onFinish = async (values: any) => {
    try {
      const response = await api.get<Maintenance[]>('/maintenance');
      setRecords(response.data);
      message.success('Manutenções carregadas com sucesso!');
      form.resetFields();
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error);
      message.error('Não foi possível carregar manutenções.');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/maintenance/${id}`);
      setRecords(prev => prev.filter(r => r.id !== id));
      message.success('Manutenção excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir manutenção:', error);
      message.error('Não foi possível excluir manutenção.');
    }
  };

  useEffect(() => {
    api.get<Veiculo[]>("/vehicle")
      .then(({ data }) => setVeiculos(data))
      .catch(err => {
        console.error("Erro ao carregar veículos", err);
        message.error("Não foi possível carregar a lista de veículos.");
      });
  }, []);
  console.log(veiculos)
  // Carrega logs e veículos ao montar
  useEffect(() => {

    api
      .get<string[]>('/maintenance/types')
      .then(({ data }) => setMaintenanceTypes(data))
      .catch(err => {
        console.error('Erro ao carregar typoes de combustivel', err);

      });
  }, []);
  console.log(maintenanceTypes)

  const columns: ColumnsType<Maintenance> = [

    {
      title: 'Veículo',
      key: 'vehicle',
      width: '12%',
      render: (_: any, record: Maintenance) => {
        // procura o veículo correspondente no state
        const vehicle = veiculos.find(v => v.id === record.vehicle_id);
        // aqui você pode escolher o que exibir: marca+modelo, apelido (surname), placa…
        return vehicle
          ? `${vehicle.mark} ${vehicle.model}`    // ou vehicle.surname, ou vehicle.plate
          : `#${record.vehicle_id}`;               // fallback caso não ache
      }
    },
    {
      title: 'Tipo', dataIndex: 'type', key: 'type', width: '15%',
      render: (type: string) => <Tag color={type === 'PREVENTIVA' ? 'blue' : 'volcano'}>{type}</Tag>
    },
    {
      title: 'Data', dataIndex: 'date', key: 'date', width: '15%',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    { title: 'Descrição', dataIndex: 'description', key: 'description', width: '25%' },
    {
      title: 'Custo', dataIndex: 'cost', key: 'cost', width: '10%',
      render: (cost: number) => `R$ ${cost.toFixed(2)}`
    },
    {
      title: 'Próximo', dataIndex: 'next_due', key: 'next_due', width: '15%',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      title: 'Ações', key: 'action', width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => message.info(`Editando manutenção ID: ${record.id}`)}>
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir essa manutenção?"
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <Form
          form={form}
          layout="inline"
          name="maintenanceForm"
          onFinish={onFinish}
        >
          <Form.Item label="Veiculo" name="vehicle_id">
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
          <Form.Item label="Tipo" name="type">
            <Select placeholder="Selecione o tipo">
              {maintenanceTypes.map(type => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Buscar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => message.info('Implementar criação de manutenção')}
            >
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Lista de Manutenções">
        <Table<Maintenance>
          rowKey="id"
          dataSource={records}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
