import React from 'react';

const SignIn = React.lazy(() => import('./App/components/Authentication/SignIn'));
const ResetPassword = React.lazy(() => import('./App/components/Authentication/ResetPassword'));
const NewPassword = React.lazy(() => import('./App/components/Authentication/NewPassword'));

const route = [
    { path: '/auth/signin', exact: true, name: 'SignIn', component: SignIn },
    { path: '/auth/reset-password', exact: true, name: 'ResetPassword', component: ResetPassword },
    { path: '/reset-password', exact: true, name: 'SignIn', component: NewPassword }
];

export default route;
