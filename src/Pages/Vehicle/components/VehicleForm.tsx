// components/VehicleForm.tsx
import { Form, Input, DatePicker, Row, Col, Button, Switch } from 'antd';
import moment from 'moment';

export default function VehicleForm({
  initialValues,
  onFinish,
  onCancel,
}: {
  initialValues: VehicleFormValues;
  onFinish: (values: VehicleFormValues) => void;
  onCancel?: () => void;
}) {
  return (
    <Form<VehicleFormValues>
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="surname" label="Apelido">
            <Input placeholder="Ex: Kombi Azul" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="mark" label="Marca">
            <Input placeholder="Marca do veículo" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="model" label="Modelo">
            <Input placeholder="Modelo do veículo" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="capacity_person" label="Capacidade de Pessoas">
            <Input type="number" min={1} placeholder="Ex: 4" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name="plate"
            label="Placa"
            rules={[{ required: true, message: 'Informe a placa' }]}
          >
            <Input placeholder="ABC-1234" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="renavam"
            label="Renavam"
            rules={[{ required: true, message: 'Informe o Renavam' }]}
          >
            <Input placeholder="Número do Renavam" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="licensing" label="Licenciamento">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            name="is_people"
            label="Transporte de Pessoas"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="is_internal_department"
            label="Uso Interno"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="in_service"
            label="Em Serviço"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="available"
            label="Disponível"
            valuePropName="checked"
          >
            <Switch />
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

export interface VehicleFormValues {
  id?: number;
  subscriber_id?: number;
  capacity_person?: number;
  surname?: string;
  mark?: string;
  model?: string;
  plate: string;
  renavam: string;
  is_people: boolean;
  is_internal_department: boolean;
  in_service: boolean;
  available: boolean;
  licensing?: moment.Moment;
  from_department_id?: number;
  to_department_id?: number;
}
