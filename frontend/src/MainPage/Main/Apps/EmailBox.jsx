import React, { useState } from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import httpService from '../../../lib/httpService'

const EmailBox = () => {
  const [subject, setSubject] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [body, setBody] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [fileName, setFileName] = useState('INV-0');
  // const [emailId, setemailId] = useState('');
  const [backTo, setbackTo] = useState(-3);

  const { state } = useLocation();
  const history = useHistory()

  useEffect((e) => {
    if (state) {
      setSubject(state.subject)
      setPdfUrl(state.pdf)
      setBody(state.body)
      setFileName(state.index)
      setSendTo(state?.emailId)
      setbackTo(state?.backTo)
    }
  }, []);

  const handleSubmit = async () => {
    toast.info('The mail is processing, Kindly wait for some time', {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    let emails = [];
    sendTo.split(' ').forEach((email) => {
      email !== '' ? emails.push(email.trim()) : {}
    });
    console.log(state, emails, "fileName", fileName, { body }, "subject", subject);
    // return;
    const response = await httpService.post(`/mail/${state?.type}`, {
      id: state?.id,
      to: emails,
      body,
      fileName,
      subject
    });
    if (response?.data?.error) {
      toast.error(response.data.error, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    } else if (!response) {
      toast.error('Some Error occured', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.success('Mail sent successfully', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // history.push('/app/dashboard');
      history.goBack(backTo);
    }

  }

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Email Box</title>
          <meta name="description" content="Email page" />
        </Helmet>
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Email Box</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/index">Apps</Link></li>
                  <li className="breadcrumb-item active">Email Box</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="text-danger">From</label>
                      <input
                        type="email"
                        disabled={true}
                        className="form-control"
                        value='testemail@agumentik.com'
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="text-danger">To <span className="text-secondary">(space separated)</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={sendTo}
                        onChange={e => setSendTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="text-danger">Subject</label>
                      <input
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="text-danger">Body</label>
                      <textarea 
                        type="text"
                        className="form-control"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                      />
                    </div>
                  </div>
                </div> */}

                {fileName &&

                  <div className="row">
                    <div className="col-sm-6">
                      <h3 className="text-primary">Attachment</h3>
                      <a target="_blank" href={`${pdfUrl}`}>{fileName}.pdf</a>
                    </div>
                  </div>
                }


                <div className="row mt-4">
                  <div className="col-sm-6">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmailBox;