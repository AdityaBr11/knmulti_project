import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
//estimate
import Estimate from './estimate';
import EstimateView from './estimateview';
import Createestimate from './createestimate';
import Editestimate from './editestimate';

import Expense from './expense';
//invoice
import Invoice from './invoice';
import Invoiceedit from './invoiceedit';
import InvoiceView from './Invoiceview';

import Payments from './payments';
import ProvidentFund from './providentfund';
import Taxes from './tax';
import Customer from './Customers';
import Projects from './project';
import RecurringInvoices from './recurringInvoices';
import Vendorcreate from './vendorcreate';
import Vendoredit from './vendoredit';
import RecurringBillCreate from './recurringbillcreate';
import RecurringBillEdit from './recurringbilledit';
// import RecurringInvoiceEdit from './recurringinvoiceedit';
import CreditNotes from './CreditNotes';
import ExpenseCreate from './expensecreate';
import ExpenseEdit from './expenseedit';
import AddCustomers from './AddCustomers';
import CreateSalesOrder from './createSalesOrder';
import SalesOrder from './SalesOrder';
import CreateDeliveryChallan from './CreateDeliveryChallan';
import DeliveryChallan from './DeliveryChallan';
import CreateInvoice from './createInvoice';
import RecordPayment from './RecordPayment';
import CreateRecurringInvoice from './createRecurringInvoice';
import CreateCreditNotes from './CreateCreditNotes';
import SalesOrderInfo from './SalesOrderInfo';
import DeliveryChallanInfo from './DeliveryChallanInfo';
import CreditNotesInfo from './CreditNotesInfo';
import PaymentView from './paymentView';
import RecordPaywoInv from './RecordPaywoInv';
import RecurringInvoiceInfo from './RecurringInvoiceInfo';
import ApplyToPayCredit from './ApplyToPayCredit';

const SalesRoute = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/customers`} />
    <Route path={`${match.url}/customers`} component={Customer} />
    <Route path={`${match.url}/add-customers/`} component={AddCustomers} />
    <Route path={`${match.url}/salesorder/`} component={SalesOrder} />
    <Route path={`${match.url}/createsalesorder/`} component={CreateSalesOrder} />
    <Route path={`${match.url}/salesorder-info/:id`} component={SalesOrderInfo} />
    <Route path={`${match.url}/deliverychallan/`} component={DeliveryChallan} />
    <Route path={`${match.url}/createdeliverychallan/`} component={CreateDeliveryChallan} />
    <Route path={`${match.url}/deliverychallan-info/:id`} component={DeliveryChallanInfo} />
    <Route path={`${match.url}/createinvoice/`} component={CreateInvoice} />

    <Route path={`${match.url}/projects`} component={Projects} />
    <Route path={`${match.url}/estimates`} component={Estimate} />
    <Route path={`${match.url}/estimatesview/:id`} component={EstimateView} />
    <Route path={`${match.url}/createestimates`} component={Createestimate} />
    <Route path={`${match.url}/editestimates`} component={Editestimate} />
    <Route path={`${match.url}/expenses`} component={Expense} />
    <Route path={`${match.url}/expenses-create`} component={ExpenseCreate} />
    <Route path={`${match.url}/expenses-edit`} component={ExpenseEdit} />

    <Route path={`${match.url}/invoices`} component={Invoice} />
    <Route path={`${match.url}/apply-credits`} component={ApplyToPayCredit} />
    <Route exact
      path={`${match.url}/recurring-invoices`}
      component={RecurringInvoices}
    />
    <Route exact
      path={`${match.url}/recurring-invoice/:id`}
      component={RecurringInvoiceInfo}
    />
    <Route path={`${match.url}/recurring-invoices-create`} component={CreateRecurringInvoice} />
    <Route path={`${match.url}/vendor-create`} component={Vendorcreate} />
    <Route
      path={`${match.url}/recurring-bill-create`}
      component={RecurringBillCreate}
    />
    <Route path={`${match.url}/invoices-edit/:id`} component={Invoiceedit} />
    <Route path={`${match.url}/vendor-edit`} component={Vendoredit} />
    <Route
      path={`${match.url}/recurring-bill-edit`}
      component={RecurringBillEdit}
    />
    {/* <Route
      path={`${match.url}/recurring-invoice-edit`}
      component={RecurringInvoiceEdit}
    /> */}
    <Route path={`${match.url}/invoice-view/:id`} component={InvoiceView} />

    <Route path={`${match.url}/payment-received`} component={Payments} />
    <Route path={`${match.url}/payment-view/:id`} component={PaymentView} />
    <Route exact path={`${match.url}/record-payment`} component={RecordPayment} />
    <Route exact path={`${match.url}/record-pay-wo-inv`} component={RecordPaywoInv} />
    <Route path={`${match.url}/provident-fund`} component={ProvidentFund} />
    <Route path={`${match.url}/taxes`} component={Taxes} />
    <Route path={`${match.url}/credit-notes`} component={CreditNotes} />
    <Route path={`${match.url}/create-credit-note`} component={CreateCreditNotes} />
    <Route path={`${match.url}/creditnotesinfo/:id`} component={CreditNotesInfo} />
  </Switch>
);

export default SalesRoute;
