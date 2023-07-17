import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { Helmet } from 'react-helmet';
import { Table } from 'antd';
import { itemRender, onShowSizeChange } from '../paginationfunction';

const VendorCreditToBill = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [vendorBillsData, setVendorBillsData] = useState([]);

  const [amountToCredit, setAmountToCredit] = useState(0);

  const [allCredit, setAllCredit] = useState([]);


  const handleCreditPay = (e, rId, bal, cred, billNo) => {
    const isTrue = allCredit.filter(p => p.id == rId);


    let vl = e.target.value ? e.target.value : 0;

    if (isTrue.length != 0) {
      let updatedCreditPay = allCredit.map((c) => {
        if (c.id == rId) {
          c.creditPay = vl;
          c.balance = bal-vl;
          c.cred = cred;
          c.billNo = billNo;
          return c;
        } else {
          return c;
        }
      });

      setAllCredit([...updatedCreditPay]);
    } else {
      let cbal = bal-vl
      setAllCredit([ ...allCredit, { id: rId, creditPay : vl, balance : cbal, cred : cred, billNo : billNo } ]);
    }
  };

  const handleAmountToCredit = () => {
    if (allCredit.length != 0) {
      let creditTotal = allCredit.reduce((acc, curr) => {
        return acc + +curr.creditPay;
      }, 0);
      setAmountToCredit(creditTotal);
    }
  };

  useEffect(() => {
    handleAmountToCredit();
  });

  console.log(allCredit);

  useEffect(() => {
    toast
      .promise(
        httpService.get(
          `/vendortrx/getvendorbills?vendorId=${state?.vendorId}`
        ),
        {
          error: 'Failed to fetch vendor bills',
          success: 'Bills fetch successfully',
          pending: 'fetching vendor bill...',
        }
      )
      .then((res) => {
        const dataSet = res.data.filter((b) => b.balanceDue > 0);
        setVendorBillsData(dataSet);
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'billDate',
      align: 'center',
      render: (billDate) => <span>{billDate?.split('T')[0]}</span>,
    },
    {
      title: 'BILL#',
      dataIndex: 'billNo',
      align: 'center',
      render: (text, record) => (
        <span>
          <Link to={`/app/purchase/billinfo/${record._id}`}>{text}</Link>
        </span>
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: 'BALANCE DUE',
      dataIndex: 'balanceDue',
      align: 'center',
    },
    {
      title: 'Amount to credit',
      dataIndex: 'balanceDue',
      align: 'center',
      render: (text, record) => <span><input type="number" name="" className="form-control"
      onChange={(e) => handleCreditPay(e, record?._id, record?.balanceDue, record?.credit, record?.billNo)}
      min={0} max={text} /></span>
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const creditListOld = allCredit.filter((c) => c.creditPay != 0);
    const creditList = creditListOld.map((c) => {
      c.creditPay = +c.creditPay + +c.cred;
      return c;
    });
    console.log(creditList);
    let remBal = state?.creditData?.balance - amountToCredit;
    let newStatus = remBal == 0 ? "CLOSED"  : "PARTIAL";
    toast
      .promise(
        httpService.put(
          `/vendortrx/updatevendorcredit/${state?.creditData?._id}`,
          { creditUsed: amountToCredit, balance: remBal, status: newStatus }
        ),
        {
          error: 'Failed to update vendor credit',
          success: 'vendor credit updated successfully',
          pending: 'Updating vendor vendor credit...',
        }
      )
      .then((res) => {
        console.log(res.data);
        return httpService.put(`/vendortrx/updatevendorcredittobills/${state?.creditData?._id}`, creditList);
      })
      .then((res) => console.log(res.data));
  };

  console.log(vendorBillsData);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>All Vendors Bills</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">
                Apply Credits from {state?.creditData?.creditOrder}
              </h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <h3 className="page-title">
                {' '}
                <span className="text-muted">Balance :-</span> ₹
                {state?.creditData?.balance}
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table
                      className="table-striped"
                      pagination={{
                        total: vendorBillsData?.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: 'auto' }}
                      columns={columns}
                      // bordered
                      dataSource={vendorBillsData}
                      rowKey={(record) => record._id}
                    />
                  </div>
                </div>
              </div>
              <div className="row d-flex justify-content-end m-3">
                <div className="text-right p-3 pl-5 border border-warning d-flex flex-column">
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Amount to credit: {amountToCredit}
                  </div>{' '}
                  <br />
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Remaining credits:{' '}
                    {state?.creditData?.balance - amountToCredit}
                  </div>{' '}
                  <br />
                </div>
              </div>
              <br />
              <div className="row">
                <button
                  className="btn btn-primary mr-2"
                  type="submit"
                  disabled={
                    amountToCredit <= 0 ||
                    amountToCredit > state?.creditData?.balance
                  }
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
  );
};

export default VendorCreditToBill;
