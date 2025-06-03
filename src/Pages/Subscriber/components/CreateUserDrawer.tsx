// src/components/CreateUserDrawer.tsx
import React, { useState } from "react";
import { Drawer, Card, Spin, Button, message } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import api from "../../../services/api";
import UserForm, { UserFormValues } from "../../User/components/UserForm";

interface CreateUserDrawerProps {
  open: boolean;
  subscriber_id: number | null;
  onClose: () => void;
  onUserCreated?: () => void; // opcional: callback para recarregar lista de usuários, etc.
  roleOptions?: { label: string; value: string }[];
  typeOptions?: { label: string; value: string }[];
  departmentOptions?: { label: string; value: number }[];
}

export default function CreateUserDrawer({
  open,
  subscriber_id,
  onClose,
  onUserCreated,
  roleOptions,
  typeOptions,
  departmentOptions,
}: CreateUserDrawerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Partial<UserFormValues> | null>(null);

  // Sempre que o drawer for aberto e tivermos um subscriber_id válido,
  // definimos os valores iniciais do form. Se quiser buscar mais dados do assinante
  // para exibir no título ou algo assim, você poderia fazer aqui um GET em /subscriber/:id.
  useEffect(() => {
    if (open && subscriber_id) {
      // Preenche apenas subscriber_id; os demais valores ficam vazios/padrão.
      setInitialValues({
        cpf: "",
        full_name: "",
        cnh: null,
        email: null,
        phone_number: null,
        nationality: null,
        birth_date: undefined,
        death_date: undefined,
        mother_name: null,
        father_name: null,
        password_hash: "",
        is_password_temp: false,
        number_try: 0,
        is_blocked: false,
        role: "ADMIN_LOCAL", // pode alterar conforme desejado
        type: "CONTRATADO",  // pode alterar conforme desejado
        accepted_terms: false,
        accepted_terms_at: undefined,
        accepted_terms_version: null,
        subscriber_id: subscriber_id,
        supplier_id: null,
        department_ids: [],
      });
    } else {
      setInitialValues(null);
    }
  }, [open, subscriber_id]);

  const handleFinish = async (values: UserFormValues) => {
    setLoading(true);
    try {
      // Converte dates para ISO strings se existirem
      const payload = {
        ...values,
        birth_date: values.birth_date?.toISOString(),
        death_date: values.death_date?.toISOString(),
        accepted_terms_at: values.accepted_terms_at?.toISOString(),
      };

      await api.post("/user", payload);
      message.success("Usuário criado com sucesso!");
      setLoading(false);

      // Fecha o drawer e opcionalmente notifica o componente pai para recarregar lista
      onClose();
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      message.error("Erro ao criar usuário.");
      setLoading(false);
    }
  };

  return (
    <Drawer
      width={600}
      title={`Criar Usuário${subscriber_id ? ` - Assinante #${subscriber_id}` : ""}`}
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose={true}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          {/* O botão de submit está dentro do próprio UserForm */}
        </div>
      }
    >
      {loading || !initialValues ? (
        <Spin style={{ width: "100%", marginTop: 50 }} />
      ) : (
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <UserForm
            initialValues={initialValues}
            onFinish={handleFinish}
            onCancel={onClose}
            roleOptions={roleOptions}
            typeOptions={typeOptions}
            departmentOptions={departmentOptions}
          />
        </Card>
      )}
    </Drawer>
  );
}
