import { Drawer, Descriptions, Divider, Spin } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";

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
    if (vehicle_id == null) return;

    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/vehicle/${vehicle_id}`);
        setVehicleDetails(res.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do veículo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicle_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes do Veículo"
      placement="right"
      onClose={onClose}
      open={open}
    >
      {loading ? (
        <Spin />
      ) : vehicleDetails ? (
        <>
          <Descriptions bordered column={2} layout="horizontal">
  
            <Descriptions.Item label="Capacidade">
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
            <Descriptions.Item label="Para Pessoas">
              {vehicleDetails.is_people ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Departamento Interno">
              {vehicleDetails.is_internal_department ? "Sim" : "Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Em Serviço">
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
            <Descriptions.Item label="Depto Origem">
              {vehicleDetails.from_department_id ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Depto Destino">
              {vehicleDetails.to_department_id ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Criado em">
              {moment(vehicleDetails.created_at).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider />
          {/* Seções adicionais, se necessário */}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
