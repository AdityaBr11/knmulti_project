import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../features/employee/employeeSlice';
import departmentReducer from '../features/department/departmentSlice';
import holidayReducer from '../features/holiday/holidaySlice';
import autehticationReducer from '../features/authentication/authenticationSlice';
import roleAccessParamsReducer from '../features/roleAccessPerm/roleAccessPremSlice';
import accountReducer from '../features/account/accountSlice';
import notificationReducer from '../features/notify/notifySlice';


export default configureStore({
  reducer: {
    employee: employeeReducer,
    department: departmentReducer,
    holiday: holidayReducer,
    authentication: autehticationReducer,
    roleAccessParams: roleAccessParamsReducer,
    account: accountReducer,
    notification: notificationReducer,
  },
});
