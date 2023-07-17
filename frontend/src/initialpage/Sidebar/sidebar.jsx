import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

const employeeMenu = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'la la-users',
  },
  {
    name: 'Attendance',
    link: '/employee/attendance-employee',
    icon: 'la la-users',
  },
  {
    name: 'Leave Request',
    link: '/employees/leave request',
    icon: '',
  },
  {
    name: 'Leads',
    hasChildren: true,
    icon: 'la la-users',
    children: [
      {
        name: 'All Leads',
        link: '/employees/leads',
      },
      // {
      //   name: 'Lead Status',
      //   link: '/leads/lead-status',
      // },
    ],
  },
  {
    name: 'Sales',
    hasChildren: true,
    icon: 'la la-money',
    children: [
      {
        name: 'Customers',
        link: '/sales/customers',
      },
      {
        name: 'Projects',
        link: '/projects/projects-list',
      },
    ],
  },
];

const hrMenu = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'la la-users',
  },
  {
    name: 'Attendance',
    link: '/employee/attendance-employee',
    icon: 'la la-users',
  },
  {
    name: 'Leave Request',
    link: '/employees/leave request',
    icon: '',
  },
  {
    name: 'Empolyee Leave',
    link: '/employees/hr-leave-request',
    icon: '',
  },
  {
    name: 'HRMS',
    hasChildren: true,
    icon: 'la la-file-pdf-o',
    children: [
      {
        name: 'Employees',
        link: '/employee/employees-list',
      },
      {
        name: 'Attendance',
        link: '/employee/attendance-admin',
      },
      {
        name: 'Leave Request',
        link: '/administrator/leave-request',
      },
      {
        name: 'Jobs',
        link: '/administrator/jobs',
      },
      {
        name: 'Applicants',
        link: '/administrator/candidates',
      },
      {
        name: 'Onboarding',
        link: '/administrator/onboarding',
      },
      {
        name: 'Payroll',
        link: '/administrator/payroll',
      },
    ],
  },
];

const managerMenu = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'la la-users',
  },
  {
    name: 'Attendance',
    link: '/employee/attendance-employee',
    icon: 'la la-users',
  },
  {
    name: 'Leave Request',
    link: '/employees/leave request',
    icon: '',
  },
  {
    name: 'Leads',
    hasChildren: true,
    icon: 'la la-users',
    children: [
      {
        name: 'Leads',
        link: '/employees/leads',
      },
      {
        name: 'Projects',
        link: '/leads/projects',
      },
    ],
  },
];

const accountantMenu = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'la la-users',
  },
  {
    name: 'Attendance',
    link: '/employee/attendance-employee',
    icon: 'la la-users',
  },
  {
    name: 'Leave Request',
    link: '/employees/leave request',
    icon: '',
  },
  {
    name: 'Payroll',
    link: '/administrator/payroll',
  },
  {
    name: 'Accounts',
    hasChildren: true,
    icon: 'la la-money',
    children: [
      {
        name: 'General Ledger',
        link: '/accounts/general-ledger',
      },
      {
        name: 'Manual Journals',
        link: '/accounts/manual-journals',
      },
      {
        name: 'Account Receiveable',
        link: '/accounts/account-receiveable',
      },
      {
        name: 'Account Payable',
        link: '/accounts/account-payable',
      },
      {
        name: 'Fixed Assets',
        link: '/accounts/fixed-assets',
      },
    ],
  },
];

const supportMenu = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'la la-users',
  },
  {
    name: 'Attendance',
    link: '/employee/attendance-employee',
    icon: 'la la-users',
  },
  {
    name: 'Leave Request',
    link: '/employees/leave request',
    icon: '',
  },
  {
    name: 'Tickets',
    hasChildren: false,
    icon: 'la la-ticket',
    link: '/employees/tickets',
  },
];

const salesMenu = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'la la-users',
  },
  {
    name: 'Attendance',
    link: '/employee/attendance-employee',
    icon: 'la la-users',
  },
  {
    name: 'Leave Request',
    link: '/employees/leave request',
    icon: '',
  },
  {
    name: 'Sales',
    hasChildren: true,
    icon: 'la la-money',
    children: [
      {
        name: 'Customers',
        link: '/sales/customers',
      },
      {
        name: 'Estimates',
        link: '/sales/estimates',
      },
      {
        name: 'Sales Orders',
        link: '/sales/salesorder',
      },
      // {
      //   name: 'Delivery Challans',
      //   link: '/sales/deliverychallan',
      // },
      {
        name: 'Invoices',
        link: '/sales/invoices',
      },
      {
        name: 'Payments Received',
        link: '/sales/payment-received',
      },
      {
        name: 'Recurring Invoices',
        link: '/sales/recurring-invoices',
      },
      {
        name: 'Credit Notes',
        link: '/sales/credit-notes',
      },
    ],
  },
];

