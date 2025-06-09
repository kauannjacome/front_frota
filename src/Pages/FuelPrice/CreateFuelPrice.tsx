// src/pages/CreateFuelPrice.tsx
import React, { useState, useCallback } from 'react';
import { Card, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import FuelPriceForm, { FuelPriceFormValues } from './components/FuelPriceForm';
import api from '../../services/api';

const CreateFuelPrice: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFinish = useCallback(
    async (values: FuelPriceFormValues) => {
      setLoading(true);
      try {
        const payload = { ...values };
        await api.post('/fuel-price', payload);
        message.success('Preço de combustível criado com sucesso!');
        navigate('/fuel-price');
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.message || 'Erro ao criar preço de combustível.';
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return (
    <Card title="Criar Preço de Combustível" style={{ padding: 24 }}>
      <Spin spinning={loading}>
        <FuelPriceForm
          initialValues={{}}
          onFinish={handleFinish}
          onCancel={() => navigate('/fuel-price')}
        />
      </Spin>
    </Card>
  );
};

export default CreateFuelPrice;
