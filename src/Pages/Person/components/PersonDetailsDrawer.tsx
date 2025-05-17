import { Drawer, Descriptions, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface PersonDetailsDrawerProps {
  open: boolean;
  person_id: number | null;
  onClose: () => void;
}

export default function PersonDetailsDrawer({
  open,
  person_id,
  onClose,
}: PersonDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [personDetails, setPersonDetails] = useState<any>(null);

  useEffect(() => {
    if (!person_id) return;
    setLoading(true);
    api
      .get(`/person/${person_id}`)
      .then((res) => {
        setPersonDetails(res.data);
             setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes do passageiro:", err);
             setLoading(false);
      })

  }, [person_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes do Passageiro"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => {
            console.log("Imprimir detalhes do passageiro");
          }}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : personDetails ? (
        <Descriptions bordered column={2} layout="horizontal">
          <Descriptions.Item label="CPF">{personDetails.cpf}</Descriptions.Item>
          <Descriptions.Item label="Nome Completo">{personDetails.full_name}</Descriptions.Item>
          <Descriptions.Item label="Nome Social">
            {personDetails.social_name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Data de Nascimento">
            {moment(personDetails.birth_date).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Data de Óbito">
            {personDetails.death_date
              ? moment(personDetails.death_date).format("DD/MM/YYYY")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nome da Mãe">
            {personDetails.mother_name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nome do Pai">
            {personDetails.father_name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="CEP">
            {personDetails.postal_code || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {personDetails.state || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Cidade">
            {personDetails.city || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Bairro">
            {personDetails.neighborhood || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Tipo de Logradouro">
            {personDetails.street_type || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nome do Logradouro">
            {personDetails.street_name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Número">
            {personDetails.house_number ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Complemento">
            {personDetails.address_complement || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ponto de Referência">
            {personDetails.reference_point || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Telefone">
            {personDetails.phone_number || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {personDetails.email || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Sexo">
            {personDetails.sex || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Aceitou Termos">
            {personDetails.terms_accepted ? "Sim" : "Não"}
          </Descriptions.Item>

          <Descriptions.Item label="Criado em">
            {moment(personDetails.created_at).format(
              "DD/MM/YYYY HH:mm"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Atualizado em">
            {moment(personDetails.updated_at).format(
              "DD/MM/YYYY HH:mm"
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
