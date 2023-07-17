import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import {
  allemployee,
  fetchAttendance,
  fetchLeaves,
  getEmployee,
} from '../../../lib/api';
import { dateDiff, filterAttendance, filterAttendance1 } from '../../../misc/helpers';
import httpService from '../../../lib/httpService';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';


const PayrollForm = () => {

  const { state } = useLocation();
  //present day
  const [employee, setEmployee] = useState();//for active _id
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredByNameEmployee, setFilteredByNameEmployee] = useState(null);
  const [filterQueries2, setFilterQueries2] = useState({
    // date: { value: 1 },
    month: { value: new Date().getMonth() },
    year: { value: new Date().getFullYear() },
  });
  const [totalLeaves, setTotalLeaves] = useState([]);
  const [TOTAL_LEAVES, setTOTAL_LEAVES] = useState();

  useEffect(async () => {
    const res = await allemployee();
    setEmployeeList(res);
  }, []);

  // console.log(employeeList,'employeelits');

  const nowDate = new Date();
  const firstDayPrevMonth =
    new Date(nowDate.getFullYear(), nowDate.getMonth())
      .toISOString()
      .slice(0, 8) + '01';
  const lastDayPrevMonth = new Date(nowDate.getFullYear(), nowDate.getMonth())
    .toISOString()
    .slice(0, 10);

  //get sundays dates
  function sundaysInMonth(m, y) {
    let days = new Date(y, m, 0).getDate();
    let sundays = [8 - new Date(m + '/01/' + y).getDay()];
    for (var i = sundays[0] + 7; i < days; i += 7) {
      sundays.push(i);
    }
    return sundays;
  }
  let sun = sundaysInMonth(
    filterQueries2?.month?.value + 1,
    filterQueries2?.year?.value
  );
  console.log(sun, 'sundaysInMonth');
  //end

  //Leaves
  const [leavesData, setLeavesData] = useState([]);
  const [plannedLeaves, setPlannedLeaves] = useState([]);
  // console.log(leavesData, 'leavesData');
  // console.log(plannedLeaves, 'plannedLeaves');

  const loadFn = async () => {
    const res = await fetchLeaves();

    console.log(res, 'r45es fetchleaves...');
    setLeavesData(
      res?.map((leave, index) => {
        return {
          _id: leave?._id,
          id: index + 1,
          employee: leave?.employee,
          leaveType: leave?.leaveType?.leaveTypeName,
          fromDate: new Date(leave?.fromDate).toLocaleDateString(),
          toDate: new Date(leave?.toDate).toLocaleDateString(),
          noofdays: dateDiff(
            new Date(leave?.fromDate),
            new Date(leave?.toDate)
          ),
          reason: leave?.reason,
          status: leave?.status,
        };
      })
    );
    console.log(leavesData, 'res fetchleaves...');
    setPlannedLeaves(
      res
        ?.filter((leave) => {
          return (
            new Date(firstDayPrevMonth).getMonth() >=
            new Date(leave?.fromDate).getMonth() &&
            new Date(lastDayPrevMonth).getMonth() <=
            new Date(leave?.toDate).getMonth()
          );
        })
        .map((e) => {
          return {
            ...plannedLeaves,
            noOfdays: dateDiff(new Date(e?.fromDate), new Date(e?.toDate)),
            name: e?.employee?.name,
            id: e?.employee?._id,
          };
        })
    );
    console.log(plannedLeaves, 'res fetchleaves...4');

  };

  useEffect(() => {
    loadFn();
  }, []);
  //Leaves end


  //present day

  const history = useHistory();
  const [employees, setEmployees] = useState([]);
  const [fromDate, setfromDate] = useState(firstDayPrevMonth);
  const [toDate, settoDate] = useState(lastDayPrevMonth);
  const [netSalary, setnetSalary] = useState(0);
  const [description, setdescription] = useState('');
  const [salaryRate, setsalaryRate] = useState({
    basicSalary: 0,
    DA: 0,
    HRA: 0,
    totalSalary: 0,
  });

  const handleSalaryRate = () => {
    if (salaryRate?.basicSalary) {

      let x = salaryRate?.basicSalary;
      let da = (x * 10) / 100;
      // let hra = (+x + +da) * 0.3 ;
      let hra = salaryRate?.HRA;
      // console.lo('hra____',hra,salaryRate?.HRA);
      let ts = +x + +da + +hra;
      // console.log({ x, da, hra, ts });
      setsalaryRate({ ...salaryRate, DA: da, HRA: hra, totalSalary: ts });
    }
  };
  const handleHra = () => {
    console.log(salaryRate?.basicSalary, "salaryRate?.basicSalary");
    if (salaryRate?.basicSalary) {
      let x = salaryRate?.basicSalary;
      // let da = (x * 10) / 100;
      let da = salaryRate?.DA;
      let hra = (salaryRate?.HRA);
      let ts = +x + +da + +hra;
      // console.log({ x, da, hra, ts });
      setsalaryRate({ ...salaryRate, DA: da, HRA: hra, totalSalary: ts });
    }
  };
  console.log(fromDate, 'fromDate');

  const [presentatten, setPresentatten] = useState();

  // console.log(filteredByNameEmployee, 'filteredByNameEmployee85858', presentatten);


  const [attendance, setattendance] = useState({
    present: 0,
    paidLeave: 0,
    weeklyOff: 0,
    festival: 0,
    paidDays: 0,
  });
  // console.log(filteredByNameEmployee, 'fABNE1');
  let presentDays = (e) => {
    console.log(attendance, 'attendance144');
    if (!state?.edit) {
      console.log(attendance, 'attendance14445');
      // setsalaryRate({
      //   ...salaryRate, basicSalary: employeeList.filter((e) => {
      //     return e?._id == employee
      //   }).map((e) => { return e?.salary })?.[0]
      // });

      const paidLeaves = plannedLeaves.filter((e) => {
        return e?.id == employee
      }).map((e) => { return e?.noOfdays });
      // console.log(employee, 'paidLeaves')
      setattendance({
        ...attendance,
        present: filteredByNameEmployee,
        weeklyOff: sun?.length,
        paidLeave: paidLeaves?.[0] || 0,
      });
      // console.log(filteredByNameEmployee, sun?.length, paidLeaves, 'paidLeaves?.[0]')
    }

  };

  console.log(attendance, 'attendance1attendance');
  console.log(salaryRate,'salaryRate');

  const handleattendance = (e) => {
    setattendance({ ...attendance, [e.target.name]: e.target.value });
  };

  const handlePaidDays = () => {
    console.log(attendance, 'attendance', attendance?.weeklyOff, parseInt(attendance?.present), attendance?.festival, 'attendance?.present')
    let x =
      +attendance?.present +
      +attendance?.paidLeave +
      +attendance?.weeklyOff || 0 +
      +attendance?.festival || 0;
    setattendance({ ...attendance, paidDays: x });
    console.log(x, 'xxx')
  };


  const [earnedSalary, setearnedSalary] = useState({
    eBasicSalary: 0,
    eDA: 0,
    eHRA: 0,
    incentive: 0,
    totalEarned: 0,
  });

  const handleearnedSalary = (e) => {
    setearnedSalary({ ...earnedSalary, [e.target.name]: e.target.value });
  };

  const handleearnedSalaryCal = () => {
    console.log(attendance?.paidDays, "handleearnedSalaryCal", salaryRate?.basicSalary, salaryrateedit);
    if (salaryrateedit && attendance?.paidDays) {
      let x = (salaryRate?.basicSalary * +attendance?.paidDays) / 30;
      let da = (x * 10) / 100;

      let hra = (+x + +da) * 0.3;
      let hraatt = (hra * +attendance?.paidDays) / 30;
      console.log("shandleearnedSalaryCal11", salaryRate?.basicSalary, da, hra, x);
      let ts = +x + +da + +hraatt + +earnedSalary?.incentive;
      // console.log({ x, da, hraatt, hra });
      setearnedSalary({
        ...earnedSalary,
        eBasicSalary: x,
        eDA: da,
        eHRA: hraatt,
        totalEarned: ts,
      });
    }
  };
  const handle_HRAcal = () => {
    console.log("handle_HRAcal", salaryRate?.basicSalary);
    if (salaryRate?.basicSalary && attendance?.paidDays) {
      let x = (salaryRate?.basicSalary * +attendance?.paidDays) / 30;
      // let da = (x * 10) / 100;
      let da = (salaryRate?.DA);

      // let hra =  (+x + +da) * 0.3;
      let hra1 = (salaryRate?.HRA * +attendance?.paidDays) / 30;
      let hra = (hra1);
      console.log("handle_HRAcal4", salaryRate?.basicSalary, da, hra, x);
      let ts = +x + +da + +hra + +earnedSalary?.incentive;
      // console.log({ x, da, hra, ts });
      setearnedSalary({
        ...earnedSalary,
        eBasicSalary: x,
        eDA: da,
        eHRA: hra,
        totalEarned: ts,
      });
    }
  };

  const [deduction, setdeduction] = useState({
    esiAmount: 0,
    PF: 0,
    advanceAmt: 0,
    TDS: 0,
    LWF: 0,
    professionalTax: 0,
    totalDeduction: 0,
  });

  const handlededuction = (e) => {
    setdeduction({ ...deduction, [e.target.name]: e.target.value });
  };

  const handleDeductionCal = () => {
    console.log("testing deduction", deduction?.esiAmount);
    if (salaryRate?.basicSalary && attendance?.paidDays) {
      let x = (+earnedSalary?.eBasicSalary + +earnedSalary?.eDA) * 0.12;
      let y = +x + +deduction?.advanceAmt + +deduction?.TDS - +deduction?.esiAmount;
      setdeduction({ ...deduction, PF: x, totalDeduction: y });
    }
  };

  const handleNetSalary = () => {
    const x = +earnedSalary?.totalEarned - deduction?.totalDeduction;
    setnetSalary(x);
  };

  const fetchemployeeslist = async () => {
    const res = await allemployee();
    setEmployees(res);
  };

  useEffect(() => {
    fetchemployeeslist();
  }, []);

  // useEffect(() => {
  //   if(state?.edit){
  //     const { employeeId, fromDate, toDate, netSalary, attendance } = state?.record;
  //     setEmployee(employeeId?._id);
  //     setfromDate(fromDate?.split("T")[0]);
  //     settoDate(toDate?.split("T")[0]);
  //     setnetSalary(netSalary);
  //     setattendance(attendance);
  //   }

  // }, []);
  // console.log(salaryRate?.basicSalary, 'testing11111')

  useEffect(() => {
    handleHra()
  }, [salaryRate?.HRA, salaryRate?.DA]);
  useEffect(() => {
    handleSalaryRate()
  }, [salaryRate?.basicSalary]);
  // console.log(attendance?.paidDays, salaryRate?.basicSalary, 'testing11111')
  useEffect(() => {
    handleearnedSalaryCal();
  }, [attendance?.paidDays, salaryRate?.basicSalary, salaryRate?.HRA]);
  useEffect(() => {
    handle_HRAcal();
  }, [attendance?.paidDays, salaryRate?.HRA, salaryRate?.HRA, salaryRate?.DA]);


  useEffect(() => {
    console.log("deduction?.esiAmount", deduction?.esiAmount);
    handleDeductionCal();
  }, [earnedSalary, deduction?.advanceAmt, deduction?.TDS, deduction?.esiAmount]);

  useEffect(() => {
    handleNetSalary();
  }, [earnedSalary?.totalEarned, deduction?.totalDeduction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      fromDate == undefined ||
      fromDate == ''
    ) {
      toast.error('Please select a From Date');
      return;
    }
    if (
      toDate == undefined ||
      toDate == ''
    ) {
      toast.error('Please select a To Date');
      return;
    }
    if (
      salaryRate?.basicSalary == undefined ||
      salaryRate?.basicSalary == ''
    ) {
      toast.error('Please select a Basic Salary ');
      return;
    }
    if (
      attendance?.present == undefined ||
      attendance?.present == ''
    ) {
      toast.error('Please select a Present Days');
      return;
    }
    if (
      employee == undefined ||
      employee == ''
    ) {
      toast.error('Please select a Employee Name ');
      return;
    }

    const empSalary = {
      employeeId: employee,
      fromDate,
      toDate,
      netSalary,
      description,
      salaryRate,
      attendance,
      earnedSalary,
      deduction,
      connfirm: 0
    };
    // console.log(empSalary);
    // return ;
    if (state?.edit) {
      httpService.put(`/payroll/${state?.payId}`, empSalary).then((res) => {
        history.goBack();

      });
      return;
    }

    httpService.post(`/payroll`, empSalary).then((res) => {
      // emailjs
      // .sendForm(
      //   'service_xcxiogi',
      //   'template_ws756yb',
      //   e.target,
      //   'hf0po8venBjKL4wIi'
      // )
      // .then((res) => {
      //   toast.success('Email Sent!');
      //   console.log(res, 'res frm emaijs');
      // })
      // .catch((err) => {
      //   toast.error('Email failed!');
      //   console.log(err, 'err frm emaijs');
      // });
      history.goBack();
    });
  };
  //present day
  const [salaryrateedit, Setsalaryrateedit] = useState();
  const onFilterClick = async (e) => {
    // console.log(e, 'e frm func');
    // const emp =
    //   employeeList.filter((emp) =>
    //     emp?._id.includes(e)
    //   ) || null;
    if (e != undefined) {
      const res = await fetchAttendance(e);
      const resEmployeeById = await getEmployee(e);
      setTOTAL_LEAVES(resEmployeeById?.totalLeaves);
      const res22 = await fetchAttendance();
      const employee_id = e;
      const paidLeaves = plannedLeaves.filter((e1) => {
        return e1?.id == employee_id
      }).map((e1) => { return e1?.noOfdays });
      console.log(paidLeaves, 'paidLeaves1')
      Setsalaryrateedit(resEmployeeById?.SALARYCOMPONENTS?.montlyctc);
      setsalaryRate({
        ...salaryRate,
        HRA: resEmployeeById?.SALARYCOMPONENTS?.M_HRA,
        basicSalary: resEmployeeById?.SALARYCOMPONENTS?.montlyctc
      });
      console.log(resEmployeeById?.SALARYCOMPONENTS?.M_HRA, 'res22...22');
      console.log(resEmployeeById, 'res from attAdmin res');
      const attendance = filterAttendance1(res, fromDate, toDate);
      console.log(resEmployeeById, 'attendance', attendance);

      // setattendance({
      //   ...attendance,
      //   present: attendance
      // })
      setFilteredByNameEmployee(filterAttendance1(res, fromDate, toDate));
      const res2 = await fetchLeaves(e);
      setTotalLeaves(res2);
    }
  };
  useEffect(() => {
    onFilterClick(employee);
  }, [employee]);

  useEffect(() => {
    handlePaidDays();
    // handleSalaryRate();
  }, [attendance?.present])
  // console.log(employeesDetails, 'employeeemployee');
  useEffect(() => {
    presentDays();
  }, [filteredByNameEmployee]);

  useEffect(() => {
    if (state?.edit) {
      const { employeeId, fromDate, toDate, salaryRate, earnedSalary, attendance, deduction, description } = state?.record;
      setEmployee(employeeId?._id);
      setfromDate(fromDate?.split("T")[0]);
      settoDate(toDate?.split("T")[0]);
      setsalaryRate({ ...salaryRate });
      setattendance(
        { ...attendance }
      );
      setearnedSalary({ ...earnedSalary });
      setdeduction({ ...deduction });
      setdescription(description);
      // setnetSalary(netSalary); 
    }

  }, []);



  //present day

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Add Payroll</title>
        <meta name="description" content="Add Payroll" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Add Payroll</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Employee Name <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={employee}
                      onChange={(e) => {
                        setEmployee(e.target.value);
                      }}
                      required
                    >
                      <option value={''} selected>
                        Please Select
                      </option>
                      {employees.map((emp) => (
                        <option key={emp?._id} value={emp?._id}>
                          {emp?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>
                      From <span className="text-danger">*</span>
                    </label>
                    <div>

                      <DatePicker
                        id='dob'
                        poppername="startDate"
                        className="form-control"
                        // style={{ border: 'none', backgroundColor: 'red' }}

                        placeholder="mm-dd-yyyy"
                        name="fromDate"
                        value={new Date(fromDate || '05/01/2023')}
                        onChange={(e) => setfromDate(e)}
                      />
                      {/* <input
                        className="form-control"
                        type="date"
                        placeholder="mm-dd-yyyy"
                        name="fromDate"
                        value={fromDate}
                        onChange={(e) => setfromDate(e.target.value)}
                        required
                      /> */}
                    </div>
                  </div>

                  {filteredByNameEmployee === 'monthisnotsame' && <span className="text-danger">From month and year must be Same</span>}
                </div>

                <div className="col-sm-3">
                  <div className="form-group">
                    <label>
                      To <span className="text-danger">*</span>
                    </label>
                    <div>
                      <DatePicker
                        id='dob'
                        poppername="startDate"
                        className="form-control"
                        // style={{ border: 'none', backgroundColor: 'red' }}

                        placeholder="mm-dd-yyyy"
                        name="fromDate"
                        value={new Date(toDate || '05/01/2023')}
                        onChange={(e) => settoDate(e)}
                      />
                      {/* <input
                        className="form-control"
                        type="date"
                        placeholder="mm-dd-yyyy"
                        name="toDate"
                        value={toDate}
                        onChange={(e) => settoDate(e.target.value)}
                        required
                      /> */}
                    </div>
                  </div>

                  {filteredByNameEmployee === 'monthisnotsame' && <span className="text-danger">From month and year must be Same</span>}
                </div>

              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      Basic Salary <span className="text-danger">*</span>
                    </label>
                    <input
                      // disabled
                      className="form-control"
                      type="number"
                      name="basicSalary"
                      value={salaryRate?.basicSalary}
                      onChange={(e) => {
                        setsalaryRate({
                          ...salaryRate,
                          basicSalary: e.target.value,
                        });
                        // handleSalaryRate()
                      }
                      }
                      // onBlur={handleSalaryRate}
                      required
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
                      name="DA"
                      onChange={(e) => {
                        setsalaryRate({
                          ...salaryRate,
                          DA: e.target.value,
                        });
                        // handleSalaryRate()
                      }
                      }

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
                      // readOnly
                      disabled
                      name="HRA"
                      value={salaryRate?.HRA}
                      onChange={(e) => {
                        setsalaryRate({
                          ...salaryRate,
                          HRA: e.target.value,
                        });
                        // handleSalaryRate()
                      }
                      }
                      // handleSalaryRate()


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
                          // disabled
                          type="number"
                          className="form-control"
                          name="present"
                          value={attendance?.present}
                          onChange={handleattendance}
                          onBlur={handlePaidDays}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Paid Leave</label>
                        <div>
                          <input
                            className="form-control"
                            type="number"
                            name="paidLeave"
                            value={attendance?.paidLeave}
                            onChange={handleattendance}
                            onBlur={handlePaidDays}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Weekly OFF</label>
                        <div>
                          <input
                            className="form-control"
                            type="number"
                            name="weeklyOff"
                            value={attendance?.weeklyOff}
                            onChange={handleattendance}
                            onBlur={handlePaidDays}
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
                          type="number"
                          className="form-control"
                          name="festival"
                          value={attendance?.festival}
                          onChange={handleattendance}
                          onBlur={handlePaidDays}
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
                            onChange={handleattendance}
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
                          value={Math.round(earnedSalary?.eBasicSalary)}
                          onChange={handleearnedSalary}
                          onBlur={handleearnedSalaryCal}
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
                          onChange={handleearnedSalary}
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
                          onChange={handleearnedSalary}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Incentive</label>
                        <input
                          className="form-control"
                          type="number"
                          name="incentive"
                          value={earnedSalary?.incentive}
                          onChange={handleearnedSalary}
                          onBlur={handleearnedSalaryCal}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Gross </label>
                        <input
                          className="form-control"
                          type="number"
                          name="incentive"
                          value={earnedSalary?.incentive}
                          onChange={handleearnedSalary}
                          onBlur={handleearnedSalaryCal}
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
                          value={Math.round(earnedSalary?.totalEarned)}
                          onChange={handleearnedSalary}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deduction  */}
                <div className="tab-pane fade show" id="emp_deduction">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          ESI Amount <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="esiAmount"
                          value={Math.round(deduction?.esiAmount)}
                          onChange={handlededuction}
                          onBlur={handleDeductionCal}
                        />

                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          PF Amount <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="PF"
                          value={Math.round(deduction?.PF)}
                          onChange={handlededuction}
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
                          className="form-control"
                          type="number"
                          name="advanceAmt"
                          value={deduction?.advanceAmt}
                          onChange={handlededuction}
                          onBlur={handleDeductionCal}
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>TDS</label>
                        <input
                          className="form-control"
                          type="number"
                          name="TDS"
                          value={deduction?.TDS}
                          onChange={handlededuction}
                          onBlur={handleDeductionCal}
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
                          value={Math.round(deduction?.totalDeduction)}
                          onChange={handlededuction}
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
                    value={Math.round(earnedSalary?.totalEarned)}
                    onChange={handleearnedSalary}
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
                    value={Math.round(deduction?.totalDeduction)}
                    onChange={handlededuction}
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
                    value={Math.round(netSalary)}
                    readOnly
                  />
                </div>
              </div>

              <div className="row my-2">
                <div className="col-md-12">
                  <textarea
                    className="form-control"
                    placeholder="description..."
                    name="description"
                    cols="160"
                    rows="5"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn" >Confirm Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollForm;
