import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../../services/api';

export interface DepartmentFormValues {
  subscriber_id: number;
  name: string;
  department_logo?: string;
}

interface Props {
  initialValues: Partial<DepartmentFormValues>;
  onFinish: (values: DepartmentFormValues) => void;
  onCancel?: () => void;
}

export default function DepartmentForm({ initialValues, onFinish, onCancel }: Props) {
  const [subscribers, setSubscribers] = useState<{ id: number; name: string }[]>([]);

  const loadSubscribers = async () => {
    const response = await api.get<any>('/subscriber');
    try {

      console.log("Resposta /subscriber →", response.data);
      setSubscribers(response.data);
    } catch (error) {
      console.error('Erro ao carregar assinantes:', error);
      message.error('Não foi possível carregar assinantes.');
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);
  

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleLogoUpload = (file: any) => {
    // TODO: Replace with actual upload logic
    const fakeUrl = URL.createObjectURL(file);
    return Promise.resolve({ url: fakeUrl });
  };

  return (
    <Form<DepartmentFormValues>
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="subscriber_id"
            label="Assinante"
            rules={[{ required: true, message: 'Selecione o assinante' }]}
          >
            <Select placeholder="Selecione um assinante">
              {subscribers.map(sub => (
                <Select.Option key={sub.id} value={sub.id}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Nome do Departamento"
            rules={[{ required: true, message: 'Informe o nome do departamento' }]}
          >
            <Input placeholder="Secretaria de Administração" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="department_logo"
            label="Logo do Departamento"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="logo"
              listType="picture"
              customRequest={async ({ file, onSuccess }) => {
                const resp = await handleLogoUpload(file as File);
                onSuccess && onSuccess(resp, file as any);
              }}
            >
              <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
            </Upload>
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
