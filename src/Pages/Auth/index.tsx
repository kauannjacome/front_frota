import { Layout, Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";


const { Item } = Form;
const { Password } = Input;

const styles = {
  layout: {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    height: "100vh",
  },
  imagem: {
    display: "block",
    margin: "0 auto 16px",
  },
  formItem: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 4,
    display: "block",
  },
  buttonGroup: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    marginTop: 16,
  },
};

// Tipagens para a resposta da API
interface UserStorage {
  id: string;
  name: string;
  role: string;
  subscribe_name: string;
}

interface AuthResponse {
  status: number;
  message: string;
  userStorage: UserStorage;
  token: string;
}

// Tipagem do formulário de login
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

export default function Auth() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values: LoginForm) => {
    const { email, password } = values;

    try {
      // Enviamos email e password, conforme o backend espera
      const response = await api.post<AuthResponse>("/auth", {
        email,
        password,
      });

      if (response.status === 200 && response.data.userStorage) {
        messageApi.success("Login realizado com sucesso");

        const { token, userStorage } = response.data;
        const storageData = {
          id: userStorage.id,
          name: userStorage.name,
          role: userStorage.role,
          subscribe_name: userStorage.subscribe_name,
        };

        localStorage.setItem("authTokenFrota", token);
        sessionStorage.setItem("userStorage", JSON.stringify(storageData));
        const payload = jwtDecode<JWTPayload>(token);
        if (storageData.role === 'MANAGE') {
          navigate("admin/subscriber");
        }
        if (storageData.role === 'ADMIN_LOCAL') {
          navigate(`/admin/department/${payload.subscriber_id}`);
        }
        if (storageData.role === 'SECRETARY') {
          navigate(`/trip`);
        }
        if (storageData.role === 'TYPIST') {
          navigate(`/trip`);
        }

      } else {
        console.error("Resposta inesperada da API:", response);
        messageApi.error("Ocorreu um erro inesperado ao fazer login.");
      }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            messageApi.error("Usuário ou senha incorretos");
            break;
          case 500:
            messageApi.error("Erro no servidor. Verifique o back-end.");
            break;
          default:
            messageApi.error(
              `Erro: ${error.response.status} - ${error.response.data.message || "Ocorreu um erro inesperado"
              }`
            );
        }
      } else {
        messageApi.error(
          "Não foi possível conectar ao servidor. Verifique sua conexão ou o back-end."
        );
      }
    }
  };


  return (
    <>
      {contextHolder}
      <Layout style={styles.layout}>
        <Card style={{ width: "40vw", maxWidth: 400 }}>
          <Form<LoginForm> onFinish={handleLogin}>
            {/* Se estiver usando Create React App, a pasta public já está no root */}
            <img
              src="/logo_larga.png"
              alt="Logo"
              width={200}
              style={styles.imagem}
            />

            <div style={styles.formItem}>
              <span style={styles.fieldLabel}>E-mail</span>
              <Item
                name="email"
                rules={[{ required: true, message: "Por favor, insira seu e-mail!" }]}
              >
                <Input type="email" />
              </Item>
            </div>

            <div style={styles.formItem}>
              <span style={styles.fieldLabel}>Senha</span>
              <Item
                name="password"
                rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
              >
                <Password
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </Item>
            </div>

            <div style={styles.buttonGroup}>
              <Button type="primary" htmlType="submit" block>
                Entrar
              </Button>
            </div>
          </Form>
        </Card>
      </Layout>
    </>
  );
}
