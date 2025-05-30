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
import UserButton from './components/UserButton';

const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;

// Definição dos roles disponíveis
enum role_user {
  MANAGE = 'MANAGE',
  ADMIN_LOCAL = 'ADMIN_LOCAL',
  SECRETARY = 'SECRETARY',
  TYPIST = 'TYPIST',
  DRIVE = 'DRIVE',
  ADMIN_SUPPLY = 'ADMIN_SUPPLY',
  TYPIST_SUPPLY = 'TYPIST_SUPPLY',
}

interface AppMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: AppMenuItem[];
  roles: role_user[];
}

interface UserStorage {
  id: string;
  full_name: string;
  role: role_user;
  subscribe_name: string;
}

// Itens de menu com permissões por role
const menuItems: AppMenuItem[] = [
  { key: '1', label: 'Viagem', icon: <CalendarOutlined />, path: '/trip', roles: [role_user.MANAGE, role_user.ADMIN_LOCAL, role_user.SECRETARY, role_user.TYPIST] },
  { key: '2', label: 'Combustível', icon: <ThunderboltOutlined />, path: '/fuel', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL] },
  { key: '3', label: 'Manutenção', icon: <ToolOutlined />, path: '/maintenance', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL] },
  { key: '5', label: 'Veículos', icon: <CarOutlined />, path: '/vehicle', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL, role_user.DRIVE] },
  { key: '6', label: 'Pessoas', icon: <TeamOutlined />, path: '/person', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL, role_user.SECRETARY, role_user.TYPIST] },
  { key: '7', label: 'Ticket', icon: <SnippetsOutlined />, path: '/ticket', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL, role_user.TYPIST] },
  { key: '8', label: 'Usuários', icon: <ShopOutlined />, path: '/user', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL] },
  { key: '9', label: 'Fornecedor', icon: <ShopOutlined />, path: '/supplier', roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_SUPPLY] },
  {
    key: '10',
    label: 'Relatórios',
    icon: <FileTextOutlined />,
    roles: [role_user.MANAGE, role_user.SECRETARY, role_user.ADMIN_LOCAL, role_user.ADMIN_SUPPLY],
    children: [
      { key: '10-1', label: 'Viagens', path: '/report/trip', roles: [role_user.MANAGE, role_user.ADMIN_LOCAL] },
      { key: '10-2', label: 'Combustível', path: '/report/fuel-log', roles: [role_user.MANAGE, role_user.ADMIN_LOCAL] },
      { key: '10-3', label: 'Manutenção', path: '/report/maintenance', roles: [role_user.MANAGE, role_user.ADMIN_LOCAL] },
      { key: '10-4', label: 'Motorista', path: '/report/driver', roles: [role_user.MANAGE, role_user.ADMIN_LOCAL] },
      { key: '10-5', label: 'Veículos', path: '/report/vehicle', roles: [role_user.MANAGE, role_user.ADMIN_LOCAL] },
    ],
  },
  { key: '4', label: 'Departamento', icon: <ApartmentOutlined />, path: '/department', roles: [role_user.MANAGE] },
  { key: '11', label: 'Assinante', icon: <BankOutlined />, path: '/subscriber', roles: [role_user.MANAGE] },
];

const App: React.FC = () => {

  let userInfo: UserStorage = {
    id: "",
    full_name: "Usuário Teste",
    role: role_user.MANAGE,
    subscribe_name: "",
  };

  try {
    const json = sessionStorage.getItem("userStorage");
    if (json) {
      userInfo = JSON.parse(json);
    }
  } catch (e) {
    console.warn("Erro ao ler ou parsear userStorage:", e);
  }

  const userRole: role_user = userInfo.role;

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('1');

  // Filtra menu e submenu baseado no role do usuário
  const filteredMenuItems: AppMenuItem[] = menuItems
    .map(item => {
      if (item.children) {
        const children = item.children.filter(ch => ch.roles.includes(userRole));
        return {
          ...item,
          children: children.length ? children : undefined,
        };
      }
      return item;
    })
    .filter(item =>
      item.roles.includes(userRole) ||
      (item.children && item.children.length > 0)
    );

  // Atualiza selectedKey conforme rota atual (inclui submenu)
  useEffect(() => {
    type FlatItem = AppMenuItem & { parentKey?: string };
    const flat: FlatItem[] = filteredMenuItems.flatMap(item =>
      item.children
        ? [
          { ...item, parentKey: undefined },
          ...item.children!.map(child => ({ ...child, parentKey: item.key })),
        ]
        : [{ ...item, parentKey: undefined }]
    );
    flat.sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0));
    const match = flat.find(i =>
      i.path && location.pathname.startsWith(i.path)
    );
    setSelectedKey(match?.key ?? '1');
  }, [location.pathname, filteredMenuItems]);

  // Simula loading inicial
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', height: '100vh',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Função recursiva para encontrar path a partir de selectedKey
  const findItemByKey = (items: AppMenuItem[], key: string): AppMenuItem | undefined => {
    for (const it of items) {
      if (it.key === key) return it;
      if (it.children) {
        const found = findItemByKey(it.children, key);
        if (found) return found;
      }
    }
  };

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
          display: 'flex', height: 50,
          alignItems: 'center', justifyContent: 'center',
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
            const item = findItemByKey(filteredMenuItems, key);
            if (item?.path) {
              navigate(item.path);
            }
          }}
          items={filteredMenuItems.map(it => ({
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
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 16px',
          }}>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              {(() => {
                const it = findItemByKey(filteredMenuItems, selectedKey);
                return it?.label ?? 'Dashboard';
              })()}
            </Title>
            <UserButton />
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
