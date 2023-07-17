import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { useDispatch, useSelector } from 'react-redux';
import { createNotify } from '../../features/notify/notifySlice';
import * as moment from 'moment'

const LandsaleEdit = ({fetchVendors}) => {
  
  const landDetailsObj = {
    landpataOwnerMobile: "",
    landpataOwnerName: "",
    landOwnerName : "",
    payDate: "",
    registrationDate: "",
    totalAmount : 0,
    advanceAmount: 0,
    balanceAmount : 0,
    modeOfPay: "",
    receivedBy : "",
    khataNo: 0,
    plotNo: 0,
    chakaNo: 0,
    area: 0,
    typeOfDoc: "",
    documentNo: "",
    purchaserName: "",
    mouza: "",
    typesofkisam : "",
    dateOfMutation: "",
    dateOfConversion: "",
    typeOfLand: "",
    remarks: ""
  }

  const [ landDetails, setLandDetails ] = useState(landDetailsObj);

  const [ projectList, setProjectList ] = useState([]);
  const [ projectId, setProjectId ] = useState("");

  const handleLandDetails = (e) => {
    setLandDetails({ ...landDetails, [e.target.name]: e.target.value });

  }
  console.log(landDetails)

  const fetchProjectList = async () => {
    const { data } = await httpService.get(`/project?saleStatus=${"Not Live"}`);
    setProjectList(data);
  };

  useEffect(() => {
    fetchProjectList();
  }, []);


  useEffect(() => {
    const bal = landDetails?.totalAmount - landDetails?.advanceAmount;
    setLandDetails({ ...landDetails, balanceAmount : bal });
    console.log(bal);
  }, [landDetails?.totalAmount, landDetails?.advanceAmount]);
  
  const transactionTemplate = {
    itemDetails: landDetails.plotNo,transactionTemplate,
    // account: landDetails.balanceAmount,
    quantity: 1,
    unit: "pcs.",
    rate: landDetails.balanceAmount,
    discount: {discountType: "percent", discountValue: 0},
    amount: landDetails.balanceAmount
  };
  const [ adjustment, setAdjustment ] = useState({
    adjustmentName: "Adjustment",
    adjustmentValue: 0
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(projectId == ""){
      toast.warning("Please Select Project");
    }
    const postData = { ...landDetails, vendorId : state?._id, projectId }
    // console.log({ postData });
    // return;
    
    toast
      .promise(
        httpService.put(`/landsale/${state?._id}`, postData),
        {
          error: 'Failed to create Land Purchase',
          success: 'Created Land Purchase successfully',
          pending: 'updating Land Purchase...',
        }
      ).then((res) => {
        // fetchVendors();
        document.querySelectorAll('.close')?.forEach((e) => e.click());
        history.push({
          pathname: `/app/profile/landsale/${state?._id}`,                    
        })
      })
    }


  const dispatch = useDispatch();

  const [assignType, setAssignType] = useState('');
  const user = useSelector(state => state.authentication.value.user);
  const { state } = useLocation()

  const history = useHistory();
  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    if (state?.edit) {
      const {
        landpataOwnerMobile,
        landpataOwnerName,
        projectId,
        advanceAmount,
        landOwnerName,
        payDate,
        registrationDate,
        totalAmount,
        area,
        balanceAmount,
        dateOfConversion,
        chakaNo,
        dateOfMutation,
        documentNo,
        khataNo,
        mouza,
        plotNo,
        purchaserName,
        typeOfDoc,
        typeOfLand,
        typesofkisam
      } = state;
      setLandDetails({
        landpataOwnerMobile,
        landpataOwnerName,
        projectId,
        advanceAmount,
        landOwnerName,
        payDate,
        registrationDate,
        totalAmount,
        area,
        balanceAmount,
        dateOfConversion,
        chakaNo,
        dateOfMutation,
        documentNo,
        khataNo,
        mouza,
        plotNo,
        purchaserName,
        typeOfDoc,
        typeOfLand,
        typesofkisam
      });
      setProjectId(projectId)
//       const yourDate = new Date()
// const NewDate = moment(landDetails.dateOfConversion, 'DD-MM-YYYY')
// console.log(NewDate,"dateOfConversion",landDetails.dateOfConversion,"landDetails",landDetails)
    }
  }, []);
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Add Leads</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            {/* <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            > */}

