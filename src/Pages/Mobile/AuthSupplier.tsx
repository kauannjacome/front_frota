import { Card, Layout, Form, Input, Button } from 'antd';
import api from '../../services/api';
import { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

// Defina a interface de resposta do login
interface LoginResponse {
  token: string;
  user: Record<string, any>; // ajuste para sua tipagem de usuário
}

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '1rem',
  backgroundColor: '#F1F3FB',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const logoStyle: CSSProperties = {
  width: '40%',
  maxWidth: '150px',
  marginBottom: '1.5rem',
};

const cardStyle: CSSProperties = {
  width: '90%',
  maxWidth: '400px',
  padding: '2rem',
  textAlign: 'center',
};

export default function AuthLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    navigate('/') ;

    try {
      // Especifica o tipo genérico para o retorno
      const response = await api.post<LoginResponse>('/auth/login', values);
      const { token, user } = response.data;

      // Armazene o token conforme sua necessidade (ex: localStorage)
      localStorage.setItem('authToken', token);

      // Redireciona para o dashboard, passando o usuário no state
      navigate('/dashboard', { state: { user } });
    } catch (error) {
      console.error('Erro ao efetuar login:', error);
      // Aqui você pode exibir uma mensagem de erro para o usuário
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={containerStyle}>
      <img
        src="/imagens/logo_com_nome_colorido.svg"
        alt="Logo"
        style={logoStyle}
      />
      <Card style={cardStyle}>
        <h1 style={{ marginBottom: '1rem' }}>Login</h1>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor insira seu email!' },
              { type: 'email', message: 'Formato de email inválido!' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
          >
            <Input.Password placeholder="Senha" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
}
