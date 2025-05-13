import { Layout, Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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
  full_name: string;
  sex: string;
  email: string;
  status: string;       // status de pagamento
  postalCode: string;
}

interface AuthResponse {
  token: string;
  userStorage: UserStorage;
}

// Tipagem do formulário de login
interface LoginForm {
  login: string;
  password: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values: LoginForm) => {
    const { login, password } = values;

    try {
      // Especifica AuthResponse para response.data
      const response = await api.post<AuthResponse>("/auth", {
        login,
        password,
      });

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
      <Layout style={styles.layout}>
        <Card style={{ width: "40vw", maxWidth: 400 }}>
          <Form<LoginForm> onFinish={handleLogin}>
            <img
              src="/imagens/logo_com_nome_colorido.svg"
              alt="Logo"
              width={200}
              style={styles.imagem}
            />

            <div style={styles.formItem}>
              <span style={styles.fieldLabel}>Login</span>
              <Item
                name="login"
                rules={[{ required: true, message: "Por favor, insira seu login!" }]}
              >
                <Input />
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
