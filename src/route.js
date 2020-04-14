import React from 'react';

const SignIn = React.lazy(() => import('./App/components/Authentication/SignIn'));
const ResetPassword = React.lazy(() => import('./App/components/Authentication/ResetPassword'));

const route = [
    { path: '/auth/signin', exact: true, name: 'SignIn', component: SignIn },
    { path: '/auth/reset-password', exact: true, name: 'ResetPassword', component: ResetPassword },
];

export default route;
