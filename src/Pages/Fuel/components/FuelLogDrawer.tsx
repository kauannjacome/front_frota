import { Drawer, Descriptions, Divider, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface FuelLogDrawerProps {
  open: boolean;
  log_id: number | null;
  onClose: () => void;
}

// Mapeamentos de labels para os enums
const fuelTypeLabels = {
  GASOLINA: "Gasolina",
  DIESEL: "Diesel",
  ETANOL: "Etanol",
  ELETRICO: "Elétrico",
  OUTRO: "Outro",
} as const;

const supplyTypeLabels = {
  COMPLETE: "Completo",
  LITRO_ESPECIFICADO: "Litro Especificado",
  COMPLETE_SEM_CADASTRO: "Completo (sem cadastro)",
  LITRO_ESPECIFICADO_SEM_CADASTRO: "Litro Esp. (sem cadastro)",
} as const;

type FuelTypeKey = keyof typeof fuelTypeLabels;
type SupplyTypeKey = keyof typeof supplyTypeLabels;

export default function FuelLogDrawer({
  open,
  log_id,
  onClose,
}: FuelLogDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [logDetails, setLogDetails] = useState<any>(null);

  useEffect(() => {
    if (log_id == null) return;
    setLoading(true);

    api
      .get(`/fuel-log/${log_id}`)
      .then((res) => {
        setLogDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes de abastecimento:", err);
        setLoading(false);
      })
  }, [log_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes de Abastecimento"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => {
            console.log("Imprimir detalhes de abastecimento");
          }}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : logDetails ? (
        <>
          <Descriptions bordered column={1} layout="horizontal">
            <Descriptions.Item label="Veículo">
              {logDetails.vehicle
                ? `${logDetails.vehicle.mark} ${logDetails.vehicle.model} (${logDetails.vehicle.plate})`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Motorista">
              {logDetails.driver?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Autoriza">
              {logDetails.authorizer?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Atendente">
              {logDetails.attendant?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Fornecedor">
              {logDetails.supplier?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Data Abastecimento">
              {logDetails.supply_date
                ? moment(logDetails.supply_date).format("DD/MM/YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Prazo">
              {logDetails.deadline
                ? moment(logDetails.deadline).format("DD/MM/YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Litros">
              {logDetails.liters ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Custo (R$)">
              {logDetails.cost != null ? logDetails.cost.toFixed(2) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Odômetro">
              {logDetails.odometer != null ? `${logDetails.odometer} km` : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo Combustível">
              {(() => {
                const key = logDetails.fuel_type as FuelTypeKey;
                return fuelTypeLabels[key] ?? logDetails.fuel_type;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo Abastecimento">
              {(() => {
                const key = logDetails.supply_type as SupplyTypeKey;
                return supplyTypeLabels[key] ?? logDetails.supply_type;
              })()}
            </Descriptions.Item>
          </Descriptions>

          {/* 
            Se você tiver uma lista de itens relacionados (ex.: históricos de abastecimento, fotos, etc.)
            pode usar um <Table /> aqui. Caso contrário, basta remover.
          */}

          <Divider />

          <p style={{ textAlign: "center", color: "#999" }}>
            Registrado em{" "}
            {moment(logDetails.created_at).format("DD/MM/YYYY HH:mm")}, Atualizado em{" "}{moment(logDetails.created_at).format("DD/MM/YYYY HH:mm")}
          </p>

        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
