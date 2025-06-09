// src/pages/EditFuelPrice.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import FuelPriceForm, { FuelPriceFormValues } from './components/FuelPriceForm';
import api from '../../services/api';

const EditFuelPrice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<FuelPriceFormValues> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<FuelPriceFormValues>(`/fuel-price/${id}`);
        setInitialValues(data);
      } catch (err: any) {
        message.error(
          err?.response?.data?.message ||
          'Erro ao carregar preço de combustível.'
        );
        navigate('/fuel-price');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleFinish = useCallback(
    async (values: FuelPriceFormValues) => {
      setLoading(true);
      try {
        await api.patch(`/fuel-price/${id}`, values);
        message.success('Preço de combustível atualizado com sucesso!');
        navigate('/fuel-price');
      } catch (err: any) {
        message.error(
          err?.response?.data?.message ||
          'Erro ao atualizar preço de combustível.'
        );
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );

  if (loading || initialValues === null) {
    return <Spin style={{ width: '100%', marginTop: 50 }} />;
  }

  return (
    <Card title="Editar Preço de Combustível" style={{ padding: 24 }}>
      <FuelPriceForm
        initialValues={initialValues}
        onFinish={handleFinish}
        onCancel={() => navigate('/fuel-price')}
      />
    </Card>
  );
};

export default EditFuelPrice;
