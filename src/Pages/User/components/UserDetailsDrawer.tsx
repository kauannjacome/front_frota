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
          <Descriptions bordered column={2} layout="horizontal">
            <Descriptions.Item label="ID">{userDetails.id}</Descriptions.Item>
            <Descriptions.Item label="UUID">{userDetails.uuid}</Descriptions.Item>
            <Descriptions.Item label="Nome">{userDetails.name}</Descriptions.Item>
            <Descriptions.Item label="CPF">{userDetails.cpf}</Descriptions.Item>
            <Descriptions.Item label="CNH">{userDetails.cnh ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="E-mail">{userDetails.email ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="Telefone">{userDetails.phone_number ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="Cargo">{userDetails.role}</Descriptions.Item>
            <Descriptions.Item label="Tipo">{userDetails.type}</Descriptions.Item>
            <Descriptions.Item label="Bloqueado">
              {userDetails.is_blocked ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Senha Temporária">
              {userDetails.is_password_temp ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Tentativas Falhas">
              {userDetails.number_try}
            </Descriptions.Item>
            <Descriptions.Item label="Termos Aceitos">
              {userDetails.accepted_terms ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Data Aceite Termos">
              {userDetails.accepted_terms_at
                ? moment(userDetails.accepted_terms_at).format("DD/MM/YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Criado Em">
              {moment(userDetails.created_at).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Atualizado Em">
              {moment(userDetails.updated_at).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Deletado Em">
              {userDetails.deleted_at
                ? moment(userDetails.deleted_at).format("DD/MM/YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          {/* Espaço para informações adicionais, se necessário */}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
