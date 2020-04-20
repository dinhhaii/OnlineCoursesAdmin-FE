import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const UserList = React.lazy(() => import('./App/components/User/UserList'));
const CourseList = React.lazy(() => import('./App/components/Course/CourseList'));
const InvoiceList = React.lazy(() => import('./App/components/Course/InvoiceList'));

const DashboardDefault = React.lazy(() => import('./App/components/Dashboard/Default'));

const UIBasicButton = React.lazy(() => import('./App/components/UIElements/Basic/Button'));
const UIBasicBadges = React.lazy(() => import('./App/components/UIElements/Basic/Badges'));
const UIBasicBreadcrumbPagination = React.lazy(() => import('./App/components/UIElements/Basic/BreadcrumbPagination'));

const UIBasicCollapse = React.lazy(() => import('./App/components/UIElements/Basic/Collapse'));
const UIBasicTabsPills = React.lazy(() => import('./App/components/UIElements/Basic/TabsPills'));
const UIBasicBasicTypography = React.lazy(() => import('./App/components/UIElements/Basic/Typography'));

const FormsElements = React.lazy(() => import('./App/components/Forms/FormsElements'));

const BootstrapTable = React.lazy(() => import('./App/components/Tables/BootstrapTable'));

const Nvd3Chart = React.lazy(() => import('./App/components/Charts/Nvd3Chart/index'));

const routes = [
    { path: '/app-content/all-users', exact: true, name: 'All Users', component: UserList },
    { path: '/app-content/all-courses', exact: true, name: 'All Courses', component: CourseList },
    { path: '/app-content/all-invoices', exact: true, name: 'All Invoices', component: InvoiceList },


    { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault },
    { path: '/basic/button', exact: true, name: 'Basic Button', component: UIBasicButton },
    { path: '/basic/badges', exact: true, name: 'Basic Badges', component: UIBasicBadges },
    { path: '/basic/breadcrumb-paging', exact: true, name: 'Basic Breadcrumb Pagination', component: UIBasicBreadcrumbPagination },
    { path: '/basic/collapse', exact: true, name: 'Basic Collapse', component: UIBasicCollapse },
    { path: '/basic/tabs-pills', exact: true, name: 'Basic Tabs & Pills', component: UIBasicTabsPills },
    { path: '/basic/typography', exact: true, name: 'Basic Typography', component: UIBasicBasicTypography },
    { path: '/forms/form-basic', exact: true, name: 'Forms Elements', component: FormsElements },
    { path: '/tables/bootstrap', exact: true, name: 'Bootstrap Table', component: BootstrapTable },
    { path: '/charts/nvd3', exact: true, name: 'Nvd3 Chart', component: Nvd3Chart }
];

export default routes;
