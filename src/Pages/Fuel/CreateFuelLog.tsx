
// src/pages/CreateFuelLog.tsx
import  { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import FuelLogForm, { FuelLogFormValues } from './components/FuelLogForm';
import api from '../../services/api';

export default function CreateFuelLog() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: FuelLogFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        supply_date: values.supply_date.toISOString(),
        deadline: values.deadline?.toISOString() ?? null,
      };
      await api.post('/fuel-log', payload);
      message.success('Registro de abastecimento criado com sucesso!');
      navigate('/fuel-log');
    } catch {
      message.error('Erro ao criar registro de abastecimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Abastecimento" style={{ padding: 24 }}>
      <FuelLogForm
        initialValues={{}}
        onFinish={handleFinish}
      />
    </Card>
  );
}