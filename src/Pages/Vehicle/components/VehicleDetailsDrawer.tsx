import { Drawer, Descriptions, Divider, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface VehicleDetailsDrawerProps {
  open: boolean;
  vehicle_id: number | null;
  onClose: () => void;
}

export default function VehicleDetailsDrawer({
  open,
  vehicle_id,
  onClose,
}: VehicleDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [vehicleDetails, setVehicleDetails] = useState<any>(null);

  useEffect(() => {
    if (vehicle_id === null) return;
    setLoading(true);
    api
      .get(`/vehicle/${vehicle_id}`)
      .then((res) => {
        setVehicleDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes do veículo:", err);
        setLoading(false);
      });
  }, [vehicle_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes do Veículo"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => {
            console.log("Imprimir detalhes do veículo");
          }}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : vehicleDetails ? (
        <>
          <Descriptions bordered column={1} layout="horizontal">

            <Descriptions.Item label="Capacidade (pessoas)">
              {vehicleDetails.capacity_person}
            </Descriptions.Item>
            <Descriptions.Item label="Apelido">
              {vehicleDetails.surname}
            </Descriptions.Item>
            <Descriptions.Item label="Marca">
              {vehicleDetails.mark}
            </Descriptions.Item>
            <Descriptions.Item label="Modelo">
              {vehicleDetails.model}
            </Descriptions.Item>
            <Descriptions.Item label="Placa">
              {vehicleDetails.plate}
            </Descriptions.Item>
            <Descriptions.Item label="Renavam">
              {vehicleDetails.renavam}
            </Descriptions.Item>
            <Descriptions.Item label="Transporte de pessoas">
              {vehicleDetails.is_people ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Interno ao departamento">
              {vehicleDetails.is_internal_department ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Em serviço">
              {vehicleDetails.in_service ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Disponível">
              {vehicleDetails.available ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Licenciamento">
              {vehicleDetails.licensing
                ? moment(vehicleDetails.licensing).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>

          </Descriptions>
          {/* Se houver dados relacionados, pode adicionar tabelas aqui */}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
