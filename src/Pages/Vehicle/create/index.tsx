import React from 'react';
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';

const { Option } = Select;

// Definições de tipos e enum inline
export enum VehicleType {
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  // Adicione outros tipos conforme necessário
}

export interface CreateVehicleFormValues {
  subscriber_id: number;
  plate: string;
  renavam: string;
  type: VehicleType;
  surname?: string;
  mark?: string;
  model?: string;
  in_service?: boolean;
  available?: boolean;
  department_id?: number;
}

export default function VehicleCreate() {
  const navigate = useNavigate();

  const [form] = Form.useForm<CreateVehicleFormValues>();

  const handleFinish = (values: CreateVehicleFormValues) => {
    // aqui você chama sua API ou passa pra props.onSubmit
    console.log('Valores do formulário:', values);
  };

  return (
    <Form<CreateVehicleFormValues>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ in_service: false, available: false }}
    >
      {/* Gutter de 16px horizontal e 24px vertical */}
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="plate"
            label="Placa"
            rules={[{ required: true, message: 'Informe a placa do veículo' }]}
          >
            <Input placeholder="ABC-1234" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="renavam"
            label="Renavam"
            rules={[{ required: true, message: 'Informe o renavam do veículo' }]}
          >
            <Input placeholder="00000000000" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="type"
            label="Tipo de Veículo"
            rules={[{ required: true, message: 'Selecione o tipo de veículo' }]}
          >
            <Select placeholder="Selecione o tipo">
              {Object.values(VehicleType).map((vt) => (
                <Option key={vt} value={vt}>
                  {vt
                    .split('_')
                    .join(' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item name="surname" label="Identificador">
            <Input placeholder="Ex: Frota A" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item name="mark" label="Marca">
            <Input placeholder="Ex: Toyota" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item name="model" label="Modelo">
            <Input placeholder="Ex: Corolla" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="in_service"
            label="Em Serviço"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="available"
            label="Disponível"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item name="department_id" label="ID do Departamento">
            <InputNumber style={{ width: '100%' }} placeholder="123" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ display:"flex", marginTop: 24, gap:'200px' }}>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
        <Button type="primary"        onClick={()=>{ navigate(-1);}} >
          cancelar
        </Button>
      </Form.Item>
    </Form>
  );
}
