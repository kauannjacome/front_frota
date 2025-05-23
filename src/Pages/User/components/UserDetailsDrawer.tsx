import { Drawer, Descriptions, Divider, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface UserDetailsDrawerProps {
  open: boolean;
  user_id: number | null;
  onClose: () => void;
}

export default function UserDetailsDrawer({
  open,
  user_id,
  onClose,
}: UserDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    api
      .get(`/user/${user_id}`)
      .then((res) => {
        setUserDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes do usuário:", err);
        setLoading(false);
      })

  }, [user_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes do Usuário"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => console.log("Imprimir usuário", user_id)}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : userDetails ? (
        <>
          <Descriptions bordered column={1} layout="horizontal">

            <Descriptions.Item label="Nome">{userDetails.name}</Descriptions.Item>
            <Descriptions.Item label="CPF">{userDetails.cpf}</Descriptions.Item>
            <Descriptions.Item label="CNH">{userDetails.cnh ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="E-mail">{userDetails.email ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="Telefone">{userDetails.phone_number ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="Cargo">{userDetails.role}</Descriptions.Item>


          </Descriptions>

          <Divider />
          <p style={{ textAlign: "center", color: "#999" }}>
            Registrado em{" "}
            {moment(userDetails.created_at).format("DD/MM/YYYY HH:mm")}, Atualizado em{" "}{moment(userDetails.created_at).format("DD/MM/YYYY HH:mm")}
          </p>

          {/* Espaço para informações adicionais, se necessário */}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
