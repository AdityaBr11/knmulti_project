import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AddBillStock from './AddBillStock';
import AddStock from './AddStock';
import AllotStock from './AllotStock';
import SplitStock from './SplitStock';
import StockList from './StockList';
import StockView from './StockView';
import TransferStock from './TransferStock';

const StocksRoute = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.url}/stocklist`} component={StockList} />
      <Route exact path={`${match.url}/transferstock`} component={TransferStock} />
      <Route exact path={`${match.url}/allotstock`} component={AllotStock} />
      <Route exact path={`${match.url}/stockinfo/:id`} component={StockView} />
      <Route exact path={`${match.url}/addstock`} component={AddStock} />
      <Route exact path={`${match.url}/addbilledstock`} component={AddBillStock} />
      <Route exact path={`${match.url}/splitstock`} component={SplitStock} />
    </Switch>
  );
};

export default StocksRoute;