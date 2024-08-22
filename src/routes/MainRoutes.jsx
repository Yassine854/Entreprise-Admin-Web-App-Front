import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import AuthGuard from './AuthGuard';

// Render - pages
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));


//Parametres
const Selection = Loadable(lazy(() => import('pages/parametres/Selection')));
const Pack = Loadable(lazy(() => import('pages/parametres/Pack')));
const Offre = Loadable(lazy(() => import('pages/parametres/Offre')));
const Parametre = Loadable(lazy(() => import('pages/parametres/Parametre')));

//Profile
const UpdateProfile = Loadable(lazy(() => import('pages/profile/update')));
const ShowProfile = Loadable(lazy(() => import('pages/profile/index')));

//Settings
const PasswordSettings = Loadable(lazy(() => import('pages/settings/password')));
const Contact = Loadable(lazy(() => import('pages/settings/contact')));

//Categories
const Categories = Loadable(lazy(() => import('pages/categories/index')));

//Products
const ProductCategory = Loadable(lazy(() => import('pages/products/category')));
const IndexProducts = Loadable(lazy(() => import('pages/products/index')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'selection',
      element: <Selection/>
    },
    {
        path: 'packs',
        element: <Pack/>
      },
      {
        path: 'offres',
        element: <Offre/>
      },
      {
        path: 'parametres',
        element: <Parametre/>
      },

      {
        path: 'profile',
        children: [

          {
            path: 'update',
            element: <UpdateProfile />
          },
          {
            path: 'show',
            element: <ShowProfile />
          }
        ]
      },

      {
        path: 'settings',
        children: [

          {
            path: 'account',
            element: <PasswordSettings />
          },
          {
            path: 'contact',
            element: <Contact />
          },

        ]
      },

      {
        path: 'categories',
        element: <Categories/>
      },

      {
        path: 'products',
        children: [
          {
            path: 'categories',
            children: [
              {
                path: ':id',
                element: <IndexProducts />
              },
              {
                path: '',
                element: <ProductCategory />
              }
            ]
          }
        ]
      },



    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
