import React, { useState } from "react";
import {
  Form,
  InputNumber,
  Button,
  Select,
  Grid,
  Typography,
  Row,
  Col,
} from "antd";

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export default function FuelLogAttendant() {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [total, setTotal] = useState(0);

  // Estilo responsivo do container
  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 400,
    margin: "0 auto",
    padding: screens.xs ? "0 16px" : undefined,
  };

  const onValuesChange = (_: any, values: any) => {
    const litros = values.litros || 0;
    const preco = values.preco || 0;
    setTotal(litros * preco);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    // enviar para API, etc.
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={containerStyle}>
      <Form
        form={form}
        name="fuel-log-form"
        layout="vertical"
        initialValues={{ litros: 0, preco: 0 }}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* Seleção de motorista */}
        <Form.Item
          label="Motorista"
          name="motorista"
          rules={[{ required: true, message: "Por favor, selecione o motorista!" }]}
        >
          <Select placeholder="Selecione um motorista">
            <Option value="joao">João</Option>
            <Option value="maria">Maria</Option>
            <Option value="pedro">Pedro</Option>
          </Select>
        </Form.Item>

        {/* Quantidade de litros */}
        <Form.Item
          label="Litros"
          name="litros"
          rules={[{ required: true, message: "Por favor, informe a quantidade de litros!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>



        {/* Valor total calculado */}
        <Form.Item>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                Valor Total:
              </Title>
            </Col>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                {`R$ ${total.toFixed(2)}`}
              </Title>
            </Col>
          </Row>
        </Form.Item>

        {/* Botão de envio */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              height: 50,
              fontSize: screens.xs ? 16 : 14,
              padding: "12px 0",
            }}
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
