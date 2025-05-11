import React, { useState, useEffect } from 'react';
import { Layout, Menu, Spin, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  CarOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  IdcardOutlined,
  TeamOutlined,
  FileTextOutlined,
  SnippetsOutlined,
  BankOutlined,
  ShopOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;

interface AppMenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: AppMenuItem[] = [

  { key: '1', label: 'Viagem',      icon: <CalendarOutlined />,    path: '/trip' },
  { key: '2', label: 'Combustível', icon: <ThunderboltOutlined />, path: '/fuel' },
  { key: '3', label: 'Manutenção',  icon: <ToolOutlined />,        path: '/maintenance' },
  { key: '5', label: 'veiculos',   icon:  <CarOutlined />,     path: '/vehicle' },
  { key: '6', label: 'Pessoas',     icon: <TeamOutlined />,        path: '/person' },
  { key: '7', label: 'Ticket',   icon: <SnippetsOutlined  />,    path: '/ticket' },
  { key: '8', label: 'Usuarios',   icon: <ShopOutlined     />,    path: '/user' },
  { key: '9', label: 'Fornecedor',   icon: <ShopOutlined     />,    path: '/supplier' },
  { key: '10', label: 'Relatório',   icon: <FileTextOutlined />,    path: '/relatorio' },
  { key: '11', label: 'Assinante',   icon: <BankOutlined  />,    path: '/subscriber' },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // seleciona o menu de acordo com a rota,
  // garantindo que caminhos mais específicos sejam testados antes de '/'
  const [selectedKey, setSelectedKey] = useState('1');
  useEffect(() => {
    const sorted = [...menuItems].sort((a, b) => b.path.length - a.path.length);
    const current = sorted.find(item =>
      location.pathname.startsWith(item.path)
    );
    setSelectedKey(current?.key ?? '1');
  }, [location.pathname]);

  // placeholder de loading (substitua pela sua lógica)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        theme="dark"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ borderRight: '1px solid #001529' }}
      >
        <div
          style={{
            display: 'flex',
            height: '50px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Title level={5} style={{ color: '#fff', margin: 0 }}>
            FROTA
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            const item = menuItems.find(m => m.key === key);
            if (item) navigate(item.path);
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#001529' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              {
                menuItems.find(item => item.key === selectedKey)?.label ||
                'Dashboard'
              }
            </Title>
          </div>
        </Header>

        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          akautec ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
