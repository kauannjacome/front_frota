import { Drawer, Descriptions, Divider, Table, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface TripDetailsDrawerProps {
  open: boolean;
  tripId: number | null;
  onClose: () => void;
}
// logo no topo do seu componente ou num arquivo de constantes
const typeTripLabels = {
    IDA: "Ida",
    VOLTA: "Volta",
    IDA_E_VOLTA: "Ida e Volta",
  } as const;
  
  type TypeTripKey = keyof typeof typeTripLabels; // "IDA" | "VOLTA" | "IDA_E_VOLTA"

  
export default function TripDetailsDrawer({
  open,
  tripId,
  onClose,
}: TripDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tripDetails, setTripDetails] = useState<any>(null);

  useEffect(() => {
      if (!open || tripId == null) {
    return;
  }
    setLoading(true);
    api
      .get(`/trip/${tripId}`)
      .then((res) => {
        setTripDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes:", err);
        setLoading(false);
      });
  }, [tripId]);

  return (
    <Drawer
      width={600}
      title="Detalhes da Viagem"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
          <Button
            type="primary"
            icon={<PrinterOutlined  />}
            onClick={() => {
              console.log("Ação simples!");
            }}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : tripDetails ? (
        <>
          <Descriptions bordered column={2} layout="horizontal">

            <Descriptions.Item label="Propósito">
              {tripDetails.purpose}
            </Descriptions.Item>
            <Descriptions.Item label="Data Início">
              {moment(tripDetails.journey_start).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Data Retorno">
              {tripDetails.journey_back
                ? moment(tripDetails.journey_back).format(
                    "DD/MM/YYYY HH:mm"
                  )
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Origem">
              {tripDetails.start_city}, {tripDetails.start_state}
            </Descriptions.Item>
            <Descriptions.Item label="Destino">
              {tripDetails.end_city}, {tripDetails.end_state}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {tripDetails.status}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <h4>Passageiros</h4>
          <Table
            dataSource={tripDetails.trip_passengers}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              {
                title: "Nome",
                dataIndex: ["passenger", "full_name"],
                key: "name",
              },
              { title: "Tipo", dataIndex: "type", key: "type",
                render: (type: string) => {
                    // força para nosso tipo e busca o label
                    const key = type as TypeTripKey;
                    return typeTripLabels[key] ?? "-";
                  }},
              { title: "Notas", dataIndex: "notes", key: "notes" },
              {
                title: "Local de específico",
                dataIndex: "dropoff_location",
                key: "dropoff",
              },
            ]}
          />
  
                 <Divider />
          <p style={{ textAlign: "center", color: "#999" }}>
            Registrado em{" "}
            {moment(tripDetails.created_at).format("DD/MM/YYYY HH:mm")}, Atualizado em{" "}{moment(tripDetails.created_at).format("DD/MM/YYYY HH:mm")}
          </p>
             </>
        
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
