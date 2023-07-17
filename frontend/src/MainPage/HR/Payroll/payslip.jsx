import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { headerlogo } from '../../../Entryfile/imagepath';

const Payslip = ({ payrollData, setPayslipRender }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  console.log(payrollData, 'payrolldata frm slip');

  //number word
  var num = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
  var tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
  function number2words(n) {
    if (n < 20) return num[n];
    var digit = n % 10;
    if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000) return num[~~(n / 100)] + " hundred" + (n % 100 == 0 ? "" : " and " + number2words(n % 100));
    return number2words(~~(n / 1000)) + " thousand" + (n % 1000 != 0 ? " " + number2words(n % 1000) : "");
  }
  //number word
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Payslip </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Payslip</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item" onClick={(e) => { setPayslipRender('default') }}>Payroll View</li>
                <li className="breadcrumb-item active">Payslip</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <div className="btn-group btn-group-sm">
                {/* <button className="btn btn-white">CSV</button> */}
                <button className="btn btn-white" onClick={handlePrint}>PDF</button>
                <button className="btn btn-white" onClick={handlePrint}>
                  <i className="fa fa-print fa-lg" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Header */}
      </div>
      {/* /Page Content */}
      <ComponentToPrint ref={componentRef} payrollData={payrollData} number2words={number2words} />
    </div>
  );
};

export default Payslip;
