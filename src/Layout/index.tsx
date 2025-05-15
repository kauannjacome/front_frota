import React, { useState, useEffect } from 'react';
import { Layout, Menu, Spin, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  CarOutlined,
  TeamOutlined,
  SnippetsOutlined,
  ShopOutlined,
  FileTextOutlined,
  BankOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;

interface AppMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;    // agora opcional
  path?: string;
  children?: AppMenuItem[];
}

const menuItems: AppMenuItem[] = [
  { key: '1',  label: 'Viagem',      icon: <CalendarOutlined />,    path: '/trip' },
  { key: '2',  label: 'Combustível', icon: <ThunderboltOutlined />, path: '/fuel' },
  { key: '3',  label: 'Manutenção',  icon: <ToolOutlined />,         path: '/maintenance' },
  { key: '5',  label: 'Veículos',    icon: <CarOutlined />,          path: '/vehicle' },
  { key: '6',  label: 'Pessoas',     icon: <TeamOutlined />,         path: '/person' },
  { key: '7',  label: 'Ticket',      icon: <SnippetsOutlined />,     path: '/ticket' },
  { key: '8',  label: 'Usuários',    icon: <ShopOutlined />,         path: '/user' },
  { key: '9',  label: 'Fornecedor',  icon: <ShopOutlined />,         path: '/supplier' },
  {
    key: '10',
    label: 'Relatórios',
    icon: <FileTextOutlined />,
    children: [
      { key: '10-1', label: 'Viagens',     path: '/report/trip' },
      { key: '10-2', label: 'Combustível', path: '/report/fuel' },
      { key: '10-3', label: 'Manutenção',  path: '/report/maintenance' },
      { key: '10-4', label: 'Motorista',   path: '/report/driver' },
      { key: '10-5', label: 'Veículos',    path: '/report/vehicle' },
    ],
  },
  { key: '4',  label: 'Departamento',  icon: <ApartmentOutlined />,    path: '/department' },
  { key: '11', label: 'Assinante',    icon: <BankOutlined />,         path: '/subscriber' },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const navigate                        = useNavigate();
  const location                        = useLocation();
  const [selectedKey, setSelectedKey]   = useState('1');

  // Atualiza selectedKey conforme rota atual (inclui submenu)
  useEffect(() => {
    type FlatItem = AppMenuItem & { parentKey?: string };
    const flat: FlatItem[] = menuItems.flatMap(item =>
      item.children
        ? [
            { ...item, parentKey: undefined },
            ...item.children.map(child => ({ ...child, parentKey: item.key })),
          ]
        : [{ ...item, parentKey: undefined }]
    );
    flat.sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0));
    const match = flat.find(i =>
      i.path && location.pathname.startsWith(i.path)
    );
    setSelectedKey(match?.key ?? '1');
  }, [location.pathname]);

  // Loading inicial (remova se não precisar)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        
        style={{ borderRight: '1px solid #001529' }}
      >
        <div style={{
          display: 'flex',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Title level={5} style={{ color: '#fff', margin: 0 }}>
            FROTA
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            // Busca recursiva no menu
            const findItem = (items: AppMenuItem[]): AppMenuItem | undefined => {
              for (const it of items) {
                if (it.key === key) return it;
                if (it.children) {
                  const found = findItem(it.children);
                  if (found) return found;
                }
              }
            };
            const item = findItem(menuItems);
            if (item?.path) navigate(item.path);
          }}
          items={menuItems.map(it => ({
            key: it.key,
            icon: it.icon,
            label: it.label,
            children: it.children?.map(ch => ({
              key: ch.key,
              label: ch.label,
            })),
          }))}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#001529' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              {(() => {
                const findLabel = (items: AppMenuItem[]): string | null => {
                  for (const it of items) {
                    if (it.key === selectedKey) return it.label;
                    if (it.children) {
                      const child = it.children.find(c => c.key === selectedKey);
                      if (child) return child.label;
                    }
                  }
                  return null;
                };
                return findLabel(menuItems) ?? 'Dashboard';
              })()}
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
