import { DeleteForever, Remove } from "@material-ui/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createLedger, getUsertype, updateLedger } from "../../features/account/accountSlice";
import httpService from "../../lib/httpService";

import '../antdstyle.css';

const ModelGeneralLedger = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();

  const {accounts, userType} = useSelector(state => state.account);
  // const accountLength = accounts.length + 11111;

  const [ledgerDate, setLedgerDate] = useState(moment().format("YYYY-MM-DD"));
  const [ journalNo, setJournalNo ] = useState(`JL-${Math.ceil(Math.random()*100000)}`);
  const [ reference, setReference ] = useState(`RTX-${Math.ceil(Math.random()*100000)}`);
  const [ notes, setNotes ] = useState("");
  const [ journalType, setJournalType ] = useState("manual");
  const [ currency, setCurrency ] = useState("INR");
  const [ category, setCategory ] = useState("none");
  const [ uName, setUName ] = useState("");
  const transactionTemplate = {
    date : moment().format("YYYY-MM-DD"),
    description: "",
    // contact: "none",
    debits: 0,
    credits: 0
  };
  const [ transaction, setTransaction ] = useState([transactionTemplate]);

  const [ categoryList, setCategoryList ] = useState([]);

  useEffect(() => {
    dispatch(getUsertype());
  }, []);

  useEffect(() => {
    if(!categoryList.length){
      for(const key in userType){
        setCategoryList(prevState => [ ...prevState, key ]);   
      }
    }
  }, [userType]);

  

  const addTransField = () => {
    setTransaction([...transaction, transactionTemplate]);
  }

  const handleTransection = (e, index) => {
    const updatedTransaction = transaction.map((trx, i) => index == i ? Object.assign(trx, {[e.target.name]: e.target.value }) : trx);
    setTransaction(updatedTransaction);
  }

  const removetransactionField = (e, index) => {
    if(index !== 0){
      const updatedtransaction = transaction.filter((trx, i) => index !== i );
      setTransaction(updatedtransaction);
    }
  }

  let totalAmount = transaction?.reduce(function(previousValue, currentValue){
    return previousValue + Number(currentValue.debits);
  }, 0);

  let creditAmount = transaction?.reduce(function(previousValue, currentValue){
    return previousValue + Number(currentValue.credits);
  }, 0);

  let finalTotalAmount = transaction?.reduce((previousValue, currentValue) => {
    let amount = currentValue.credits ? (+previousValue) + (+currentValue.credits) : (+previousValue) - (+currentValue.debits);
    return amount;
  }, 0);



  let diffAmount = totalAmount - creditAmount

  // let diffAmount = x ? ( creditAmount ? creditAmount: x ) : Math.abs(x);

  const getCategoryData = (n) => {
    if(category == "customer"){
      return <option key={n?._id} value={n?.displayName}>{n?.displayName}</option>
    } else{
      return <option key={n?._id} value={n?.name}>{n?.name}</option>
    }
  }

  useEffect(() => {
    if(state?.edit){
      const { date, journalId, notes, referenceId, journalType, category, clientName, transaction } = state.ledgerData;
      setLedgerDate(date?.split("T")[0]);
      setJournalNo(journalId);
      setReference(referenceId);
      setNotes(notes);
      setJournalType(journalType);
      setCategory(category);
      setUName(clientName?.name);
      setTransaction([ ...transaction ]);
    } 
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(category == "none"){
      toast.error("Please Select Category");
      return
    }

    if(uName == "" || uName == "none"){
      toast.error("Please Select Name");
      return
    }

    // console.log({
    //   date: ledgerDate,
    //   journalId: journalNo,
    //   referenceId: reference,
    //   notes,
    //   journalType,
    //   currency,
    //   category,
    //   clientName: { 
    //     userId: "",
    //     name: uName 
    //   },
    //   transaction,
    //   total: finalTotalAmount
    // })
    let userId;
    if(category === "customer"){
      userId = userType[category].filter((a) => a.displayName === uName)
    } else {
      userId = userType[category].filter((a) => a.name === uName)
    }
    let ledgerDateSet = {
      date: new Date(ledgerDate).toISOString(),
      journalId: journalNo,
      referenceId: reference,
      notes,
      journalType,
      currency,
      category,
      clientName: { 
        userId: userId[0]._id,
        name: uName 
      },
      transaction,
      total: finalTotalAmount
    }

    if(category == "customer"){
      ledgerDateSet.customer = ledgerDateSet?.clientName?.userId;
    } else if(category == "employee"){
      ledgerDateSet.employee = ledgerDateSet?.clientName?.userId;
    } else if(category == "vendor"){
      ledgerDateSet.vendor = ledgerDateSet?.clientName?.userId;
    }
    console.log(ledgerDateSet);
    if(state?.edit){
      // await dispatch(updateLedger(state?.ledgerId, ledgerDateSet));
      const response = await httpService.put(`/generalledger/${state?.ledgerId}`, ledgerDateSet);
    } else{
      await dispatch(createLedger(ledgerDateSet));

    }
    history.goBack();
  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Add Ledger</title>
        <meta name="description" content="Add Ledger" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Add Ledger</h3>
            </div>
          </div>
        </div>
      
        <div className="row">
          <div className="col-sm-12">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Date <span className="text-danger">*</span></label>
                <input className="form-control" type="date" name="ledgerDate" value={ledgerDate} onChange={(e) => setLedgerDate(e.target.value)}  required/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Journal# <span className="text-danger">*</span></label>
                <input className="form-control" type="text"
                  value={journalNo} onChange={(e) => setJournalNo(e.target.value)}
                  required
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" placeholder="Max. 500 characters" cols="10" rows="3"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Reference#</label>
                <input className="form-control" type="text"
                  value={reference} onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Journal Type <span className="text-danger">*</span></label> <br />
                <select className="custom-select" name="journalType" value={journalType} onChange={(e) => setJournalType(e.target.value)}>
                  <option value="manual">manual</option>
                  <option value="cash" >cash</option>
                  <option value="fixed">fixed</option>
                  <option value="received">received</option>
                  <option value="payed">payed</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Currency</label> <br />
                <select className="custom-select" name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} disabled>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollars</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Category <span className="text-danger">*</span></label> <br />
                <select className="custom-select" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="none">none</option>
                  { categoryList.length && 
                    categoryList.map(k => <option key={k} value={k}>{k}</option>)
                  }
                </select>
              </div>
            </div>
            { category !== "none" && 

              <div className="col-md-6">
                <div className="form-group">
                  <label>Name <span className="text-danger">*</span></label> <br />
                  <select className="custom-select" name="uName" value={uName} onChange={(e) => setUName(e.target.value)}>
                    <option value="none">none</option>

                    { userType[category]?.map((n) => {
                        return getCategoryData(n)
                      })
                    }
                  </select>
                </div>
              </div>
            }
          </div>
          <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="table-responsive">
                  <table className="table table-hover table-white">
                    <thead>
                      <tr className="text-center">
                        <th>Index</th>
                        <th>Date</th>
                        <th>Particulars <span className="text-danger">*</span></th>
                        {/* <th>Account <span className="text-danger">*</span></th> */}
                        {/* <th>Contact</th> */}
                        <th>Debits <span className="text-danger">*</span></th>
                        <th>Credits <span className="text-danger">*</span></th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transaction.map((t, index) => (
                          <tr className="text-center" key={index}>
                            <td>#{index+1}</td>
                            <td>
                              <input className="form-control" type="date" name="date" value={t.date?.split("T")[0]} onChange={(e) => handleTransection(e, index)}  required/>
                            </td>
                            <td>
                              <textarea  className="form-control" cols={40} rows={1}
                                name='description' value={t.description} onChange={(e) => handleTransection(e, index)}
                                required
                              />
                            </td>
                            {/* <td>
                              <select className="custom-select" name="account" value={t.account} onChange={(e) => handleTransection(e, index)}>
                                <option value="cash" >cash</option>
                                <option value="fixed">fixed</option>
                                <option value="received">received</option>
                                <option value="payed">payed</option>
                              </select>
                            </td> */}
                            {/* <td>
                              <select className="custom-select" name='contact' value={t.contact} onChange={(e) => handleTransection(e, index)}>
                                <option value="none">none</option>
                                <option value="ravi">ravi</option>
                                <option value="rahul">rahul</option>
                              </select>
                            </td> */}
                            <td>
                              <input className="form-control" type="number" name='debits' value={t.debits} onChange={(e) => handleTransection(e, index)} required />
                            </td>
                            <td>
                              <input className="form-control" type="number" name='credits' value={t.credits} onChange={(e) => handleTransection(e, index)} required />
                            </td>
                            <td className='text-center'>
                              { index !== 0 && 
                                <DeleteForever onClick={(e) => removetransactionField(e, index)} />
                              }
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                    <tfoot>
                      <tr className="text-center">
                        <th>
                          
                        </th>
                        <th>
                          
                        </th>
                        <th>
                          Total
                        </th>
                        <th>
                          {totalAmount}
                        </th>
                        <th>
                          {creditAmount}
                        </th>
                        <th>
                          
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                  <div
                    className="btn btn-primary"
                  //  style={{ cursor: "pointer", width: "140px", border: "2px solid black", padding: "5px" }} 
                   onClick={addTransField}>+ Add Transaction</div>
                </div>
              </div>
          </div>
          <div className="submit-section">
          {/* <h6>Difference is {diffAmount}</h6> */}
          {/* <br /> */}
            <button
              className="btn btn-secondary mr-4"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              // disabled={diffAmount === 0 ? false : true}
            >
              Submit
            </button> 
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
  )
}

export default ModelGeneralLedger