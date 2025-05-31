import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Layout,
  Card,
  Button,
  Select,
  Upload,
  Row,
  Col,
  Form,
  message,
  Input,
} from "antd";
import type { RcFile } from "antd/es/upload/interface";
import api from "../../services/api";
import { states, cities } from "estados-cidades";

const { Option } = Select;
const { Content } = Layout;

interface Subscriber {
  id: number;
  name: string;
  subscriber_name: string;
}

const UploadPersonCsvForm: React.FC = () => {
  const [form] = Form.useForm();
  const [subscriberId, setSubscriberId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [ufs] = useState<string[]>(states()); // lista de UFs
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string | undefined>(undefined);

  // Busca lista de assinantes ao montar
  useEffect(() => {
    api
      .get<Subscriber[]>("/subscriber")
      .then((res) => setSubscribers(res.data))
      .catch((err) => {
        console.error(err);
        message.error("Falha ao carregar assinantes.");
      });
  }, []);

  // Atualiza lista de cidades quando UF muda
  useEffect(() => {
    if (selectedUf) {
      setCitiesList(cities(selectedUf));
    } else {
      setCitiesList([]);
    }
  }, [selectedUf]);

  // Intercepta o arquivo antes do upload
  const handleBeforeUpload = (file: RcFile): boolean => {
    setFileList([file]);
    return false; // impede upload automático
  };

  // Envio do formulário
  const handleFormSubmit = async (values: any) => {
    if (!subscriberId || fileList.length === 0) {
      message.error("Selecione um assinante e envie um CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0]);
    formData.append("subscriberId", String(subscriberId));
    if (values.postal_code) formData.append("postal_code", values.postal_code);
    if (values.state) formData.append("state", values.state);
    if (values.city) formData.append("city", values.city);

    try {
      setUploading(true);
      await api.post("/person/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Upload bem-sucedido! Pessoas criadas.");
      form.resetFields();
      setFileList([]);
      setSubscriberId(null);
      setSelectedUf(undefined);
    } catch (error: any) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Falha no upload do CSV."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 24 }}>
        <Card title="Importar Pessoas via CSV">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{}}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Assinante"
                  name="subscriberId"
                  rules={[{ required: true, message: "Selecione um assinante!" }]}
                >
                  <Select
                    placeholder="Selecione o assinante"
                    onChange={(value: number) => setSubscriberId(value)}
                    value={subscriberId ?? undefined}
                    loading={!subscribers.length}
                  >
                    {subscribers.map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.subscriber_name || sub.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Arquivo CSV"
                  name="file"
                  rules={[{ required: true, message: "Envie um arquivo CSV!" }]}
                >
                  <Upload
                    accept=".csv"
                    beforeUpload={handleBeforeUpload}
                    fileList={fileList as any}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Selecionar CSV</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="postal_code" label="CEP">
                  <Input placeholder="00000-000" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="state" label="Estado">
                  <Select
                    placeholder="UF"
                    allowClear
                    onChange={(uf: string) => {
                      setSelectedUf(uf);
                      form.setFieldsValue({ city: undefined });
                    }}
                    value={selectedUf}
                  >
                    {ufs.map((uf) => (
                      <Option key={uf} value={uf}>
                        {uf}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="city" label="Cidade">
                  <Select
                    placeholder="Cidade"
                    showSearch
                    disabled={!selectedUf}
                    allowClear
                  >
                    {citiesList.map((city) => (
                      <Option key={city} value={city}>
                        {city}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<UploadOutlined />}
                    loading={uploading}
                  >
                    {uploading ? "Enviando..." : "Enviar CSV"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default UploadPersonCsvForm;
