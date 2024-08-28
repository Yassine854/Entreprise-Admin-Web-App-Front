// assets
import { DashboardOutlined,AppstoreOutlined,TagsOutlined ,ClusterOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined,
    AppstoreOutlined,
    TagsOutlined,
    ClusterOutlined
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
        title: 'Paramétres du site web',
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
        icon: icons.AppstoreOutlined,
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
        id: 'ProductCategory',
        title: 'Produits',
        type: 'item',
        url: '/products/categories',
        icon: icons.TagsOutlined,
        breadcrumbs: false
      },
      {
        id: 'commandes',
        title: 'Commandes',
        type: 'item',
        url: '/commandes',
        icon: icons.AppstoreOutlined,
        breadcrumbs: false
      },
  ]
};


export default dashboard;
