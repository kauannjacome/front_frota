// src/pages/EditFuelLog.tsx
import { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../services/api';
import FuelLogForm, { FuelLogFormValues } from './components/FuelLogForm';

export default function EditFuelLog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<FuelLogFormValues>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<any>(`/fuel-log/${id}`);
        const data = res.data;
        setInitialValues({
          ...data,
          supply_date: data.supply_date ? moment(data.supply_date) : undefined,
          deadline: data.deadline ? moment(data.deadline) : undefined,
        });
      } catch {
        message.error('Erro ao carregar registro de abastecimento.');
        navigate('/fuel-log');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleFinish = async (values: FuelLogFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        supply_date: values.supply_date.toISOString(),
        deadline: values.deadline?.toISOString() ?? null,
      };
      await api.patch(`/fuel-log/${id}`, payload);
      message.success('Registro de abastecimento atualizado com sucesso!');
      navigate('/fuel-log');
    } catch {
      message.error('Erro ao atualizar registro de abastecimento.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin style={{ width: '100%', marginTop: 50 }} />;
  if (!initialValues) return <div>Registro de abastecimento não encontrado.</div>;

  return (
    <Card title="Editar Abastecimento" style={{ padding: 24 }}>
      <FuelLogForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/fuel')}
      />
    </Card>
  );
}
