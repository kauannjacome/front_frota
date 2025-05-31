// src/pages/CreatePerson.tsx
import React, { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import PersonForm, { PersonFormValues } from './components/PersonForm';
import api from '../../services/api';

export default function CreatePerson() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: PersonFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birth_date: values.birth_date.toISOString(),
        death_date: values.death_date?.toISOString(),
      };
      console.log(payload)
      await api.post('/person', payload);
      message.success('Pessoa criada com sucesso!');
      navigate('/person');
    } catch {
      message.error('Erro ao criar pessoa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Pessoa" style={{ padding: 24 }}>
      <PersonForm
        initialValues={{
          cpf: '',
          full_name: '',
          birth_date: undefined as any,
          termsAccepted: false,
          subscriber_id: 1, // <-- substitua pelo ID real do assinante
        }}
        onFinish={handleFinish}
      />
    </Card>
  );
}
