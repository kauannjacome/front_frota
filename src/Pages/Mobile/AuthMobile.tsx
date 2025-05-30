import { Layout, Card, Form, Input, Button, message } from "antd";
import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {jwtDecode} from "jwt-decode";

// Tipagens
interface UserStorage {
  id: string;
  full_name: string;
  role: string;
  subscribe_name: string;
}

interface AuthResponse {
  status: number;
  message: string;
  userStorage: UserStorage;
  token: string;
}

interface LoginForm {
  email: string;
  password: string;
}

export interface JWTPayload {
  id: number;
  role: string;
  subscriber_id?: number;
  department_id?: number;
  iat: number;
  exp: number;
}

const containerStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "1rem",
  backgroundColor: "#F1F3FB",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const logoStyle: CSSProperties = {
  width: "50%",
  maxWidth: "180px",
  marginBottom: "1.5rem",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "360px",
  padding: "2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: "8px",
};

export default function AuthMobile() {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const response = await api.post<AuthResponse>("/auth", { email, password });

      if (response.status === 200 && response.data.userStorage) {
        messageApi.success("Login realizado com sucesso");

        const { token, userStorage } = response.data;
        // Salva token e dados do usuário
        localStorage.setItem("authTokenFrota", token);
        sessionStorage.setItem("userStorage", JSON.stringify(userStorage));

        // Decodifica payload para regras de navegação
        const payload = jwtDecode<JWTPayload>(token);
        switch (userStorage.role) {
          case "MANAGE":
            navigate("admin/subscriber");
            break;
          case "ADMIN_LOCAL":
            navigate(`/admin/department/${payload.subscriber_id}`);
            break;
          case "SECRETARY":
          case "TYPIST":
            navigate("/trip");
            break;
          default:
            navigate("/");
        }
      } else {
        console.error("Resposta inesperada da API:", response);
        messageApi.error("Erro inesperado ao fazer login.");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          messageApi.error("Usuário ou senha incorretos");
        } else if (status === 500) {
          messageApi.error("Erro no servidor. Verifique o back-end.");
        } else {
          const msg = error.response.data?.message || "Ocorreu um erro.";
          messageApi.error(`Erro ${status}: ${msg}`);
        }
      } else {
        messageApi.error("Não foi possível conectar. Verifique sua rede.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Layout style={containerStyle}>
        <img
          src="/logo_larga.png"
          alt="Logo"
          style={logoStyle}
        />
        <Card style={cardStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Entrar</h2>
          <Form<LoginForm>
            layout="vertical"
            onFinish={handleLogin}
          >
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: "Por favor insira seu e-mail!" },
                { type: "email", message: "Formato de e-mail inválido!" }
              ]}
            >
              <Input placeholder="seu@exemplo.com" />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: "Por favor insira sua senha!" }]}
            >
              <Input.Password placeholder="••••••••" autoComplete="current-password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ borderRadius: 4 }}
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    </>
  );
}
