// src/pages/SubscriberList.tsx
import React, { useEffect, useState } from 'react';
import { List, Card, Button, message, Row, Col } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

moment.locale('pt-br');

interface Subscriber {
  id: number;
  uuid: string;
  subscriber_name: string;
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


  return (
    <div style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', padding: 24 }}>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/subscriber/create')}
          >
            Menu Adminstração
          </Button>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ backgroundColor: '#fff', width: '50%' }}>
          <List
            itemLayout="horizontal"
            dataSource={subscribers}
            renderItem={subscriber => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    type="default"
                    shape="circle"
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() =>
                       navigate(`/admin/department/${subscriber.id}`)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={subscriber.subscriber_name}
                  description={moment(subscriber.created_at).format('DD/MM/YYYY HH:mm')}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
