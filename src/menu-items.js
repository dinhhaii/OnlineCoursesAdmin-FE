export default {
    items: [
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
                  icon: 'feather icon-users',
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
      },
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
          id: 'ui-element',
          title: 'UI ELEMENT',
          type: 'group',
          icon: 'icon-ui',
          children: [
              {
                  id: 'basic',
                  title: 'Component',
                  type: 'collapse',
                  icon: 'feather icon-box',
                  children: [
                      {
                          id: 'button',
                          title: 'Button',
                          type: 'item',
                          url: '/basic/button'
                      },
                      {
                          id: 'badges',
                          title: 'Badges',
                          type: 'item',
                          url: '/basic/badges'
                      },
                      {
                          id: 'breadcrumb-pagination',
                          title: 'Breadcrumb & Pagination',
                          type: 'item',
                          url: '/basic/breadcrumb-paging'
                      },
                      {
                          id: 'collapse',
                          title: 'Collapse',
                          type: 'item',
                          url: '/basic/collapse'
                      },
                      {
                          id: 'tabs-pills',
                          title: 'Tabs & Pills',
                          type: 'item',
                          url: '/basic/tabs-pills'
                      },
                      {
                          id: 'typography',
                          title: 'Typography',
                          type: 'item',
                          url: '/basic/typography'
                      }
                  ]
              }
          ]
      },
      {
          id: 'ui-forms',
          title: 'Forms & Tables',
          type: 'group',
          icon: 'icon-group',
          children: [
              {
                  id: 'form-basic',
                  title: 'Form Elements',
                  type: 'item',
                  url: '/forms/form-basic',
                  icon: 'feather icon-file-text'
              },
              {
                  id: 'bootstrap',
                  title: 'Table',
                  type: 'item',
                  icon: 'feather icon-server',
                  url: '/tables/bootstrap'
              }
          ]
      },
      {
          id: 'chart-maps',
          title: 'Chart & Maps',
          type: 'group',
          icon: 'icon-charts',
          children: [
              {
                  id: 'charts',
                  title: 'Charts',
                  type: 'item',
                  icon: 'feather icon-pie-chart',
                  url: '/charts/nvd3'
              }
          ]
      }
    ]
}
