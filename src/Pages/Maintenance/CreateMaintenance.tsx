
// src/pages/CreateMaintenance.tsx
import { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MaintenanceForm, { MaintenanceFormValues } from './components/MaintenanceForm';
import api from '../../services/api';

export default function CreateMaintenance() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: MaintenanceFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date: values.date.toISOString(),
        next_due: values.next_due?.toISOString() ?? null,
      };
      await api.post('/maintenance', payload);
      message.success('Manutenção criada com sucesso!');
      navigate('/maintenance');
    } catch {
      message.error('Erro ao criar manutenção.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Manutenção" style={{ padding: 24 }}>
      <MaintenanceForm
        initialValues={{ subscriber_id: 1 }}
        onFinish={handleFinish}
      />
    </Card>
  );
}
