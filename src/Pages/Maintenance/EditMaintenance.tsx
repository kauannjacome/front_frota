// src/pages/EditMaintenance.tsx
import  { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../services/api';
import MaintenanceForm, { MaintenanceFormValues } from './components/MaintenanceForm';

export default function EditMaintenance() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<MaintenanceFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<MaintenanceFormValues>(`/maintenance/${id}`);
        const data = res.data;
        setInitialValues({
          ...data,
          date: data.date ? moment(data.date) : undefined,
          next_due: data.next_due ? moment(data.next_due) : undefined,
        });
      } catch {
        message.error('Erro ao carregar manutenção.');
        navigate('/maintenance');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: MaintenanceFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date: values.date.toISOString(),
        next_due: values.next_due?.toISOString() ?? null,
      };
      await api.patch(`/maintenance/${id}`, payload);
      message.success('Manutenção atualizada com sucesso!');
      navigate('/maintenance');
    } catch {
      message.error('Erro ao atualizar manutenção.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Manutenção não encontrada.</div>;

  return (
    <Card title="Editar Manutenção" style={{ padding: 24 }}>
      <MaintenanceForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/maintenance')}
      />
    </Card>
  );
}