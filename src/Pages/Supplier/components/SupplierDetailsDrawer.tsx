import { Drawer, Descriptions, Divider, Spin, Button } from "antd";
import moment from "moment";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

interface SupplierDetailsDrawerProps {
  open: boolean;
  supplier_id: number | null;
  onClose: () => void;
}

export default function SupplierDetailsDrawer({
  open,
  supplier_id,
  onClose,
}: SupplierDetailsDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    if (!supplier_id) return;
    setLoading(true);
    api
      .get(`/supplier/${supplier_id}`)
      .then((res) => {
        setSupplier(res.data);
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes do fornecedor:", err);
        setLoading(false)
      })
  }, [supplier_id]);

  return (
    <Drawer
      width={600}
      title="Detalhes do Fornecedor"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => console.log("Imprimir fornecedor", supplier_id)}
        >
          Imprimir
        </Button>
      }
    >
      {loading ? (
        <Spin />
      ) : supplier ? (
        <>
          <Descriptions bordered column={1} layout="horizontal">

            <Descriptions.Item label="Nome">{supplier.name}</Descriptions.Item>
            <Descriptions.Item label="Telefone">{supplier.telephone ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="E-mail">{supplier.email ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="CNPJ">{supplier.cnpj}</Descriptions.Item>
            <Descriptions.Item label="Categoria">{supplier.category}</Descriptions.Item>

          </Descriptions>
          <Divider />

          <p style={{ textAlign: "center", color: "#999" }}>
            Registrado em{" "}
            {moment(supplier.created_at).format("DD/MM/YYYY HH:mm")}, Atualizado em{" "}{moment(supplier.created_at).format("DD/MM/YYYY HH:mm")}
          </p>
          {/* Espaço para informações adicionais, histórico de pedidos, etc. */}
        </>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </Drawer>
  );
}
