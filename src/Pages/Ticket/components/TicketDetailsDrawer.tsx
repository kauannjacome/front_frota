import { Drawer, Descriptions, Divider, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface TicketDetailsDrawerProps {
  open: boolean;
  ticket_id: number | null;
  onClose: () => void;
}

export default function TicketDetailsDrawer({
  open,
  ticket_id,
  onClose,
}: TicketDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (!ticket_id) return;
    setLoading(true);
    api
      .get(`/ticket/${ticket_id}`)
      .then((res) => {
        setTicket(res.data);
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes do ticket:", err);
        setLoading(false)
      })

  }, [ticket_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes da Passagem"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => {
            // TODO: implementar lógica de impressão
            console.log("Imprimir ticket", ticket_id);
          }}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : ticket ? (
        <>
          <Descriptions bordered column={1} layout="horizontal">

            <Descriptions.Item label="Fornecedor">
              {ticket.supplier?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Passageiro">
              {ticket.person?.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="Custo">
              {ticket.cost ? `R$ ${ticket.cost.toFixed(2)}` : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Data de Viagem">
              {ticket.travel_date
                ? moment(ticket.travel_date).format("DD/MM/YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Origem">
              {ticket.start_city}, {ticket.start_state}
            </Descriptions.Item>
            <Descriptions.Item label="Destino">
              {ticket.end_city}, {ticket.end_state}
            </Descriptions.Item>
            <Descriptions.Item label="Autorizador">
              {ticket.authorizer?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Atendente">
              {ticket.attendant?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Visualizado pelo Atendente">
              {ticket.attendant_viewed ? "Sim" : "Não"}
            </Descriptions.Item>

          </Descriptions>

          <Divider />
          <p style={{ textAlign: "center", color: "#999" }}>
            Registrado em{" "}
            {moment(ticket.created_at).format("DD/MM/YYYY HH:mm")}, Atualizado em{" "}{moment(ticket.created_at).format("DD/MM/YYYY HH:mm")}
          </p>

          {/* Se houver outras informações relevantes, pode-se adicionar aqui */}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
