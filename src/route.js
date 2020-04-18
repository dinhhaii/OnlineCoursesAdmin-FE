import React from 'react';

const SignIn = React.lazy(() => import('./App/components/Authentication/SignIn'));
const ResetPassword = React.lazy(() => import('./App/components/Authentication/ResetPassword'));
const ChangePassword = React.lazy(() => import('./App/components/Authentication/ChangePassword'));

const route = [
    { path: '/auth/signin', exact: true, name: 'Sign In', component: SignIn },
    { path: '/auth/reset-password', exact: true, name: 'Reset Password', component: ResetPassword },
    { path: '/auth/reset-password/id=:id/token=:token', exact: true, name: 'Change Password', component: ChangePassword }
];

export default route;
