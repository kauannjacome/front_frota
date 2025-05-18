// src/pages/SubscriberList.tsx
import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Popconfirm, message, Row, Col } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

moment.locale('pt-br');

interface Subscriber {
  id: number;
  uuid: string;
  name: string;
  subscriber_name: string;
  cnpj: string;
  email: string;
  telephone: string;
  postal_code: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state_full_name: string;
  state_acronyms: string;
  status: string;
  created_at: string;
}

export default function SubscriberList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Subscriber[]>('/subscriber')
      .then(({ data }) => setSubscribers(data))
      .catch(err => {
        console.error('Erro ao carregar assinantes', err);
        message.error('Não foi possível carregar a lista de assinantes.');
      });
  }, []);

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/subscriber/${id}`);
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      message.success('Assinante excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir assinante:', error);
      message.error('Não foi possível excluir o assinante.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row justify="end">
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/subscriber/create')}
          >
            Adicionar Assinante
          </Button>
        </Col>
      </Row>

      <Card title="Lista de Assinantes">
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
          dataSource={subscribers}
          renderItem={subscriber => (
            <List.Item key={subscriber.id}>
              <Card
                title={subscriber.subscriber_name}
                actions={[
                  <EyeOutlined key="view" onClick={() => navigate(`/subscriber/${subscriber.id}`)} />,
                  <EditOutlined key="edit" onClick={() => navigate(`/subscriber/edit/${subscriber.id}`)} />,
                  <Popconfirm
                    title="Tem certeza que deseja excluir?"
                    onConfirm={() => onDelete(subscriber.id)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>
                ]}
              >
                <p><strong>CNPJ:</strong> {subscriber.cnpj}</p>
                <p><strong>Email:</strong> {subscriber.email}</p>
                <p><strong>Telefone:</strong> {subscriber.telephone}</p>
                <p>
                  <strong>Endereço:</strong> {subscriber.street}, {subscriber.number}{' '}
                  - {subscriber.neighborhood}, {subscriber.city} - {subscriber.state_acronyms}
                </p>
                <p>
                  <strong>Criado em:</strong>{' '}
                  {moment(subscriber.created_at).format('DD/MM/YYYY HH:mm')}
                </p>
                <Tag color={subscriber.status === 'PAGO' ? 'green' : 'volcano'}>
                  {subscriber.status}
                </Tag>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
