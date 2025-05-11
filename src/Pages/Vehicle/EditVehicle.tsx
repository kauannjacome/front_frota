import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, message } from 'antd';
import moment from 'moment';
import api from '../../services/api';
import VehicleForm, { VehicleFormValues } from './components/VehicleForm';

// Define payload type for API (licensing as ISO string)
interface VehiclePayload extends Omit<VehicleFormValues, 'licensing'> {
  licensing?: string;
}

export default function EditVehicle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<VehicleFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicle() {
      try {
        const res = await api.get<VehicleFormValues>(`/vehicle/${id}`);
        const data = res.data;
        setInitialValues({
          ...data,
          licensing: data.licensing ? moment(data.licensing) : undefined,
        });
      } catch (err) {
        message.error('Erro ao carregar veículo');
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  const handleFinish = async (values: VehicleFormValues) => {
    setLoading(true);
    try {
      // Transform licensing Moment to ISO string for API
      const payload: VehiclePayload = {
        ...values,
        licensing: values.licensing?.toISOString(),
      };
      await api.patch(`/vehicle/${id}`, payload);
      message.success('Veículo atualizado com sucesso');
      navigate('/vehicles');
    } catch (err) {
      message.error('Erro ao atualizar veículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin style={{ width: '100%', marginTop: 50 }} />;
  }

  if (!initialValues) {
    return <div>Veículo não encontrado.</div>;
  }

  return (
    <Card title="Editar Veículo" style={{ padding: 24 }}>
      <VehicleForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/vehicle')}
      />
    </Card>
  );
}
