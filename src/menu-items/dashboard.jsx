// assets
import { DashboardOutlined, DollarOutlined ,FileTextOutlined,AppstoreOutlined, TagsOutlined, UserOutlined, FormOutlined, AppstoreAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UserOutlined,
  FormOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  DollarOutlined
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
      id: 'parametrage',
      title: 'Paramétrage du site web',
      type: 'item',
      url: '/selection',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false
    },
    {
      id: 'clients',
      title: 'Clients',
      type: 'item',
      url: '/clients',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/categories',
      icon: icons.TagsOutlined,
      breadcrumbs: false
    },
    {
        id: 'attributes',
        title: 'Attributs',
        type: 'item',
        url: '/attributes',
        icon: icons.TagsOutlined,
        breadcrumbs: false
      },
    {
      id: 'ProductCategory',
      title: 'Produits',
      type: 'item',
      url: '/products/categories',
      icon: icons.AppstoreAddOutlined,
      breadcrumbs: false
    },
    {
      id: 'commandes',
      title: 'Commandes',
      type: 'item',
      url: '/commandes',
      icon: icons.FormOutlined,
      breadcrumbs: false
    },
    {
        id: 'factures',
        title: 'factures',
        type: 'item',
        url: '/factures',
        icon: icons.FileTextOutlined,
        breadcrumbs: false
      },
      {
        id: 'achats',
        title: 'achats',
        type: 'item',
        url: '/achats',
        icon: icons.DollarOutlined ,
        breadcrumbs: false
      },
  ]
};

export default dashboard;
