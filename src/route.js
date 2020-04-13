import React from 'react';

const SignIn = React.lazy(() => import('./App/components/Authentication/SignIn/SignIn'));

const route = [
    { path: '/auth/signin', exact: true, name: 'SignIn', component: SignIn }
];

export default route;
