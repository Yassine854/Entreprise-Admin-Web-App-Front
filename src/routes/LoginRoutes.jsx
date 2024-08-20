import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import AuthGuard from './AuthGuard';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: (
        <AuthGuard>
          <AuthLogin />
        </AuthGuard>
      ),
    },
    {
      path: '/register',
      element: (
        <AuthGuard>
          <AuthRegister/>
        </AuthGuard>
      ),
    }
  ]
};

export default LoginRoutes;
