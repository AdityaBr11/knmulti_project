import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { headerlogo } from '../Entryfile/imagepath.jsx';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthticationStore } from '../features/authentication/authenticationSlice.js';
import {
  addAttendance,
  editAttendance,
  fetchAttendance,
  Login,
} from '../lib/api/index.js';
import { checkIsEmployeePresent } from '../misc/helpers.js';

const Loginpage = () => {
  const [username, setUsername] = React.useState('');
  const [isLoding, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem('auth')) {
      history.push('/app/dashboard');
    }
    setIsLoading(false);
  }, []);

  const handleLoginWithEmailAndPassword = async () => {
    const res = await Login(username, password);
    const { _id } = res.user;
    console.log(res);
    if (res.error) {
      toast.error(res.message);
    } else {
      localStorage.setItem('auth', JSON.stringify(res));

      const res2 = await fetchAttendance(_id);
      console.log(res2);
      const dailyLoginData = checkIsEmployeePresent(_id, new Date(), res2);
      console.log(`dailyLoginData`, dailyLoginData);
      let response;
      if (!dailyLoginData) {
        const postData = {
          employee: _id,
          date: new Date(),
          hours: 0,
          description: 'First login of the day',
          sessions: [{ sessionId: 1, from: new Date(), upto: '' }],
        };
        console.log(postData);
        response = await addAttendance(postData);
        console.log('First login of the day - ', response);
      } else {
        const nextId = dailyLoginData?.sessions.length + 1;
        console.log(nextId);
        response = await editAttendance(dailyLoginData?._id, {
          date:dailyLoginData?.date, 
          employee:dailyLoginData?.employee,
          hours:dailyLoginData?.hours,
          sessions: [ 
            ...dailyLoginData?.sessions,
            { sessionId: nextId, from: new Date(), upto: '' }, // used to update login time
          ],
        });
        console.log('Just another login of the day - ', response);
        console.log('else run', dailyLoginData);
      }
      fetchAttendance(_id).then((res) => {
        console.log('logging...', checkIsEmployeePresent(_id, new Date(), res));
      });
      localStorage.setItem('lastLoginAt', JSON.stringify(new Date()));
      dispatch(setAuthticationStore(res));
      history.push('/app/dashboard');
    }
  };
  return isLoding ? (
    <></>
  ) : (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="account-content">
        <Link to="/applyjob/joblist" className="btn btn-primary apply-btn">
          Apply Job
        </Link>
        <div className="container">
          {/* Account Logo */}
          <div className="account-logo">
            <Link to="/app/main/dashboard">
              <img src={headerlogo} alt="Oboroi Real Estates" />
            </Link>
          </div>
          {/* /Account Logo */}
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Login</h3>
              <p className="account-subtitle">Access to dashboard</p>
              {/* Account Form */}
              <div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    className="form-control"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col">
                      <label>Password</label>
                    </div>
                    <div className="col-auto">
                      <Link className="text-muted" to="/forgotpassword">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group text-center">
                  <button
                    className="btn btn-primary account-btn"
                    onClick={handleLoginWithEmailAndPassword}
                  >
                    Login
                  </button>
                </div>
              </div>
              {/* /Account Form */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginpage;
