import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const PayrollView = ({ id, payrollData }) => {
  console.log(id, 'idss');
  console.log(payrollData, 'payrollData');
  let onePayrollData;
  //filter payrolldata
  payrollData
  .filter((e) => {
    console.log(e?.employeeId?._id,'e frm filter id');
    return e?.employeeId?._id == id;
  })
  .map((e) => {
    onePayrollData = e;
  });
  //
  console.log(onePayrollData, 'onePayrollData');
  const nowDate = new Date();
  const firstDayPrevMonth =
    new Date(nowDate.getFullYear(), nowDate.getMonth())
      .toISOString()
      .slice(0, 8) + '01';
  const lastDayPrevMonth = new Date(nowDate.getFullYear(), nowDate.getMonth())
    .toISOString()
    .slice(0, 10);

  const [fromDate, setfromDate] = useState(firstDayPrevMonth);
  const [toDate, settoDate] = useState(lastDayPrevMonth);
  const [netSalary, setnetSalary] = useState(onePayrollData?.netSalary);
  const [description, setdescription] = useState(onePayrollData?.description);
  const [salaryRate, setsalaryRate] = useState({
    basicSalary: onePayrollData?.salaryRate?.basicSalary || 0,
    DA: onePayrollData?.salaryRate?.DA || 0,
    HRA: onePayrollData?.salaryRate?.HRA || 0,
    totalSalary: onePayrollData?.salaryRate?.totalSalary || 0,
  });

  const [attendance, setattendance] = useState({
    present: onePayrollData?.attendance?.present || 0,
    paidLeave: onePayrollData?.attendance?.paidLeave || 0,
    weeklyOff: onePayrollData?.attendance?.weeklyOff || 0,
    festival: onePayrollData?.attendance?.festival || 0,
    paidDays: onePayrollData?.attendance?.paidDays || 0,
  });
  console.log(attendance, 'attendance..');

  const [earnedSalary, setearnedSalary] = useState({
    eBasicSalary: onePayrollData?.earnedSalary?.eBasicSalary || 0,
    eDA: onePayrollData?.earnedSalary?.eDA || 0,
    eHRA: onePayrollData?.earnedSalary?.eHRA || 0,
    incentive: onePayrollData?.earnedSalary?.incentive || 0,
    totalEarned: onePayrollData?.earnedSalary?.totalEarned || 0,
  });

  const [deduction, setdeduction] = useState({
    esiAmount: 0,
    PF: onePayrollData?.deduction?.PF || 0,
    advanceAmt: onePayrollData?.deduction?.advanceAmt || 0,
    TDS: onePayrollData?.deduction?.TDS || 0,
    LWF: 0,
    professionalTax: 0,
    totalDeduction: onePayrollData?.deduction?.totalDeduction || 0,
  });
  return (
    <div className="page-wrapper p-0 m-0">
      <Helmet>
        <title>View Payroll</title>
        <meta name="description" content="Add Payroll" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <form>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Employee Name <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={onePayrollData?.employeeId?._id}
                      defaultValue={onePayrollData?.employeeId?.name}
                    >
                      <option value={''} selected>
                        {onePayrollData?.employeeId?.name}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>
                      From <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input
                        disabled
                        className="form-control"
                        type="date"
                        placeholder="mm-dd-yyyy"
                        name="fromDate"
                        value={fromDate}
                        onChange={(e) => setfromDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>
                      To <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input
                        disabled
                        className="form-control"
                        type="date"
                        placeholder="mm-dd-yyyy"
                        name="toDate"
                        value={toDate}
                        onChange={(e) => settoDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      Basic Salary <span className="text-danger">*</span>
                    </label>
                    <input
                      readOnly
                      className="form-control"
                      type="number"
                      name="basicSalary"
                      value={salaryRate?.basicSalary}
                      onChange={(e) =>
                        setsalaryRate({
                          ...salaryRate,
                          basicSalary: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      DA <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={salaryRate?.DA}
                      readOnly
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      HRA <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      readOnly
                      value={salaryRate?.HRA}
                      type="number"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      Total Salary <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      readOnly
                      value={salaryRate?.totalSalary}
                      type="number"
                    />
                  </div>
                </div>
              </div>

              {/* Tabs  */}
              <div style={{ paddingLeft: '0px' }} className="col-md-12 p-r-0">
                <div className="card tab-box">
                  <div className="row user-tabs">
                    <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                      <ul className="nav nav-tabs nav-tabs-bottom">
                        <li className="nav-item">
                          <a
                            href="#emp_attendance"
                            data-toggle="tab"
                            className="nav-link active"
                          >
                            Attendance
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#emp_grossearn"
                            data-toggle="tab"
                            className="nav-link"
                          >
                            Gross Earned
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#emp_deduction"
                            data-toggle="tab"
                            className="nav-link"
                          >
                            Deduction
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  minHeight: '20vh',
                  maxHeight: '40vh',
                  overflowY: 'auto',
                }}
                className="card p-4 tab-content"
              >
                {/* Atendance  */}
                <div className="tab-pane fade show active" id="emp_attendance">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>
                          Present Days <span className="text-danger">*</span>
                        </label>
                        <input
                          readOnly
                          type="number"
                          className="form-control"
                          name="present"
                          value={attendance?.present}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Paid Leave</label>
                        <div>
                          <input
                            readOnly
                            className="form-control"
                            type="number"
                            name="paidLeave"
                            value={attendance?.paidLeave}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Weekly OFF</label>
                        <div>
                          <input
                            readOnly
                            className="form-control"
                            type="number"
                            name="weeklyOff"
                            value={attendance?.weeklyOff}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Festival</label>
                        <input
                          readOnly
                          type="number"
                          className="form-control"
                          name="festival"
                          value={attendance?.festival}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Paid Days</label>
                        <div>
                          <input
                            className="form-control"
                            type="number"
                            name="paidDays"
                            value={attendance?.paidDays}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gross Earned  */}
                <div className="tab-pane fade show" id="emp_grossearn">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          Gross Basic Salary{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="eBasicSalary"
                          value={earnedSalary?.eBasicSalary}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          Gross DA <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="eDA"
                          value={earnedSalary?.eDA}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          Gross HRA <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="eHRA"
                          value={earnedSalary?.eHRA}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Incentive</label>
                        <input
                          readOnly
                          className="form-control"
                          type="number"
                          name="incentive"
                          value={earnedSalary?.incentive}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          Gross Salary <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="totalEarned"
                          value={earnedSalary?.totalEarned}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deduction  */}
                <div className="tab-pane fade show" id="emp_deduction">
                  <div className="row">
                    {/* <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          ESI Amount <span className="text-danger">*</span>
                        </label>
                        <input className="form-control" 
                          defaultValue={5} type="number" />
                      </div>
                    </div> */}
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          PF Amount <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="PF"
                          value={deduction?.PF}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Advance</label>
                        <input
                          readOnly
                          className="form-control"
                          type="number"
                          name="advanceAmt"
                          value={deduction?.advanceAmt}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>TDS</label>
                        <input
                          readOnly
                          className="form-control"
                          type="number"
                          name="TDS"
                          value={deduction?.TDS}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          Total Deduction <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="totalDeduction"
                          value={deduction?.totalDeduction}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row my-1">
                <div className="col-md-6 text-right"></div>
                <div className="col-md-3 text-right p-2">
                  Gross Salary Earned
                </div>
                <div className="col-md-3 text-right">
                  <input
                    className="form-control"
                    type="number"
                    name="totalEarned"
                    value={earnedSalary?.totalEarned}
                    readOnly
                  />
                </div>
              </div>
              <div className="row my-1">
                <div className="col-md-6 text-right"></div>
                <div className="col-md-3 text-right p-2">Total Deduction</div>
                <div className="col-md-3 text-right">
                  <input
                    className="form-control"
                    type="number"
                    name="totalDeduction"
                    value={deduction?.totalDeduction}
                    readOnly
                  />
                </div>
              </div>
              <div className="row my-1">
                <div className="col-md-6 text-right"></div>
                <div className="col-md-3 text-right p-2">Net Salary</div>
                <div className="col-md-3 text-right">
                  <input
                    className="form-control"
                    type="number"
                    name="netSalary"
                    value={netSalary}
                    readOnly
                  />
                </div>
              </div>

              <div className="row my-2">
                <div className="col-md-12">
                  <textarea
                    readOnly
                    className="form-control"
                    placeholder="description..."
                    name="description"
                    cols="160"
                    rows="5"
                    value={description}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollView;
