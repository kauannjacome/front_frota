import { useState } from "react";
import { Dropdown, Button, Avatar, Typography } from "antd";
import { UserOutlined, DownOutlined, SettingOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

interface UserStorage {
  id: string;
  full_name: string;
  role: string;

  subscribe_id: number,
  subscribe_name: string;
}


export default function UserButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  let user: UserStorage = {
    id: "",
    full_name: "Usuário Teste",
    role: "",
     subscribe_id: 0,
    subscribe_name: "",
  };

  try {
    const json = sessionStorage.getItem("userStorage");
    if (json) {
      user = JSON.parse(json);
    }
  } catch (e) {
    console.warn("Erro ao ler ou parsear userStorage:", e);
  }



  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      sessionStorage.clear();
      localStorage.removeItem("authTokenFrota");
      navigate("/");
    }

    if (key === "department") {
      // Aqui você “atira” no clique do menu “Escolher assinatura”.
      // Por exemplo, navegar para uma outra rota ou disparar uma função de atualização:
      navigate(`/admin/department/${user.subscribe_id}`);
      return;
    }

    if (key === "manager") {
      // Aqui você “atira” no clique do menu “Escolher assinatura”.
      // Por exemplo, navegar para uma outra rota ou disparar uma função de atualização:
      navigate("/admin/subscriber");
      return;
    }
    setOpen(false);
  };

  const menuItems = [

    {
      label: "Meu Perfil",
      key: "profile",
      icon: <UserOutlined />,
    },
    (user.role === "ADMIN_LOCAL" || user.role === "MANAGER") && {
      label: "Departamento",
      key: "department",
      icon: <SettingOutlined />,
    },
    user.role === "MANAGER" && {
      label: "Escolher assinatura",
      key: "manager",
      icon: <UnorderedListOutlined />,
    },
    {
      label: "Sair",
      key: "logout",
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
    >
      <Button type="text" style={{ display: "flex", alignItems: "center" }}>
        <Avatar icon={<UserOutlined />} />
        <Text strong style={{ color: "#fff", margin: "0 8px" }}>
          {user.full_name}
        </Text>
        <Text type="secondary" style={{ marginRight: 8 }}>
          {user.subscribe_name}
        </Text>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}
