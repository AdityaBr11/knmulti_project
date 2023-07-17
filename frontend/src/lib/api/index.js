import { useDispatch } from 'react-redux';
import httpService from '../httpService';

export async function Login(userName, password) {
  const LoginResponse = new Promise(async (resolve) => {
    httpService
      .post('/auth/login', { userName, password })
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error ',
        });
      });
  });
  return LoginResponse;
}

export async function getDashboard() {
  const dashboard = new Promise(async (resolve) => {
    httpService
      .get('/dashboard')
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        console.log(err);
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return dashboard;
}

export async function allemployee() {
  const employeeResponse = new Promise(async (resolve) => {
    httpService
      .get('/employee')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return employeeResponse;
}

export async function getEmployee(id) {
  const employeeResponse = new Promise(async (resolve) => {
    httpService
      .get(`/employee/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return employeeResponse;
}

export async function addemployee(data) {
  const addEmployeeResponse = new Promise(async (resolve) => {
    httpService
      .post('/employee', data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addEmployeeResponse;
}

export async function updateEmployee(id, data) {
  console.log('updateEmployee', id, data);
  const updateEmployeeResponse = new Promise(async (resolve) => {
    httpService
      .put(`/employee/${id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return updateEmployeeResponse;
}

export async function fetchholiday() {
  const holidayResponse = new Promise(async (resolve) => {
    httpService
      .get('/holiday')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return holidayResponse;
}

export async function addholiday(data) {
  const addHolidayResponse = new Promise(async (resolve) => {
    httpService
      .post('/holiday', data)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addHolidayResponse;
}

export async function fetchdepartment(id = false) {
  const departmentResponse = new Promise(async (resolve) => {
    httpService
      .get(`/department/${id ? id : ''}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return departmentResponse;
}

export async function fetchClient() {
  const departmentResponse = new Promise(async (resolve) => {
    httpService
      .get('/customer')
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return departmentResponse;
}

export async function fetchOvertime() {
  const overtimeResponse = new Promise(async (resolve) => {
    httpService
      .get('/overtime')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return overtimeResponse;
}

export async function fetchLocations() {
  const fetchJobsResponse = new Promise(async (resolve) => {
    httpService
      .get('/location')
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchJobsResponse;
}

export async function fetchJobs() {
  const fetchJobsResponse = new Promise(async (resolve) => {
    httpService
      .get('/job')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchJobsResponse;
}

export async function fetchJob(_id) {
  const fetchJobsResponse = new Promise(async (resolve) => {
    httpService
      .get(`/job/${_id}`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchJobsResponse;
}

export async function deleteJob(_id) {
  const fetchJobsResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/job/${_id}`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchJobsResponse;
}

export async function addJob(data) {
  const addJobResponse = new Promise(async (resolve) => {
    httpService
      .post('/job', data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addJobResponse;
}

export async function updateJob(data, _id) {
  const addJobResponse = new Promise(async (resolve) => {
    httpService
      .put(`/job/${_id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addJobResponse;
}

export async function fetchInvestment() {
  const fetchInvestmentResponse = new Promise(async (resolve) => {
    httpService
      .get('/investment')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchInvestmentResponse;
}

export async function fetchTax() {
  const fetchTaxResponse = new Promise(async (resolve) => {
    httpService
      .get('/tax')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchTaxResponse;
}

export async function fetchGoals() {
  const fetchGoalTypeResponse = new Promise(async (resolve) => {
    httpService
      .get('/goal-type')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchGoalTypeResponse;
}

export async function fetchGoalList() {
  const GoalListResponse = new Promise(async (resolve) => {
    httpService
      .get('/goal')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return GoalListResponse;
}

export async function fetchPayment() {
  const fetchPaymentResponse = new Promise(async (resolve) => {
    httpService
      .get('/sale-payment')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchPaymentResponse;
}

export async function fetchEstimate() {
  const fetchEstimateResponse = new Promise(async (resolve) => {
    httpService
      .get('/sale-payment')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchEstimateResponse;
}

export async function fetchCandidate() {
  const fetchCandidateResponse = new Promise(async (resolve) => {
    httpService
      .get('/candidate')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchCandidateResponse;
}

export async function fetchProjects() {
  const fetchCandidateResponse = new Promise(async (resolve) => {
    httpService
      .get('/project')
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchCandidateResponse;
}

export async function fetchProject(data) {
  const fetchCandidateResponse = new Promise(async (resolve) => {
    httpService
      .post('/project', data)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchCandidateResponse;
}

export async function fetchVendor() {
  const fetchVendorResponse = new Promise(async (resolve) => {
    httpService
      .get('/vendor')
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchVendorResponse;
}

export async function fetchExpense() {
  const fetchExpenseResponse = new Promise(async (resolve) => {
    httpService
      .get('/expense')
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchExpenseResponse;
}

export async function fetchTicket() {
  const fetchTicketResponse = new Promise(async (resolve) => {
    httpService
      .get('/ticket')
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchTicketResponse;
}

export async function fetchSingleTicket(id) {
  const fetchTicketResponse = new Promise(async (resolve) => {
    httpService
      .get(`/ticket/${id}`)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchTicketResponse;
}

export async function updateTicket(id, data) {
  const fetchTicketResponse = new Promise(async (resolve) => {
    httpService
      .put(`/ticket/${id}`, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchTicketResponse;
}

export async function deleteTicket(id) {
  const fetchTicketResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/ticket/${id}`)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchTicketResponse;
}

export async function addTicket(data) {
  const fetchTicketResponse = new Promise(async (resolve) => {
    httpService
      .post('/ticket', data)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchTicketResponse;
}

export async function fetchBill() {
  const fetchBillResponse = new Promise(async (resolve) => {
    httpService
      .get('/bill')
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchBillResponse;
}

export async function getACustomer(id) {
  const fetchResponse = new Promise(async (resolve) => {
    httpService
      .get(`/customer/${id}`)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchResponse;
}

export async function addCandidate(data) {
  const addCandidateResponse = new Promise(async (resolve) => {
    httpService
      .post('/candidate', data)
      .then((response) => {
        console.log(data,"data",response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addCandidateResponse;
}

export async function getCandidate(_id) {
  const getCandidateResponse = new Promise(async (resolve) => {
    httpService
      .get(`/candidate/${_id}`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return getCandidateResponse;
}

export async function updateCandidate(_id, data,dispatch) {
  // const dispatch = useDispatch();
  
  const updateCandidateResponse = new Promise(async (resolve) => {
     
    httpService
      .put(`/candidate/${_id}`, data)
      .then((response) => {
        
        // console.log(response,"dd");
        
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return updateCandidateResponse;
}

export async function deleteCandidate(_id) {
  const deleteCandidateResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/candidate/${_id}`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return deleteCandidateResponse;
}

export async function getCandidatesByStatus(status) {
  const getCandidatesByStatusResponse = new Promise(async (resolve) => {
    httpService
      .get(`/candidate/status/${status}`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return getCandidatesByStatusResponse;
}

export async function getCandidatesByJobId(jobId) {
  const getCandidatesByJobIdResponse = new Promise(async (resolve) => {
    httpService
      .get(`/candidate/jobId/${jobId}`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return getCandidatesByJobIdResponse;
}

export async function getRoles() {
  const getRolesResponse = new Promise(async (resolve) => {
    httpService
      .get(`/role/`)
      .then((response) => {
        console.log(response);
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return getRolesResponse;
}

export async function getDocuments(id) {
  const getDocumentsResponse = new Promise(async (resolve) => {
    httpService
      .get(`/documents/${id}`)
      .then((response) => {
        console.log(response.data[0]);
        return resolve(response.data[0]);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return getDocumentsResponse;
}

// data = [{data, description, uploadedAt}, {data, description, uploadedAt}, {data, description, uploadedAt}]
export async function postDocuments(id, data) {
  const postDocumentsResponse = new Promise(async (resolve) => {
    const postBody = { user: id, uploads: data };
    httpService
      .post(`/documents/`, postBody)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return postDocumentsResponse;
}

export async function editDocuments(id, data) {
  const editDocumentsResponse = new Promise(async (resolve) => {
    const res = await getDocuments(id);
    const updatedBody = { ...res, uploads: [...res.uploads, data] };
    httpService
      .put(`/documents/${id}`, updatedBody)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return editDocumentsResponse;
}

export async function fetchAttendance(id = '') {
  const fetchAttendanceResponse = new Promise(async (resolve) => {
    httpService
      .get(`/timesheets/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchAttendanceResponse;
}

// data = {employee: 1, date: 23-4-2021, hours: 0, sessions: []}
export async function addAttendance(data) {
  const addAttendanceResponse = new Promise(async (resolve) => {
    httpService
      .post(`/timesheets/`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        console.log('Inside addAttendance method()');
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addAttendanceResponse;
}

// data = {employee: 1, date: 23-4-2021, hours: (sum of time from all sessions), sessions: [{id: (length + 1), from:..., upto:...}]}
export async function editAttendance(id, data) {
  const editAttendanceResponse = new Promise(async (resolve) => {
    httpService
      .put(`/timesheets/${id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return editAttendanceResponse;
}

export async function fetchLeaveTypes() {
  const fetchLeaveTypesResponse = new Promise(async (resolve) => {
    httpService
      .get(`/leave-type/`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchLeaveTypesResponse;
}

export async function addLeaveType(data) {
  const addLeaveTypeResponse = new Promise(async (resolve) => {
    httpService
      .post(`/leave-type/`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addLeaveTypeResponse;
}

export async function editLeaveType(id, data) {
  const editLeaveTypeResponse = new Promise(async (resolve) => {
    httpService
      .put(`/leave-type/${id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return editLeaveTypeResponse;
}

export async function deleteLeaveType(id) {
  const deleteLeaveTypeResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/leave-type/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return deleteLeaveTypeResponse;
}
//employee type
export async function fetchEmployeeTypes() {
  const fetchLeaveTypesResponse = new Promise(async (resolve) => {
    httpService
      .get(`/employee-type/`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchLeaveTypesResponse;
}

export async function addEmployeeType(data) {
  const addLeaveTypeResponse = new Promise(async (resolve) => {
    httpService
      .post(`/employee-type/`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addLeaveTypeResponse;
}

export async function editEmployeeType(id, data) {
  const editLeaveTypeResponse = new Promise(async (resolve) => {
    httpService
      .put(`/employee-type/${id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return editLeaveTypeResponse;
}

export async function deleteEmployeeType(id) {
  const deleteLeaveTypeResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/employee-type/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return deleteLeaveTypeResponse;
}

export async function deleteLeave(id) {
  const deleteLeaveResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/leave/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return deleteLeaveResponse;
}

export async function fetchLeaves(id = null) {
  const fetchLeavesResponse = new Promise(async (resolve) => {
    httpService
      .get(`/leave/${id ? id : ``}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return fetchLeavesResponse;
}

export async function addLeave(data) {
  const addLeaveResponse = new Promise(async (resolve) => {
    httpService
      .post(`/leave/`, data)
      .then((response) => {
        
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return addLeaveResponse;
}

export async function editLeave(id, data) {
  const editLeaveResponse = new Promise(async (resolve) => {
    httpService
      .put(`/leave/${id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return editLeaveResponse;
}

export async function getCustomHolidays(id = '') {
  const getCustomHolidaysResponse = new Promise(async (resolve) => {
    httpService
      .get(`/holiday/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return getCustomHolidaysResponse;
}

export async function postCustomHoliday(data) {
  const postCustomHolidayResponse = new Promise(async (resolve) => {
    httpService
      .post(`/holiday/`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return postCustomHolidayResponse;
}

export async function putCustomHoliday(id, data) {
  const putCustomHolidayResponse = new Promise(async (resolve) => {
    httpService
      .put(`/holiday/${id}`, data)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return putCustomHolidayResponse;
}

export async function removeCustomHoliday(id) {
  const removeCustomHolidayResponse = new Promise(async (resolve) => {
    httpService
      .delete(`/holiday/${id}`)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return resolve({
          error: true,
          message: err.response.message || 'Internal Server Error',
        });
      });
  });
  return removeCustomHolidayResponse;
}
