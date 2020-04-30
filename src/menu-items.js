export default {
    items: [
      {
          id: 'navigation',
          title: 'Navigation',
          type: 'group',
          icon: 'icon-navigation',
          children: [
              {
                  id: 'dashboard',
                  title: 'Dashboard',
                  type: 'item',
                  url: '/dashboard/default',
                  icon: 'feather icon-home',
              }
          ]
      },
      {
          id: 'app-contents',
          title: 'App Contents',
          type: 'group',
          children: [
              {
                  id: 'all-users',
                  title: 'Users',
                  type: 'item',
                  url: '/app-content/all-users',
                  icon: 'feather icon-users'
              },
              {
                  id: 'all-courses',
                  title: 'Courses',
                  type: 'item',
                  url: '/app-content/all-courses',
                  icon: 'feather icon-cast',
              },
              {
                  id: 'all-invoices',
                  title: 'Invoices',
                  type: 'item',
                  url: '/app-content/all-invoices',
                  icon: 'feather icon-file-text',
              },
              {
                  id: 'all-lessons',
                  title: 'Lessons',
                  type: 'item',
                  url: '/app-content/all-lessons',
                  icon: 'feather icon-play-circle',
              },
              {
                  id: 'all-feedback',
                  title: 'Feedback',
                  type: 'item',
                  url: '/app-content/all-feedback',
                  icon: 'feather icon-edit',
              },
              {
                  id: 'all-comments',
                  title: 'Comments',
                  type: 'item',
                  url: '/app-content/all-comments',
                  icon: 'feather icon-message-square',
              },
              {
                  id: 'all-coupons',
                  title: 'Coupons',
                  type: 'item',
                  url: '/app-content/all-coupons',
                  icon: 'feather icon-tag',
              }
          ]
      }
    ]
}
