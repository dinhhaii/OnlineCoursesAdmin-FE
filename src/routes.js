import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const UserList = React.lazy(() => import('./App/components/User/UserList'));
const CourseList = React.lazy(() => import('./App/components/Course/CourseList'));
const LessonList = React.lazy(() => import('./App/components/Lesson/LessonList'));
const InvoiceList = React.lazy(() => import('./App/components/Invoice/InvoiceList'));
const FeedbackList = React.lazy(() => import('./App/components/Feedback/FeedbackList'));
const CommentList = React.lazy(() => import('./App/components/Comment/CommentList'));
const DiscountList = React.lazy(() => import('./App/components/Discount/DiscountList'));

const UserDetail = React.lazy(() => import('./App/components/User/UserDetail'));

const DashboardDefault = React.lazy(() => import('./App/components/Dashboard/Default'));

const routes = [
    { path: '/app-content/all-users', exact: true, name: 'AUsers', component: UserList },
    { path: '/app-content/all-courses', exact: true, name: 'All Courses', component: CourseList },
    { path: '/app-content/all-lessons', exact: true, name: 'All Lessons', component: LessonList },
    { path: '/app-content/all-invoices', exact: true, name: 'All Invoices', component: InvoiceList },
    { path: '/app-content/all-feedback', exact: true, name: 'All Feedback', component: FeedbackList },
    { path: '/app-content/all-comments', exact: true, name: 'All Comments', component: CommentList },
    { path: '/app-content/all-coupons', exact: true, name: 'All Coupons', component: DiscountList },


    { path: '/app-content/all-users/:id', exact: true, name: 'User Detail', component: UserDetail },


    { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault }
];

export default routes;
