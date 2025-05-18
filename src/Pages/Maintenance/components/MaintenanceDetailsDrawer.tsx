import { Drawer, Descriptions, Divider, Table, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface MaintenanceDetailsDrawerProps {
  open: boolean;
  maintenance_id: number | null;
  onClose: () => void;
}

// labels de tipo de manutenção
const maintenanceTypeLabels = {
  PREVENTIVA: "Preventiva",
  CORRETIVA: "Corretiva",
  INSPECAO: "Inspeção",
} as const;

type MaintenanceTypeKey = keyof typeof maintenanceTypeLabels;

// labels de categoria de item
const componentCategoryLabels = {
  SPARE_PART: "Peça",
  TIRE: "Pneu",
  BATTERY: "Bateria",
  FILTER: "Filtro",
  OTHER: "Outro",
} as const;

type ComponentCategoryKey = keyof typeof componentCategoryLabels;

export default function MaintenanceDetailsDrawer({
  open,
  maintenance_id,
  onClose,
}: MaintenanceDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [maintenanceDetails, setMaintenanceDetails] = useState<any>(null);

  useEffect(() => {
    if (!maintenance_id) return;
    setLoading(true);
    api
      .get(`/maintenance/${maintenance_id}`)
      .then((res) => {
        setMaintenanceDetails(res.data);
          setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes da manutenção:", err);
          setLoading(false);
      })

  }, [maintenance_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes da Manutenção"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => {
            // implementar ação de impressão aqui
            console.log("Imprimir manutenção");
          }}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : maintenanceDetails ? (
        <>
          <Descriptions bordered column={2} layout="horizontal">
            <Descriptions.Item label="ID">
              {maintenanceDetails.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">
              {maintenanceTypeLabels[
                maintenanceDetails.type as MaintenanceTypeKey
              ]}
            </Descriptions.Item>
            <Descriptions.Item label="Data da Ordem">
              {moment(maintenanceDetails.order_date).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Data da Manutenção">
              {moment(maintenanceDetails.date).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Próxima Manutenção">
              {maintenanceDetails.next_due
                ? moment(maintenanceDetails.next_due).format(
                    "DD/MM/YYYY HH:mm"
                  )
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {maintenanceDetails.status}
            </Descriptions.Item>
            <Descriptions.Item label="Veículo">
              {maintenanceDetails.vehicle?.plate ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Fornecedor">
              {maintenanceDetails.supplier?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Autorizaçao">
              {maintenanceDetails.authorizer?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Atendente">
              {maintenanceDetails.attendant?.name ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Custo">
              {maintenanceDetails.cost
                ? `R$ ${maintenanceDetails.cost.toFixed(2)}`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Descrição">
              {maintenanceDetails.description}
            </Descriptions.Item>
          </Descriptions>

          {maintenanceDetails.Item && maintenanceDetails.Item.length > 0 && (
            <>
              <Divider />
              <h4>Itens Utilizados</h4>
              <Table
                dataSource={maintenanceDetails.Item}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Nome",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Categoria",
                    dataIndex: "category",
                    key: "category",
                    render: (cat: string) => {
                      const key = cat as ComponentCategoryKey;
                      return componentCategoryLabels[key] ?? "-";
                    },
                  },
                  {
                    title: "Número da Peça",
                    dataIndex: "part_number",
                    key: "part_number",
                  },
                  {
                    title: "Quantidade",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Preço Unitário",
                    dataIndex: "price",
                    key: "price",
                    render: (price: number) =>
                      price ? `R$ ${price.toFixed(2)}` : "-",
                  },
                ]}
              />
            </>
          )}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
