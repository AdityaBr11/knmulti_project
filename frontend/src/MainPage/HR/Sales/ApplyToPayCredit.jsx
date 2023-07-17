import { Table } from 'antd';
import moment from 'moment/moment';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';
import { itemRender, onShowSizeChange } from '../../paginationfunction';

const ApplyToPayCredit = () => {

  const history = useHistory();
  const [amount, setAmount] = useState('');
  const { customerPayCreditInfo, invID, invNo, invBalDue, invData } = useLocation()?.state;

  const [ customerPayCreditData, setCustomerPayCreditData ] = useState([]);

  const [amountToPayCredit, setAmountToPayCredit] = useState(0);

  const [allCredit, setAllCredit] = useState([]);


  const handleCreditPay = (e, rId, bal, cred, payNo, pAmt) => {
    const isTrue = allCredit.filter(p => p.id == rId);


    let vl = Number(e.target.value) ? Number(e.target.value) : 0;
    console.log({vl})
    setAmount(vl);

    if (isTrue.length != 0) {
      let updatedCreditPay = allCredit.map((c) => {
        if (c.id == rId) {
          c.paymentAmount = vl;
          c.excessAmount = bal-vl;
          c.amountReceived = cred;
          c.paymentNumber = payNo;
          c.pAmt = pAmt;
          return c;
        } else {
          return c;
        }
      });
      console.log({updatedCreditPay});
      setAllCredit([...updatedCreditPay]);
    } else {
      let cbal = bal-vl
      console.log({cbal, bal});
      setAllCredit([ ...allCredit, { id: rId, paymentAmount : vl, excessAmount : cbal, amountReceived : cred, paymentNumber : payNo, pAmt } ]);
    }
  };

  const handleAmountToCredit = () => {
    if (allCredit.length != 0) {
      let creditTotal = allCredit.reduce((acc, curr) => {
        return (+acc) + +curr.paymentAmount;
      }, 0);
      setAmountToPayCredit(creditTotal);
    }
  };

  useEffect(() => {
    handleAmountToCredit();
  });

  

  useEffect(() => {
    setCustomerPayCreditData([ ...customerPayCreditInfo ]);
  }, []);
  console.log(allCredit,customerPayCreditInfo,"allCredit");

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'paymentDate',
      align: 'center',
      render: (paymentDate) => <span>{paymentDate?.split('T')[0]}</span>,
    },
    {
      title: 'PAYMENT NUMBER',
      dataIndex: 'paymentNumber',
      align: 'center',
      render: (text, record) => (
        <span>
          <Link to={`/app/sales/payment-view/${record._id}`}>{text}</Link>
        </span>
      ),
    },
    {
      title: 'ADVANCE AMOUNT',
      dataIndex: 'amountReceived',
      align: 'center',
    },
    {
      title: 'AMOUNT AVAILABLE',
      dataIndex: 'excessAmount',
      align: 'center',
    },
    {
      title: 'AMOUNT TO CREDIT',
      dataIndex: 'excessAmount',
      align: 'center',
      render: (text, record) => <span><input
       value={amount} 
       className="form-control" type="number"
      onChange={(e) => {
        handleCreditPay(e, record?._id, record?.excessAmount, record?.amountReceived, record?.paymentNumber, record?.paymentAmount)
        // setAmount({
        //   ...amount,
        //   amount: e.target.value,
        // })
      } 
    }
    
      min={0} max={text} /></span>
    },
    {
      title: 'Check',
      dataIndex: 'excessAmount',
      align: 'center',
      render: (text, record) => <span><input type="checkbox" name="" className="form-control"
      onChange={(e) => handleClick(e, record?._id, record?.excessAmount, record?.amountReceived, record?.paymentNumber, record?.paymentAmount)}
      min={0} max={text} /></span>
    },
  ];
  const handleClick = () => {
    setAmount(customerPayCreditInfo[0].excessAmount)
    setAmountToPayCredit(customerPayCreditInfo[0].excessAmount);
    console.log("response",customerPayCreditInfo[0].excessAmount);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const creditListOld = allCredit.filter((c) => c.creditPay != 0);

    const creditList = creditListOld.map((c) => {
      console.log(c.Amt);
      c.paymentAmount = +c.paymentAmount + +c.pAmt;
      console.log({c})
      return c;
    });
    const inv = {
      id: invID,
      invoiceNumber: invNo,
      // invoiceDate: moment().format("YYYY-MM-DD"),
      invoiceAmount: invData?.grandTotal,
      invBalDue : invBalDue - amountToPayCredit,
      paidAmount: amountToPayCredit,
    }

    // console.log({ creditList, inv });
    // return;

    // const response = await httpService.put(`/sale-payment/paycredit`, { creditList, inv });

    await toast.promise(
      httpService.put(`/sale-payment/paycredit`, { creditList, inv }),
      {
        pending: 'Applying the Advance Payment',
        success: 'Payment added successfully',
        error: "Couldn't apply the Payment, recheck the details entered",
      }
    ).then((response) => {
      // console.log(response?.data);
      history.goBack();
    })

  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Apply Advance Payment</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">
                Apply Advance Payment from {invNo}
              </h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <h3 className="page-title">
                {' '}
                <span className="text-muted">Invoice Balance :-</span> ₹
                {invBalDue}
              </h3>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* <div className="row">
          <div className="text-right">
            {invBalDue}
          </div>
        </div> */}
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table
                      className="table-striped"
                      pagination={{
                        total: customerPayCreditData?.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: 'auto' }}
                      columns={columns}
                      // bordered
                      dataSource={customerPayCreditData}
                      rowKey={(record) => record._id}
                    />
                    
                    
                  </div>
                </div>
              </div>

              <div className="row d-flex justify-content-end m-3">
                <div className="text-right p-3 pl-5 border border-warning d-flex flex-column">
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Amount to Credit: 
                    ₹{amountToPayCredit}
                  </div>{' '}
                  <br />
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Invoice Balance Due:{' '}
                    ₹{invBalDue - amountToPayCredit}
                  </div>{' '}
                  <br />
                </div>
              </div>
              <br />
              <div className="row">
                <button
                  className="btn btn-primary mr-2"
                  type="submit"
                  disabled={ amountToPayCredit <= 0 }
                >
                  Save
                </button>
                <div
                  className="btn btn-outline-secondary"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyToPayCredit