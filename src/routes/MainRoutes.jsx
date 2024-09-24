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
const NotFound = Loadable(lazy(() => import('pages/NotFound')));

const Selection = Loadable(lazy(() => import('pages/parametres/Selection')));
const Pack = Loadable(lazy(() => import('pages/parametres/Pack')));
const Offre = Loadable(lazy(() => import('pages/parametres/Offre')));
const Parametre = Loadable(lazy(() => import('pages/parametres/Parametre')));
const Slide = Loadable(lazy(() => import('pages/parametres/Slide')));


//Profile
const UpdateProfile = Loadable(lazy(() => import('pages/profile/update')));
const ShowProfile = Loadable(lazy(() => import('pages/profile/index')));

//Settings
const PasswordSettings = Loadable(lazy(() => import('pages/settings/password')));
const Contact = Loadable(lazy(() => import('pages/settings/contact')));

//Commandes
const Clients = Loadable(lazy(() => import('pages/clients/index')));

//Categories
const Categories = Loadable(lazy(() => import('pages/categories/index')));

//Attributes & Values
const Attributes = Loadable(lazy(() => import('pages/attributes/index')));
const Values = Loadable(lazy(() => import('pages/attributes/value')));

//Products
const ProductCategory = Loadable(lazy(() => import('pages/products/category')));
const IndexProducts = Loadable(lazy(() => import('pages/products/index')));

//Commandes
const Commande = Loadable(lazy(() => import('pages/commandes/index')));

//Factures
const Facture = Loadable(lazy(() => import('pages/factures/index')));


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
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
        path: '*',
        element: <NotFound />
      },
    {
      path: 'selection',
      element: <Selection/>
    },
    {
        path: 'slides',
        children: [
            {
              path: ':id',
              element: <Slide />
            },
        ]
      },
    {
        path: 'packs',
        children: [
            {
              path: '',
              element: <Pack />
            },
            {
              path: ':id',
              element: <Offre />
            },
        ]
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
        path: 'attributes',
        children: [
              {
                path: '',
                element: <Attributes />
              },
              {
                path: ':id',
                element: <Values />
              },
          ]
      },

      {
        path: 'products',
        children: [
          {
            path: 'categories',
            children: [
              {
                path: ':adminId/:categoryId',
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
        path: 'clients',
        element: <Clients/>
      },

      {
        path: 'commandes',
        element: <Commande/>
      },

      {
        path: 'factures',
        element: <Facture/>
      },


    {
      path: '',
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
