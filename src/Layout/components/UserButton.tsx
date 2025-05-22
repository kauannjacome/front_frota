import React, { useState } from "react";
import { Dropdown, Button, Avatar, Typography } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface UserStorage {
  id: string;
  name: string;
  role: string;
  subscribe_name: string;
}

export default function UserButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Pega os dados do usuário armazenados no sessionStorage
  const stored = sessionStorage.getItem("userStorage");
  const user: UserStorage = stored
    ? JSON.parse(stored)
    : { id: "", name: "Usuário Teste", role: "", subscribe_name: "" };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      sessionStorage.clear();
      localStorage.removeItem("authTokenFrota");
      navigate("/");
    }
    setOpen(false);
  };

  const menuItems = [
    {
      label: "Meu Perfil",
      key: "profile",
      icon: <UserOutlined />,
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
          {user.name}
        </Text>
        <Text type="secondary" style={{ marginRight: 8 }}>
          {user.subscribe_name}
        </Text>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}
