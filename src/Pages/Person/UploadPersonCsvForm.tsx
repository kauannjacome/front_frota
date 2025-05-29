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
} from "antd";
import type { RcFile } from "antd/es/upload/interface";  // Tipo de arquivo do Antd Upload
import { useState, useEffect } from "react";
import api from "../../services/api";

const { Option } = Select;
const { Content } = Layout;

type FileType = RcFile;  // Usamos RcFile, que estende File
interface Subscriber {
  id: number;
  name: string;
  subscriber_name: string;
}

export default function UploadPersonCsvForm() {
  const [form] = Form.useForm();
  const [subscriberId, setSubscriberId] = useState<number | null>(null);
  const [file, setFile] = useState<FileType | null>(null);
  const [uploading, setUploading] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Busca lista de assinantes no mount
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await api.get<Subscriber[]>('/subscriber');
        setSubscribers(response.data);
      } catch (error) {
        console.error(error);
        message.error('Falha ao carregar assinantes.');
      }
    };
    fetchSubscribers();
  }, []);

  // Intercepta o arquivo antes do upload e armazena no state
  const handleUpload = (file: FileType) => {
    setFile(file);
    return false; // Impede upload automático do Antd
  };

  const handleFormSubmit = async () => {
    if (!subscriberId || !file) {
      message.error("Por favor, selecione um assinante e um arquivo CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subscriberId", String(subscriberId));

    try {
      setUploading(true);
      const response = await api.post("/person/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success(`Upload bem‑sucedido! pessoas criadas.`);
      form.resetFields();
      setFile(null);
      setSubscriberId(null);
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
    <Layout style={{ minHeight: "100%" }}>
      <Content style={{ padding: 20 }}>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Assinante"
                  name="subscriberId"
                  rules={[
                    { required: true, message: "Selecione um assinante!" },
                  ]}
                >
                  <Select
                    placeholder="Selecione Assinante"
                    onChange={(value: number) => setSubscriberId(value)}
                    value={subscriberId || undefined}
                    loading={!subscribers.length}
                  >
                    {subscribers.map(sub => (
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
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e && e.fileList}
                  rules={[
                    { required: true, message: "Envie um arquivo CSV!" },
                  ]}
                >
                  <Upload
                    accept=".csv"
                    beforeUpload={handleUpload}
                    maxCount={1}
                    multiple={false}
                    fileList={file ? [file as any] : []}
                  >
                    <Button icon={<UploadOutlined />}>Selecionar CSV</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
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
}
