import { Layout, Card, Form, Input, Button, message, Grid } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const { Item } = Form;
const { Password } = Input;
const { useBreakpoint } = Grid;

interface UserStorage {
  id: string;
  full_name: string;
  sex: string;
  email: string;
  status: string;
  postalCode: string;
}

interface AuthResponse {
  token: string;
  userStorage: UserStorage;
}

interface LoginForm {
  login: string;
  password: string;
}

export default function AuthSupplier() {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Calcula largura baseada no ponto de quebra ativo
  const cardWidth = screens.xs
    ? "90vw"
    : screens.sm
    ? "70vw"
    : screens.md
    ? "50vw"
    : "40vw";

  const handleLogin = async (values: LoginForm) => {
    const { login, password } = values;
    try {
      const response = await api.post<AuthResponse>("/auth", { login, password });
      if (response.status === 200 && response.data.userStorage) {
        messageApi.success("Login realizado com sucesso");
        const { token, userStorage } = response.data;
        const storageData = {
          id: userStorage.id,
          full_name: userStorage.full_name,
          sex: userStorage.sex,
          email: userStorage.email,
          late_payment: userStorage.status,
          postalCode: userStorage.postalCode,
        };
        sessionStorage.setItem("token_akautec_protocol", token);
        sessionStorage.setItem("user_data", JSON.stringify(storageData));
        navigate("/home");
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
              `Erro: ${error.response.status} - ${
                error.response.data.message || "Ocorreu um erro inesperado"
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

  const navigateToRecovery = () => {
    navigate("/recovery");
  };

  return (
    <>
      {contextHolder}
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Card style={{ width: cardWidth, maxWidth: 400 }}>
          <Form<LoginForm> layout="vertical" onFinish={handleLogin}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img
                src="/imagens/logo_com_nome_colorido.svg"
                alt="Logo"
                width={screens.xs ? 150 : 200}
              />
            </div>

            <Item
              label="Login"
              name="login"
              rules={[{ required: true, message: "Por favor, insira seu login!" }]}
            >
              <Input placeholder="Seu usuário ou e-mail" />
            </Item>

            <Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
            >
              <Password placeholder="Digite sua senha" autoComplete="current-password" />
            </Item>

            <Item>
              <Button type="primary" htmlType="submit" block>
                Entrar
              </Button>
            </Item>

            <Item>
              <Button type="link" onClick={navigateToRecovery} block>
                Esqueci minha senha
              </Button>
            </Item>
          </Form>
        </Card>
      </Layout>
    </>
  );
}