<div
          
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Land Details</h5>
              
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name of Land Owner <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className   ="form-control"
                        name='landOwnerName'
                        value={landDetails?.landOwnerName}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Date of Payment <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name='payDate'
                        value={landDetails?.payDate}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Date of Registration <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        name='registrationDate'
                        value={landDetails?.registrationDate}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Total Amount <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name='totalAmount'
                        value={landDetails?.totalAmount}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Advance amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name='advanceAmount'
                        value={landDetails?.advanceAmount}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Balance Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name='balanceAmount'
                        value={landDetails?.balanceAmount}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Mode of Payment</label>
                      <input
                        type="text"
                        className="form-control"
                        name='modeOfPay'
                        value={landDetails?.modeOfPay}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Received By</label>
                      <input
                        type="text"
                        className="form-control"
                        name='receivedBy'
                        value={landDetails?.receivedBy}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Khata No</label>
                      <input
                        type="number"
                        className="form-control"
                        name='khataNo'
                        value={landDetails?.khataNo}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Plot No <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name='plotNo'
                        value={landDetails?.plotNo}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Chaka No</label>
                      <input
                        type="number"
                        className="form-control"
                        name='chakaNo'
                        value={landDetails?.chakaNo}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Area <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name='area'
                        value={landDetails?.area}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Type of Kisam</label>
                      <input
                        type="text"
                        className="form-control"
                        name='typesofkisam'
                        value={landDetails?.typesofkisam}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Type of document</label>
                      <input
                        type="text"
                        className="form-control"
                        name='typeOfDoc'
                        value={landDetails?.typeOfDoc}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Document No</label>
                      <input
                        type="text"
                        className="form-control"
                        name='documentNo'
                        value={landDetails?.documentNo}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name of purchaser <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name='purchaserName'
                        value={landDetails?.purchaserName}
                        onChange={handleLandDetails}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Mouza</label>
                      <input
                        type="text"
                        className="form-control"
                        name='mouza'
                        value={landDetails?.mouza}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>patta Owner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name='landpataOwnerName'
                        value={landDetails?.landpataOwnerName}
                        onChange={handleLandDetails}
                        
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>patta Owner Mobile</label>
                      <input
                        type="tel"
                        maxLength={10}
                        minLength={10}
                        className="form-control"
                        name='landpataOwnerMobile'
                        value={landDetails?.landpataOwnerMobile}
                        onChange={handleLandDetails}
                        
                      />
                    </div>
                  </div>
                  {/* {landDetails?.dateOfMutation} */}
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Date of Mutation</label>
                      <input
                        type="date"
                        className="form-control"
                        name='dateOfMutation'
                        value={landDetails?.dateOfMutation}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Date of Conversion</label>
                      <input
                        type="date"
                        className="form-control"
                        name='dateOfConversion'
                        value={landDetails?.dateOfConversion}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Type Of Land</label>
                      <input
                        type="text"
                        className="form-control"
                        name='typeOfLand'
                        value={landDetails?.typeOfLand}
                        onChange={handleLandDetails}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Project Name <span className="text-danger">*</span>
                      </label>
                      <select className="custom-select" name="project" 
                        value={projectId._id}
                        onChange={(e) => {setProjectId(e.target.value)}}
                        required
                      >
                        <option value="">Please Select</option>
                        { projectList?.length && projectList?.map((p) => (
                          <option value={p?._id}>{p?.name}</option>
                        )) }
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                  <div className="form-group">
                    <div>
                      <label htmlFor="">Remarks</label>
                      <textarea name="remark" id="" cols="100" rows="5" className="form-control"
                         onChange={handleLandDetails}
                      ></textarea>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
        
              
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default LandsaleEdit;
