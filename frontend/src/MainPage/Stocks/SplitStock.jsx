import { Add, DeleteOutline } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory } from 'react-router-dom'
import httpService from '../../lib/httpService';

const SplitStock = () => {

  const history = useHistory();

  const [ stocks, setstocks ] = useState([]);

  const [ stock, setstock ] = useState("");

  const [stockData, setstockData] = useState({
    _id : "",
    itemDetails: "",
    stockNo: "",
    quantity: 0,
    billStatus : "",
    leftQuantity: 0,
    vendorId : undefined
  });

  const handleStockData = () => {
    if(stocks.length && stock){
      const filteredStock = stocks.filter(s => s?._id == stock )[0];
      setstockData(filteredStock);
    }
  }

  const [stockUsed, setStockUsed] = useState(0);
  const [stockLeft, setStockLeft] = useState(0);
  const [ notes, setNotes ] = useState("");
  const [ splitStockdate, setsplitStockdate ] = useState("");

  const [projects, setprojects] = useState([])

  const projectStockTemplate = {
    projectId: "",
    usedQuantity: 0,
    referenceNo: "",
    purpose: ""
  };

  const [ projectStock, setprojectStock ] = useState([projectStockTemplate]);


  const handleProjectStock = (e, index) => {
    const updatedStock = projectStock.map((stk, i) => index == i ? Object.assign(stk, {[e.target.name]: e.target.value }) : stk);
    setprojectStock(updatedStock);
  }


  const removeProjectStockField = (e, index) => {
    if(index !== 0){
      const updatedprojectStock = projectStock.filter((ps, i) => index !== i );
      setprojectStock(updatedprojectStock);
    }
  }

  const addProjectStockField = (e, index) => {
    setprojectStock([ ...projectStock, projectStockTemplate ])
  }

  const handleStockUsed = () => {
    if(stock){
      let updatedStockUsed = projectStock.reduce((acc, curr) => {
        acc = acc + (+curr.usedQuantity);
        return acc;
      }, 0);

      setStockUsed(updatedStockUsed);
      setStockLeft(stockData?.leftQuantity - updatedStockUsed);
    }
  }

  const fetchProjects = async() => {
    const res = await httpService.get('/project');
    setprojects(res.data);
  }

  const fetchStocks = async () => {
    const res = await httpService.get("/stock");
    setstocks([ ...res.data ]);
  }

  useEffect(() => {
    fetchStocks();
    fetchProjects();
  }, []);

  useEffect(() => {
    handleStockUsed();
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    const splitStockData = {
      stockId : stock,
      vendorId : stockData?.vendorId?._id,
      splitStockdate,
      projectStock,
      stockUsed,
      notes
    }

    const splitStockArr = projectStock?.filter(p => p.projectId !== "").map(ps => {
      let upps = {
        projectId: ps.projectId,
        usedQuantity: ps.usedQuantity,
        LeftQuantity: ps.usedQuantity,
        referenceNo: ps.referenceNo,
        purpose: ps.purpose,
        stockId : stock,
        vendorId : stockData?.vendorId?._id,
        splitStockdate,
        splitStockNo: `SPK-${Math.ceil(Math.random()*100000)}`,
        stockUsed
      }
      return upps;
    })


    httpService.post("/stock/splitStock", splitStockArr)
    .then(res => history.push(`/app/stock/allotstock`));

  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Split Stock</title>
        <meta name="description" content="Split Stock" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Split Stock</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}> 
              <div className="row">
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Stock <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={stock}
                      onChange={(e) => setstock(e.target.value)} 
                      onBlur={handleStockData}
                      >
                      <option selected>Please Select</option>
                      {stocks?.map((stock) => (
                        <option key={stock?._id} value={stock?._id}>
                          {stock?.itemDetails}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Date <span className="text-danger">*</span>
                    </label>
                    <input type="date" 
                    name="splitStockdate" 
                    value={splitStockdate}
                    onChange={(e) => setsplitStockdate(e.target.value)}
                    className='form-control' required/>
                  </div>
                </div>
                { stock && 
                
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group">
                      <label>
                        Vendor Name
                      </label>
                      <input type="text" 
                      name="vendorId?.name" 
                      value={stockData.vendorId?.name || ""}
                      className='form-control' disabled/>
                    </div>
                  </div>
                }
              </div>
              { stock && 
                <div className="row">
                  <div className="col-sm-3 col-md-3">
                    <div className="form-group">
                      <label>
                        Stock No
                      </label>
                      <input type="text" 
                      name="stockNo" 
                      value={stockData.stockNo}
                      className='form-control' disabled/>
                    </div>
                  </div>
                  <div className="col-sm-3 col-md-3">
                    <div className="form-group">
                      <label>
                        Total Quantity
                      </label>
                      <input type="text" 
                      name="quantity" 
                      value={stockData.quantity}
                      className='form-control' disabled/>
                    </div>
                  </div>
                  <div className="col-sm-3 col-md-3">
                    <div className="form-group">
                      <label>
                        Left Quantity
                      </label>
                      <input type="text" 
                      name="quantity" 
                      value={stockData.leftQuantity}
                      className='form-control' disabled/>
                    </div>
                  </div>
                  <div className="col-sm-3 col-md-3">
                    <div className="form-group">
                      <label>
                        Bill Status
                      </label>
                      <input type="text" 
                      name="quantity" 
                      value={stockData.billStatus}
                      className='form-control' disabled/>
                    </div>
                  </div>
                </div>
              }
              <hr />
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className='text-center'>
                          <th>Sr No.</th>
                          <th style={{ minWidth: '150px' }}>Project Name</th>
                          <th style={{ minWidth: '50px' }}>Quantity</th>
                          <th style={{ minWidth: '150px' }}>Reference No</th>
                          <th style={{ width: '250px' }}>Purpose</th>
                          <th style={{ width: '50px' }}>DELETE</th>
                        </tr>
                      </thead>
                      <tbody>
                        { projectStock.map((ps, index) => (
                          <tr key={index}>
                            <td>{index+1}</td>
                            <td>
                              <select
                                className="custom-select"
                                name="projectId"
                                value={ps?.projectId}
                                onChange={(e) => handleProjectStock(e, index)}
                                required
                                >
                                <option selected>Please Select</option>
                                {projects?.map((p) => (
                                  <option key={p?._id} value={p?._id}>
                                    {p?.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input 
                                className="form-control"
                                type="number"
                                style={{ minWidth: '150px' }}
                                name='usedQuantity'
                                value={ps.usedQuantity}
                                onChange={(e) => handleProjectStock(e, index)}
                                required
                              />
                            </td>
                            <td>
                              <input 
                                className="form-control"
                                type="text"
                                style={{ minWidth: '150px' }}
                                name='referenceNo'
                                value={ps.referenceNo}
                                onChange={(e) => handleProjectStock(e, index)}
                              />
                            </td>
                            <td>
                              <input 
                                className="form-control"
                                type="text"
                                style={{ minWidth: '150px' }}
                                name='purpose'
                                value={ps.purpose}
                                onChange={(e) => handleProjectStock(e, index)}
                              />
                            </td>
                            <td className='text-center'>
                              { index !== 0 && 
                                <DeleteOutline onClick={(e) => removeProjectStockField(e, index)} />
                              }
                            </td>
                          </tr> 
                        )) }
                      </tbody>
                    </table>
                  </div>
                  <div className="ml-3 btn btn-primary" onClick={addProjectStockField}><Add /> Add another</div>
                </div>
              </div>
              <div className="row d-flex justify-content-end m-2">
                <div className='border border-warning text-right p-3'>
                  <div>Stock Used : {stockUsed}</div>
                  <div>Stock Left: {stockLeft}</div>
                </div>
              </div>
              <br />
              <div className="row d-flex justify-content-start">
                <div className='ml-5'>
                  <label htmlFor="">Notes</label>
                  <textarea name="notes" id="" cols="140" rows="4" className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            <br />
              <div className='row'>
                <button className="btn btn-primary mr-2" type="submit" disabled={(stockLeft < 0) || (stockUsed == 0)}>
                  Save
                </button>
                <div className="btn btn-outline-secondary">
                  <Link to={`/app/stock/allotstock`}>Cancel</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitStock