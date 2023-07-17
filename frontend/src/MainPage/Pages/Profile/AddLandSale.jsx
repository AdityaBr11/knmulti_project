import React, { useEffect, useState } from 'react'
import httpService from '../../../lib/httpService';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useDispatch } from 'react-redux';

const AddLandSale = ({ fetchVendors, editVendorId }) => {
  const dispatch = useDispatch();

  const landDetailsObj = {
    landpataOwnerMobile: "",
    landpataOwnerName: "",
    landOwnerName: "",
    payDate: "",
    registrationDate: "",
    totalAmount: 0,
    advanceAmount: 0,
    balanceAmount: 0,
    modeOfPay: "",
    receivedBy: "",
    khataNo: 0,
    plotNo: 0,
    chakaNo: 0,
    area: 0,
    typeOfDoc: "",
    documentNo: "",
    purchaserName: "",
    mouza: "",
    typesofkisam: "",
    dateOfMutation: "",
    dateOfConversion: "",
    typeOfLand: "",
    remarks: ""
  }

  const [landDetails, setLandDetails] = useState(landDetailsObj);

  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [doc, setDoc] = useState("");
  const [kissam, setKissam] = useState("");



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
    setLandDetails({ ...landDetails, balanceAmount: bal });
    console.log(bal);
  }, [landDetails?.totalAmount, landDetails?.advanceAmount]);

  const transactionTemplate = {
    itemDetails: landDetails.plotNo, transactionTemplate,
    // account: landDetails.balanceAmount,
    quantity: 1,
    unit: "pcs.",
    rate: landDetails.balanceAmount,
    discount: { discountType: "percent", discountValue: 0 },
    amount: landDetails.balanceAmount
  };
  const [adjustment, setAdjustment] = useState({
    adjustmentName: "Adjustment",
    adjustmentValue: 0
  });

  // console.log(moment().format("YYYY-MM-DD"),"moment().format");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (projectId == "") {
      toast.warning("Please Select Project");
    }
    const postData = { ...landDetails, vendorId: editVendorId, projectId, typeOfDoc: doc, typesofkisam: kissam }
    // console.log({ postData });
    // return;

    toast
      .promise(
        httpService.post(`/landsale`, postData),
        {
          error: 'Failed to create Land Purchase',
          success: 'Created Land Purchase successfully',
          pending: 'Creating Land Purchase...',
        }
      ).then((res) => {
        fetchVendors();
        document.querySelectorAll('.close')?.forEach((e) => e.click());
      })

    const purchaseOrderData = {
      vendorId: editVendorId,
      projectId,
      taxType: '',
      taxAmount: 0,
      taxSystem: "TCS",
      deliveryTo: "Organisation",
      purchaseOrderNo: `PO-${Math.ceil(Math.random() * 100000)}`,
      referenceId: `RTX-${Math.ceil(Math.random() * 100000)}`,
      purchareOrderDate: "2022-11-12",
      // expentedDeliveryDate,
      purchareOrderDate: moment().format("YYYY-MM-DD"),

      transaction: transactionTemplate,
      // paymentTerms,
      // shipmentPreference,
      discount: {
        discountType: "percent",
        discountValue: 0
      },
      discountType: "At Transactional Level",
      // transaction,
      subTotal: landDetails.balanceAmount,
      // discount,
      discountAccount: "",
      discountAmount: 0,
      adjustment,
      // tcsTax : tcsTax == "" ? undefined : tcsTax,
      // taxType,
      total: Number(landDetails.balanceAmount),
      // notes,
      // termsAndConditions,
      status: "ISSUED",
      billedStatus: ""
    }
    toast.promise(
      httpService.post(`/vendortrx/createpurchaseorder`, purchaseOrderData),
      {
        error: 'Failed to create purchase order',
        success: 'Purchase Order created successfully',
        pending: 'Building vendor Purchase Order...',
      }
    )
      .then((res) => {
        dispatch(createNotify({
          notifyHead: `Purchase Order ${res?.data?.purchaseOrderNo}`,
          notifyBody: `Purchase Order ${res?.data?.purchaseOrderNo} got created`,
          createdBy: empId
        }))
        history.goBack()
      });



  }

  return (
    <div id="add_landsale" className="modal custom-modal fade" role="dialog">

      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Land Details</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Name of Land Owner <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
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
                    <label>Total Amount11 <span className="text-danger">*</span></label>
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
                    {/* <input
                        type="text"
                        className="form-control"
                        name='typesofkisam'
                        value={landDetails?.typesofkisam}
                        onChange={handleLandDetails}
                      /> */}
                    <select className="custom-select" name="project"
                      onChange={(e) => { setKissam(e.target.value) }}
                    >
                      <option value="">select Kisam</option>
                      <option value="Abadi lands">Abadi lands</option>
                      <option value="Non irrigated">Non irrigated</option>
                      <option value="Water bodies">Water bodies</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Type of document</label>
                    <select className="custom-select" name="project"
                      onChange={(e) => { setDoc(e.target.value) }}

                    >
                      <option value="">Document No</option>
                      <option value="Purchase Agreement">Purchase Agreement</option>
                      <option value="Aadhar card">Aadhar card</option>
                      <option value="Pan card">Pan card</option>
                    </select>
                    {/* <input
                        type="text"
                        className="form-control"
                        name='typeOfDoc'
                        value={landDetails?.typeOfDoc}
                        onChange={handleLandDetails}
                      /> */}
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
                    <label>Patta Owner Name</label>
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
                    <label>Patta Owner Mobile</label>
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
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
                </div>
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
                      onChange={(e) => { setProjectId(e.target.value) }}
                      required
                    >
                      <option value="">Please Select</option>
                      {projectList?.length && projectList?.map((p) => (
                        <option value={p?._id}>{p?.name}</option>
                      ))}

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
  )
}

export default AddLandSale