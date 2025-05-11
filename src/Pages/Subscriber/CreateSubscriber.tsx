// src/pages/CreateSubscriber.tsx
import React, { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import SubscriberForm, { SubscriberFormValues } from './components/SubscriberForm';
import api from '../../services/api';

export default function CreateSubscriber() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: SubscriberFormValues) => {
    setLoading(true);
    try {
      await api.post('/subscriber', values);
      message.success('Assinante criado com sucesso!');
      navigate('/subscriber');
    } catch {
      message.error('Erro ao criar assinante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Assinante" style={{ padding: 24 }}>
      <SubscriberForm
        initialValues={{
          name: '',
          subscriber_name: '',
          cnpj: '',
          email: '',
          telephone: '',
          postal_code: '',
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state_full_name: '',
          state_acronyms: '',
          status: 'PAGO',
        }}
        onFinish={handleFinish}
      />
    </Card>
  );
}