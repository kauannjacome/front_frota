// src/pages/CreateTrip.tsx
import React, { useState } from "react";
import { Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import TripForm, { TripFormValues, PersonRow } from "./components/TripForm";
import api from "../../services/api";

export default function CreateTrip() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: TripFormValues, persons: PersonRow[]) => {


    setLoading(true);
    try {
      const payload = {
        ...values,
        journey_start: values.journey_start.format('YYYY-MM-DDTHH:mm:ssZ'),
        journey_back: values.journey_back.format('YYYY-MM-DDTHH:mm:ssZ'),
        persons: persons.map((p) => ({
          person_id: p.id,
          dropoff_location: p.dropoff_location,
          notes: p.notes,
        })),
      };
      console.log(payload);
      await api.post("/trip", payload);
      message.success("Viagem criada com sucesso!");

      navigate("/trip");
    } catch (error) {
      console.error("Erro ao criar viagem", error);
      message.error("Erro ao criar viagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Viagem" style={{ padding: 24 }}>
      <TripForm
        initialValues={{}}
        initialPersons={[]}
        loading={loading}
        onFinish={handleFinish}
        onCancel={() => navigate(-1)}
      />
    </Card>
  );
}
