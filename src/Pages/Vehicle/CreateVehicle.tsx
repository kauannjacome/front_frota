// components/CreateVehicle.tsx
import { useState } from 'react';
import { Card, message } from 'antd';
import api from '../../services/api';
import VehicleForm, { VehicleFormValues } from './components/VehicleForm';
import { useNavigate } from 'react-router-dom';

export default function CreateVehicle() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: VehicleFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        licensing: values.licensing?.toISOString(),
      };
      await api.post('/vehicle', payload);
      message.success('Veículo criado com sucesso');
      // TODO: redirecionar
    } catch {
      message.error('Erro ao criar veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Criar Veículo" style={{ padding: 24 }}>
      <VehicleForm
        initialValues={{
          plate: '',
          renavam: '',
          is_people: false,
          is_internal_department: false,
          in_service: true,
          available: true,
        }}
        onFinish={handleFinish}
        onCancel={() => navigate('/vehicle')}
      />
    </Card>
  );
}
