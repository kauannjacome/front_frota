import React from "react";
import { Drawer, Form, Upload, Button, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../services/api";

export interface UploadLogoDrawerProps {
  open: boolean;
  subscriberId: number;
  onClose: () => void;
  onUploaded?: () => void;
}

export default function UploadLogoDrawer({
  open,
  subscriberId,
  onClose,
  onUploaded,
}: UploadLogoDrawerProps) {
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    const { logoType, fileList } = values;
    if (!fileList || fileList.length === 0) {
      message.error("Selecione uma imagem");
      return;
    }
    const file = fileList[0].originFileObj;
    const formData = new FormData();
    formData.append("subscriber_id", String(subscriberId));
    formData.append("logoType", logoType);
    formData.append("file", file);

    try {
      await api.post(`/subscriber/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Logo enviado com sucesso!");
      form.resetFields();
      onClose();
      if (onUploaded) onUploaded();
    } catch (error) {
      console.error("Erro ao enviar logo:", error);
      message.error("Não foi possível enviar o logo.");
    }
  };

  return (
    <Drawer
      title="Upload de Logo"
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="logoType"
          label="Tipo de Logo"
          rules={[{ required: true, message: "Selecione o tipo de logo" }]}
        >
          <Select placeholder="Selecione o tipo">
            <Select.Option value="administration">Administração</Select.Option>
            <Select.Option value="municipal">Municipal</Select.Option>
            <Select.Option value="state">Estado</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fileList"
          label="Arquivo de Imagem"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => e?.fileList}
          rules={[{ required: true, message: "Selecione uma imagem" }]}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Selecione o arquivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}