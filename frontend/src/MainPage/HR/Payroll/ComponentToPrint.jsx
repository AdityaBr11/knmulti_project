import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { headerlogo } from '../../../Entryfile/imagepath';
import { allemployee } from '../../../lib/api';

export const ComponentToPrint = React.forwardRef(({ payrollData, number2words }, ref,) => {
  const [employees, setEmployees] = useState([]);
  const fetchemployeeslist = async () => {
    const res = await allemployee();
    console.log(res._id, payrollData.employeeId._id, 'props11');

    setEmployees(res);
  };
  console.log(employees, 'employeesemployees1');
  useEffect(() => {
    fetchemployeeslist();
  }, []);
  let onePayrollData;
  //filter payrolldata
  employees
    .filter((e) => {
      return e?._id === payrollData.employeeId._id;
    })
    .map((e) => {
      onePayrollData = e;
    });
  console.log(onePayrollData, "onePayrollData", 'employeesemployees');
  console.log(payrollData, 'props');

  return (
    <div className="row" ref={ref}>
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <h4 className="payslip-title">
              Payslip for the month of :{' '}
              {new Date(payrollData?.fromDate).toDateString().slice(4)}
            </h4>
            <div className="row">
              <div className="col-sm-6 m-b-20">
                <img src={headerlogo} className="inv-logo" alt="" />
                <ul className="list-unstyled mb-0">
                  <li>KN Multiprojects</li>
                  <li>Banglore,</li>
                  <li>India</li>
                </ul>
              </div>
              <div className="col-sm-6 m-b-20">
                <div className="invoice-details">
                  <h3 className="text-uppercase">Payslip #49029</h3>
                  <ul className="list-unstyled">
                    <li>
                      Salary Month:{' '}
                      <span>
                        {new Date(payrollData?.fromDate)
                          .toDateString()
                          .slice(4)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 m-b-20">
                <ul className="list-unstyled">
                  <li>
                    <h5 className="mb-0">
                      <strong>{payrollData?.employeeId?.name}</strong>
                    </h5>
                  </li>
                  <li>
                    <span>{payrollData?.employeeId?.jobRole?.name}</span>
                  </li>
                  <li>Employee ID: {payrollData?.employeeId?._id}</li>
                  <li>Joining Date: 1 Jan 2016</li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div>
                  <h4 className="m-b-10">
                    <strong>Earnings</strong>
                  </h4>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Basic Salary</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.earnedSalary?.eBasicSalary)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>House Rent Allowance (H.R.A.)</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.earnedSalary?.eHRA)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Conveyance</strong>{' '}
                          <span className="float-right">Rs.00</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Dearness Allowance</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.earnedSalary?.eDA)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total Earnings</strong>{' '}
                          <span className="float-right">
                            <strong>
                              Rs.{Math.round(payrollData?.earnedSalary?.totalEarned)}
                            </strong>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-6">
                <div>
                  <h4 className="m-b-10">
                    <strong>Deductions</strong>
                  </h4>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Tax Deducted at Source (T.D.S.)</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.deduction?.TDS)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Provident Fund Number</strong>{' '}
                          <span className="float-right">
                            {onePayrollData?.personalInformation?.pfno}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Provident Fund</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.deduction?.PF)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>ESI Number</strong>{' '}
                          <span className="float-right">
                            {onePayrollData?.personalInformation?.esino}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>ESI</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.deduction?.esiAmount)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Loan</strong>{' '}
                          <span className="float-right">
                            Rs.{Math.round(payrollData?.deduction?.advanceAmt)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total Deductions</strong>{' '}
                          <span className="float-right">
                            <strong>
                              Rs.{Math.round(payrollData?.deduction?.totalDeduction)}
                            </strong>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-12">
                <p>
                  <strong>
                    Net Salary: Rs.{Math.round(payrollData?.netSalary)}
                  </strong>{' '}
                  {/* ({number2words(Math.round(payrollData?.netSalary))}) */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