// const managerMenu = [
//   {
//     name: 'Dashboard',
//     link: '/dashboard',
//     icon: 'la la-users',
//   },
//   {
//     name: 'Attendance',
//     link: '/employee/attendance-employee',
//     icon: 'la la-users',
//   },
//   {
//     name: 'Leave Request',
//     link: '/employees/leave request',
//     icon: '',
//   },
// ]

const bar = [
  {
    name: 'Main',
    children: [
      {
        name: 'Dashboard',
        link: '/dashboard',
        icon: 'la la-users',
        hasChildren: false,
      },
      {
        name: 'HRMS',
        hasChildren: true,
        icon: 'la la-file-pdf-o',
        children: [
          {
            name: 'Employees',
            link: '/employee/employees-list',
          },
          {
            name: 'Attendance',
            link: '/employee/attendance-admin',
          },
          {
            name: 'Leave Request',
            link: '/administrator/leave-request',
          },
          {
            name: 'Empolyee Leave Handle',
            link: '/employees/hr-leave-request',
            icon: '',
          },
          {
            name: 'Jobs',
            link: '/administrator/jobs',
          },
          {
            name: 'Applicants',
            link: '/administrator/candidates',
          },
          {
            name: 'Onboarding',
            link: '/administrator/onboarding',
          },
          {
            name: 'Payroll',
            link: '/administrator/payroll',
          },
        ],
      },
      {
        name: 'Project',
        hasChildren: true,
        icon: 'la la-users',
        children: [
          {
            name: 'Leads',
            link: '/employees/leads',
          },
          {
            name: 'Status',
            link: '/leads/lead-status',
          },
          {
            name: 'Projects',
            link: '/leads/projects',
          },
        ],
      },
      {
        name: 'Sales',
        hasChildren: true,
        icon: 'la la-money',
        children: [
          {
            name: 'Customers',
            link: '/sales/customers',
          },
          {
            name: 'Estimates',
            link: '/sales/estimates',
          },
          {
            name: 'Sales Orders',
            link: '/sales/salesorder',
          },
          // {
          //   name: 'Delivery Challans',
          //   link: '/sales/deliverychallan',
          // },
          {
            name: 'Invoices',
            link: '/sales/invoices',
          },
          {
            name: 'Payments Received',
            link: '/sales/payment-received',
          },
          {
            name: 'Recurring Invoices',
            link: '/sales/recurring-invoices',
          },
          {
            name: 'Credit Notes',
            link: '/sales/credit-notes',
          },
          {
            name: 'Add Tax',
            link: '/sales/taxes',
          },
        ],
      },
      {
        name: 'Purchase',
        hasChildren: true,
        icon: 'la la-shopping-cart',
        children: [
          {
            name: 'Vendors',
            link: '/purchase/vendors',
          },
          {
            name: 'Expenses',
            link: '/purchase/expenses',
          },
          {
            name: 'Recurring Expenses',
            link: '/purchase/recurringexpenses',
          },
          {
            name: 'Purchase Orders',
            link: '/purchase/purchaseorder',
          },
          {
            name: 'Bills',
            link: '/purchase/bills',
          },
          {
            name: 'Payments Made',
            link: '/purchase/paymentsmade',
          },
          {
            name: 'Recurring Bills',
            link: '/purchase/recurringbills',
          },
          {
            name: 'Vendor Credits',
            link: '/purchase/vendorcredit',
          },
        ],
      },
      {
        name: 'Stock',
        hasChildren: true,
        icon: 'la la-users',
        children: [
          {
            name: 'Stocks',
            link: '/stock/stocklist',
          },
          {
            name: 'Transfer Stocks',
            link: '/stock/transferstock',
          },
          // {
          //   name: 'Allocated Stocks',
          //   link: '/stock/allotstock',
          // },
          // {
          //   name: 'Add Billed Stock',
          //   // link: '/stock/addstock',
          //   link: '/stock/addbilledstock',
          // },
          // {
          //   name: 'Split Stock',
          //   link: '/stock/splitstock',
          // },
        ],
      },
      {
        name: 'Accounts',
        hasChildren: true,
        icon: 'la la-money',
        children: [
          {
            name: 'General Ledger',
            link: '/accounts/general-ledger',
          },
          {
            name: 'Manual Journals',
            link: '/accounts/manual-journals',
          },
          {
            name: 'Account Receiveable',
            link: '/accounts/account-receiveable',
          },
          {
            name: 'Account Payable',
            link: '/accounts/account-payable',
          },
          {
            name: 'Fixed Assets',
            link: '/accounts/fixed-assets',
          },
        ],
      },
      {
        name: 'Tickets',
        hasChildren: false,
        icon: 'la la-ticket',
        link: '/employees/tickets',
      },
      {
        name: 'Reports',
        hasChildren: true,
        icon: 'la la-file-pdf-o',
        children: [
          {
            name: 'Vendor Balance Report',
            link: '/reports/vendor-balance-summary',
          },
          {
            name: 'Vendor Purchase Report',
            link: '/reports/vendor-purchase-report',
          },
          // {
          //   name: 'Vendor Credit Report',
          //   link: '/reports/vendor-credit-report',
          // },
          // {
          //   name: 'Projects Report',
          //   link: '/reports/projects-report',
          // },
          // {
          //   name: 'Projects Bill Report',
          //   link: '/reports/projects-balance-report',
          // },
          {
            name: 'Payments Received',
            link: '/reports/payment-received',
          },
          {
            name: 'Payments Made',
            link: '/reports/payment-made',
          },
          // {
          //   name: 'Sales Order Details',
          //   link: '/reports/sales-order-details',
          // },
          // {
          //   name: 'Sales By Customer',
          //   link: '/reports/sales-by-customer',
          // },
          // {
          //   name: 'Customer Bal. Summary',
          //   link: '/reports/customer-bal-summary',
          // },
          // {
          //   name: 'Sales By Employee',
          //   link: '/reports/sales-by-agent',
          // },
          // {
          //   name: 'Sales By Projects',
          //   link: '/reports/sales-by-product',
          // },
          // {
          //   name: 'Profit & Loss',
          //   link: '/reports/profit-and-loss',
          // },
          // {
          //   name: 'Cash Flow Statement',
          //   link: '/reports/cash-flow-statement',
          // },
          // {
          //   name: 'Balance Sheet',
          //   link: '/reports/balance-sheet',
          // },
          // {
          //   name: 'Sales By Customer',
          //   link: '/reports/sales-by-customer',
          // },
          // {
          //   name: 'Sales By Employee',
          //   link: '/reports/sales-by-agent',
          // },
          // {
          //   name: 'Sales By Projects',
          //   link: '/reports/sales-by-product',
          // },
        ],
      },
    ],
  },
];

