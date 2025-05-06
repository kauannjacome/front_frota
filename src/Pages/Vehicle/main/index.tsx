import  { useState } from "react";
import { Card, Form, Input, Button, message, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import api from '../../../services/api';
import Table, { ColumnsType } from "antd/es/table";
interface Vehicle {
  id: number;
  subscriber_id: number;
  mark: string;
  model: string;
  plate: string;
  renavam: string;
  type: string;
  inService: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function Vehicle() {
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const onFinish = async (values: any) => {
    try {

      const response = await api.get<Vehicle[]>('/vehicle');
      console.log(response)
      setVehicles(response.data);
      message.success('Veículo adicionado com sucesso!');
      form.resetFields();
      // Opcional: atualizar tabela após adicionar
      // Você pode implementar um mecanismo de callback ou useContext para disparar um reload
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      message.error('Não foi possível adicionar o veículo.');
    }
  };


  const onDelete = async (id:number) => {

    try {

      await api.delete(`/vehicle/${id}`);
      // atualiza só no front
      setVehicles(prev => prev.filter(v => v.id !== id));
      message.success('Veículo excluído com sucesso!');

    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      message.error('Não foi possível adicionar o veículo.');
    }
  };

  // Colunas da tabela
  const columns: ColumnsType<Vehicle> = [
    { title: 'Apelido', dataIndex: 'surname', key: 'surname', width: '20%' },
    { title: 'Marca', dataIndex: 'mark', key: 'mark', width: '20%' },
    { title: 'Modelo', dataIndex: 'model', key: 'model', width: '20%' },
    { title: 'Placa', dataIndex: 'plate', key: 'plate', width: '10%' },

    {
      title: 'Disponível', dataIndex: 'available', key: 'available',
      render: (available: boolean) => <Tag color={available ? 'green' : 'volcano'}>{available ? 'Sim' : 'Não'}</Tag>
      , width: '10%'},

    {
      title: 'Ações', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button  color="cyan" variant="solid" onClick={() => { message.info(`Editando veículo ID: ${record.id}`); }}>
            Editar
          </Button>

          <Popconfirm
            title="Delete"
            description="Tem certezar deseja Excluir veiculo"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button variant="solid"  color="red">Delete</Button>
          </Popconfirm>
        </Space>
      ), width: '20%'
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 0, gap: "20px" }}>
      <Card >
        <Form
          form={form}
          layout="inline"         // <-- layout inline
          name="vehicleForm"
          onFinish={onFinish}
        >
          <Form.Item
            label="Apelido"
            name="surname"
          >
            <Input placeholder="Digite da Apelido" />
          </Form.Item>
 
          <Form.Item
            label="Placa"
            name="placa"
          >
            <Input placeholder="AAA-1234" maxLength={8} />
          </Form.Item>

          <div style={{ display: "flex", padding: 0, gap: "20px",marginTop: "20px" }}>
          <Form.Item>
            <Button type="primary"variant="solid"  htmlType="submit">
            <SearchOutlined />
              Buscar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button color="purple" variant="solid" type="primary"  >
              <PlusOutlined />
              Adicionar
            </Button>
          </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="Lista de Veículos">

        <Table<Vehicle>
          rowKey="id"
          dataSource={vehicles}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />

      </Card>
    </div>
  );
}
