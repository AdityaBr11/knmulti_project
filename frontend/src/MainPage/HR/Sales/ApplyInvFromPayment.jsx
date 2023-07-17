import React from 'react'

const ApplyInvFromPayment = () => {
  return (
    <div
      className="modal custom-modal fade tab"
      id="apply_invoice"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg mw-100 w-75">
        <div className="modal-content">
          <div className="modal-body">
            <div className="form-header">
              <h3>Apply Payment from</h3>
            </div>
            <div className="col-md-12 col-sm-12">
              <div className="table-responsive">
                <table className="table table-hover table-white">
                  <thead>
                    <tr className="text-center">
                      <th>Invoice Number</th>
                      <th>Invoice Date</th>
                      <th>Invoice Amount</th>
                      <th>Invoice Balance</th>
                      <th>Amount To Pay</th>
                    </tr>
                  </thead>
                  <tbody> 
                    {
                      invoices?.map((p, index) => 
                        (
                          <tr className="text-center" 
                          key={index}
                          >
                            <td>
                              {p?.invoice}
                            </td>
                            <td>
                              {p?.invoiceDate.split('T')[0]}
                            </td>
                            <td>
                              {p?.grandTotal}
                            </td>
                            <td>
                              {p?.grandTotal - p?.paidAmount - p?.withholdingTax - p?.credits}
                            </td>
                            <td>
                              <input className="form-control" type="number"
                              onChange={(e) => handleAmountAddition(e, index)}
                              />
                            </td>
                          </tr>
                        )
                      )
                    }
                  </tbody>
                </table>
              </div>
              <div className="table-responsive">
                <table className="table table-hover table-white">
                  <tbody>
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td className="text-right">Amount To Credit</td>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          width: '230px',
                        }}
                      >
                        {creditAmount}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="text-right">
                        Remaining Credits
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          width: '230px',
                        }}
                      >
                        {creditData?.grandTotal - creditData?.creditUsed - creditAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-btn delete-action">
              <div className="row">
                <div className="col-6">
                  <a onClick={(e) => {
                    e.preventDefault();
                    handleSubmit()
                  }}
                  href="" className="btn btn-primary continue-btn">
                    Save
                  </a>
                </div>
                <div className="col-6">
                  <a
                    href=""
                    data-dismiss="modal"
                    className="btn btn-primary cancel-btn"
                  >
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyInvFromPayment