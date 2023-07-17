import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const AddVendorComment = ({ fetchVendors, editVendorId, vendorDetails}) => {

  const userId = useSelector(state => state?.authentication?.value?.user?._id);

  const [ comment, setComment ] = useState("");

  const editVendor = async () => {
    let vendorData = {
      comments: [{
        comment,
        date: new Date().toISOString(),
        createdBy: userId,
      }, ...vendorDetails?.comments]
    }

    toast
      .promise(
        httpService.put(`/vendor/${editVendorId}`, {
          ...vendorData,
        }),
        {
          error: 'Failed to edit vendor',
          success: 'Vendor edited successfully',
          pending: 'Editing vendor',
        }
      )
      .then((res) => {fetchVendors(); console.log(res.data);});
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editVendor();
  }

  return (
      <div id="add_vendor_comment" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
          >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Comment</h5>
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
                <div className="form-group">
                  <label className="col-form-label">
                    Comment <span className="text-danger">*</span>
                  </label>
                  <textarea className="form-control" cols="10" rows="2"
                    placeholder='Please Add Comment'
                    name='comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  >
                  </textarea>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Add Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AddVendorComment