const Sidebar = (props) => {
  const authentication = useSelector((state) => state.authentication.value);
  let pathname = props.location.pathname;
  const isAdmin = authentication?.user?.jobRole?.authorities.includes('ADMIN');
  const isHR = authentication?.user?.jobRole?.authorities.includes('HR');
  const isEmployee =
    authentication?.user?.jobRole?.authorities.includes('EMPLOYEE');
  const isManager =
    authentication?.user?.jobRole.authorities.includes('MANAGER');
  const isAccountant =
    authentication?.user?.jobRole.authorities.includes('ACCOUNTANT');
  const isSales = authentication?.user?.jobRole.authorities.includes('SALES');
  const isSupport =
    authentication?.user?.jobRole.authorities.includes('SUPPORT');
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    var Sidemenu = function () {
      this.$menuItem = $('#sidebar-menu a');
    };

    function init() {
      $('#sidebar-menu a').on('click', function (e) {
        if ($(this).parent().hasClass('submenu')) {
          e.preventDefault();
        }
        if (!$(this).hasClass('subdrop')) {
          $('ul', $(this).parents('ul:first')).slideUp(350);
          $('a', $(this).parents('ul:first')).removeClass('subdrop');
          $(this).next('ul').slideDown(350);
          $(this).addClass('subdrop');
        } else if ($(this).hasClass('subdrop')) {
          $(this).removeClass('subdrop');
          $(this).next('ul').slideUp(350);
        }
      });
      $('#sidebar-menu ul li.submenu a.active')
        .parents('li:last')
        .children('a:first')
        .addClass('active')
        .trigger('click');
    }
    if (firstLoad) {
      setTimeout(() => {
        init();
        setFirstLoad(false);
      }, 1000);
    }
  }, []);

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            {isAdmin &&
              bar.map((item, index) => (
                <>
                  <li className="menu-title">
                    <span>{item.name}</span>
                  </li>
                  {item.children.map((child, index) =>
                    child.hasChildren ? (
                      <li className="submenu">
                        <a href="#">
                          <i className={child.icon} />{' '}
                          <span> {child.name}</span>{' '}
                          <span className="menu-arrow" />
                        </a>
                        <ul style={{ display: 'none' }}>
                          {child.children.map((sc) => (
                            <li>
                              <Link
                                className={
                                  pathname.includes(sc.link) ? 'active' : ''
                                }
                                to={`/app${sc.link}`}
                              >
                                {sc.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li>
                        <Link
                          className={
                            pathname.includes(child.link) ? 'active' : ''
                          }
                          to={`/app${child.link}`}
                        >
                          <i className={child.icon}></i>
                          <span>{child.name}</span>
                        </Link>
                      </li>
                    )
                  )}
                </>
              ))}
            {isEmployee && (
              <>
                {employeeMenu.map((child, index) =>
                  child.hasChildren ? (
                    <li className="submenu">
                      <a href="#">
                        <i className={child.icon} /> <span> {child.name}</span>{' '}
                        <span className="menu-arrow" />
                      </a>
                      <ul style={{ display: 'none' }}>
                        {child.children.map((sc) => (
                          <li>
                            <Link
                              className={
                                pathname.includes(sc.link) ? 'active' : ''
                              }
                              to={`/app${sc.link}`}
                            >
                              {sc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className={
                          pathname.includes(child.link) ? 'active' : ''
                        }
                        to={`/app${child.link}`}
                      >
                        <i className={child.icon}></i>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                )}
              </>
            )}
            {isHR && (
              <>
                {hrMenu.map((child, index) =>
                  child.hasChildren ? (
                    <li className="submenu">
                      <a href="#">
                        <i className={child.icon} /> <span> {child.name}</span>{' '}
                        <span className="menu-arrow" />
                      </a>
                      <ul style={{ display: 'none' }}>
                        {child.children.map((sc) => (
                          <li>
                            <Link
                              className={
                                pathname.includes(sc.link) ? 'active' : ''
                              }
                              to={`/app${sc.link}`}
                            >
                              {sc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className={
                          pathname.includes(child.link) ? 'active' : ''
                        }
                        to={`/app${child.link}`}
                      >
                        <i className={child.icon}></i>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                )}
              </>
            )}
            {isManager && (
              <>
                {managerMenu.map((child, index) =>
                  child.hasChildren ? (
                    <li className="submenu">
                      <a href="#">
                        <i className={child.icon} /> <span> {child.name}</span>{' '}
                        <span className="menu-arrow" />
                      </a>
                      <ul style={{ display: 'none' }}>
                        {child.children.map((sc) => (
                          <li>
                            <Link
                              className={
                                pathname.includes(sc.link) ? 'active' : ''
                              }
                              to={`/app${sc.link}`}
                            >
                              {sc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className={
                          pathname.includes(child.link) ? 'active' : ''
                        }
                        to={`/app${child.link}`}
                      >
                        <i className={child.icon}></i>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                )}
              </>
            )}
            {isAccountant && (
              <>
                {accountantMenu.map((child, index) =>
                  child.hasChildren ? (
                    <li className="submenu">
                      <a href="#">
                        <i className={child.icon} /> <span> {child.name}</span>{' '}
                        <span className="menu-arrow" />
                      </a>
                      <ul style={{ display: 'none' }}>
                        {child.children.map((sc) => (
                          <li>
                            <Link
                              className={
                                pathname.includes(sc.link) ? 'active' : ''
                              }
                              to={`/app${sc.link}`}
                            >
                              {sc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className={
                          pathname.includes(child.link) ? 'active' : ''
                        }
                        to={`/app${child.link}`}
                      >
                        <i className={child.icon}></i>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                )}
              </>
            )}
            {isSupport && (
              <>
                {supportMenu.map((child, index) =>
                  child.hasChildren ? (
                    <li className="submenu">
                      <a href="#">
                        <i className={child.icon} /> <span> {child.name}</span>{' '}
                        <span className="menu-arrow" />
                      </a>
                      <ul style={{ display: 'none' }}>
                        {child.children.map((sc) => (
                          <li>
                            <Link
                              className={
                                pathname.includes(sc.link) ? 'active' : ''
                              }
                              to={`/app${sc.link}`}
                            >
                              {sc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className={
                          pathname.includes(child.link) ? 'active' : ''
                        }
                        to={`/app${child.link}`}
                      >
                        <i className={child.icon}></i>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                )}
              </>
            )}
            {isSales && (
              <>
                {salesMenu.map((child, index) =>
                  child.hasChildren ? (
                    <li className="submenu">
                      <a href="#">
                        <i className={child.icon} /> <span> {child.name}</span>{' '}
                        <span className="menu-arrow" />
                      </a>
                      <ul style={{ display: 'none' }}>
                        {child.children.map((sc) => (
                          <li>
                            <Link
                              className={
                                pathname.includes(sc.link) ? 'active' : ''
                              }
                              to={`/app${sc.link}`}
                            >
                              {sc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        className={
                          pathname.includes(child.link) ? 'active' : ''
                        }
                        to={`/app${child.link}`}
                      >
                        <i className={child.icon}></i>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Sidebar);
