// src/pages/EditSubscriber.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SubscriberForm, { SubscriberFormValues } from './components/SubscriberForm';

export default function EditSubscriber() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<SubscriberFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<SubscriberFormValues>(`/subscriber/${id}`);
        setInitialValues(res.data);
      } catch {
        message.error('Erro ao carregar assinante.');
        navigate('/subscriber');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: SubscriberFormValues) => {
    setLoading(true);
    try {
      await api.patch(`/subscriber/${id}`, values);
      message.success('Assinante atualizado com sucesso!');
      navigate('/subscriber');
    } catch {
      message.error('Erro ao atualizar assinante.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Assinante não encontrado.</div>;

  return (
    <Card title="Editar Assinante" style={{ padding: 24 }}>
      <SubscriberForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/subscriber')}
      />
    </Card>
  );
}