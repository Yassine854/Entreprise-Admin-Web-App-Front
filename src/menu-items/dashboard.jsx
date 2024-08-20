// assets
import { DashboardOutlined,AppstoreOutlined  } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,AppstoreOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
        id: 'selection',
        title: 'Selection',
        type: 'item',
        url: '/selection',
        icon: icons.AppstoreOutlined,
        breadcrumbs: false
      }
  ]
};


export default dashboard;
