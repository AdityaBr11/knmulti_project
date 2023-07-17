import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import VendorBill from '../Pages/Profile/panes/VendorBill';
import AddPurchaseOrder from './AddPurchaseOrder';
import AddRecurringBill from './AddRecurringBill';
import AddRecurringExpense from './AddRecurringExpense';
import AddVendor from './AddVendor';
import AddVendorCredit from './AddVendorCredit';
import BillInfo from './BillInfo';
import BillPayments from './BillPayments';
import Bills from './bills';
import ExpenseInfo from './ExpenseInfo';
import Expenses from './Expenses';
import ExpensesView from './ExpensesView';
import LandsaleEdit from './LandsaleEdit';
// import Expense from './expense';
import PaymentInfo from './PaymentInfo';
// import PaymentMade from './paymentMade';
import PaymentsMade from './PaymentsMade';
import PurchaseOrderInfo from './PurchaseOrderInfo';
import PurchaseOrderView from './PurchaseOrderView';
import RecordMileage from './RecordMileage';
import RecurringBillInfo from './RecurringBillInfo';
// import RecurringBills from './recurringBills';
import RecurringBillsView from './RecurringBillsView';
import RecurringExpenseInfo from './RecurringExpenseInfo';
import RecurringExpense from './recurringExpenses';
import RecurringExpenseView from './RecurringExpenseView';
import Vendor from './vendor';
import VendorBills from './VendorBills';
import VendorCreditInfo from './VendorCreditInfo';
import VendorCreditToBill from './VendorCreditToBill';
import VendorCreditView from './VendorCreditView';
// import VendorCredits from './vendorCredits';

const Purchase = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/vendors`} />
    <Route exact path={`${match.url}/vendors`} component={Vendor} />
    <Route exact path={`${match.url}/addvendor`} component={AddVendor} />
    <Route exact path={`${match.url}/bills`} component={VendorBills} />
    <Route exact path={`${match.url}/creditvbill`} component={VendorCreditToBill} />
    <Route exact path={`${match.url}/recurringbills`} component={RecurringBillsView} />
    <Route exact path={`${match.url}/recurringbillInfo/:id`} component={RecurringBillInfo} />
    <Route exact path={`${match.url}/addrecurringbill`} component={AddRecurringBill} />
    <Route exact path={`${match.url}/paymentsmade`} component={PaymentsMade} />
    <Route exact path={`${match.url}/createbill`} component={VendorBill} />
    <Route exact path={`${match.url}/billinfo/:id`} component={BillInfo} />
    <Route exact path={`${match.url}/paymentinfo/:id`} component={PaymentInfo} />
    <Route exact path={`${match.url}/billpayment`} component={BillPayments} />
    <Route exact path={`${match.url}/addexpense`} component={Expenses} />
    <Route exact path={`${match.url}/addmileageexpense`} component={RecordMileage} />
    <Route exact path={`${match.url}/expenses`} component={ExpensesView} />
    <Route exact path={`${match.url}/recurringexpenses`} component={RecurringExpenseView} />
    <Route exact path={`${match.url}/addrecurringexpense`} component={AddRecurringExpense} />
    <Route exact path={`${match.url}/recurringexpenseinfo/:id`} component={RecurringExpenseInfo} />
    <Route exact path={`${match.url}/expenseinfo/:id`} component={ExpenseInfo} />
    <Route exact path={`${match.url}/purchaseorder`} component={PurchaseOrderView} />
    <Route exact path={`${match.url}/addpurchaseorder`} component={AddPurchaseOrder} />
    <Route exact path={`${match.url}/purchaseorderinfo/:id`} component={PurchaseOrderInfo} />
    <Route exact path={`${match.url}/vendorcredit`} component={VendorCreditView} />
    <Route exact path={`${match.url}/addvendorcredit`} component={AddVendorCredit} />
    <Route exact path={`${match.url}/vendorcreditinfo/:id`} component={VendorCreditInfo} />
    
    <Route exact path={`${match.url}/landsaleEdit`} component={LandsaleEdit} />
    
    <Route
      path={`${match.url}/recurring-expenses`}
      component={RecurringExpense}
    />
    <Route path={`${match.url}/bills`} component={Bills} />
    {/* <Route path={`${match.url}/payment-made`} component={PaymentMade} /> */}

    {/* <Route path={`${match.url}/vendor-credits`} component={VendorCredits} /> */}
    {/* <Route path={`${match.url}/recurring-bills`} component={RecurringBills} /> */}
  </Switch>
);

export default Purchase;
