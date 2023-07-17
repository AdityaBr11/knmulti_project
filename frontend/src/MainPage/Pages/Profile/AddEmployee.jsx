import { Add, Delete } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar_02 } from '../../../Entryfile/imagepath';
import { getEmployee, getRoles, updateEmployee } from '../../../lib/api';
import httpService from '../../../lib/httpService';
import { Blood, MARITAL_STATUS } from '../../../model/shared/maritalStates';
import FileUploadService from './FileUploadService';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import DatePicker from 'react-date-picker';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Form from 'react-bootstrap/Form';
import moment from 'moment'
const AddEmployee = () => {
  // const [doj, Setdoj] = useState(new Date('05/01/2023'));
  const [employeeType, setEmployeeType] = useState([]);
  const { id } = useParams();
  const history = useHistory();
  const [isChecked, setIsChecked] = useState(false);

  const [roles, setRoles] = useState([]);
  const [locs, setLocs] = useState([]);
  const [depts, setDepts] = useState([]);
  const [age11, setAge] = useState();
  const [UploadImageSet, setUploadImageSet] = useState();
  const [currentFile, setcurrentFile] = useState("");
  const [Expresume, setExpresume] = useState("");
  const [ctc, setCtc] = useState();
  // const [mctc, setmCtc] = useState();
  const [basicmctc, setBasicmCtc] = useState("");
  const [basicprce, setbasicprce] = useState(50);
  const [Houseprce, setHouseper] = useState(50);

  const [basicctc, setBasicCtc] = useState("");
  const [HouseCtc, setHouseCtc] = useState("");
  const [HousemCtc, setHousemCtc] = useState("");
  const [fixedCtc, setfixedCtc] = useState("");
  const [fixedMCtc, setfixedMCtc] = useState("");
  const [ConveyanceCTC, setConveyanceCtc] = useState(0);
  const [ConveyanceM, setConveyanceM] = useState("");

  const employeeTypeValue = (e) => {
    const obj = JSON.parse(e);
    setBasicInfo({
      ...basicInfo,
      employeeType: obj.employeeTypeName,
      totalLeaves: obj.noOfLeaves,
    });
  };


  // basic info

  const basicInfoObj = {
    firstName: '',
    middleName: '',
    blood: '',
    bankname: '',
    employmentType: '',
    lastName: '',
    email: '',
    // doj: '',
    // dob: '',
    gender: '',
    mobileNo: '',
    salary: '',
    jobRole: '',
    totalLeaves: '',
    employeeType: '',
    workLocation: '',
    department: '',
    password: '',
    cnfPassword: ''
  };

  const [basicInfo, setBasicInfo] = useState(basicInfoObj);
  const [doj, Setdoj] = useState('');
  const [dob, Setdob] = useState('');


  const handleBasicInfo = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };
  const handleBasicInfoJoinDate = (e) => {
    console.log(e, 'asasasa');
    setBasicInfo({ ...basicInfo, joinDate: convert(e) });
  };

  const fetchRoles = async () => {
    const roles = await httpService.get('/role');
    const locs = await httpService.get('/location');
    const depts = await httpService.get('/department');
    const employeeTypes001 = await httpService.get('/employee-type');
    setRoles(roles?.data);
    setLocs(locs?.data);
    setDepts(depts?.data);
    setEmployeeType(employeeTypes001?.data);
    console.log(roles, "rolesroles", employeeTypes001);
  };


  // other Details
  const otherDetailsObj = {
    passportNo: '',
    pfno: '',
    esino: '',
    passportExp: '',
    phoneNo: '',
    nationality: '',
    religion: '',
    maritalStatus: '',
    employmentOfSpouse: '',
    numberOfChildren: 0,
  };

  const [otherDetails, setOtherDetails] = useState(otherDetailsObj);

  const handleotherDetails = (e) => {
    setOtherDetails({ ...otherDetails, [e.target.name]: e.target.value });
  };

  // Bank details
  const bankDetailsObj = {
    bankdetails1: '',

    accountHoldersName: '',
    accountNumber: '',
    bankname: '',
    IFSC: '',
    upi: ''
  };

  const [bankDetails, setBankDetails] = useState(bankDetailsObj);

  // const handlebankDetails = (e) => {
  //   console.log('sas', e);
  //   setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  // };

  // Address
  const addressObj = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    localcontact: '',
    emergencyContact: '',
    Permanentcity: '',
    Permanentstate: '',
    PermanentpostalCode: '',
  };

  const [address, setaddress] = useState(addressObj);

  const handleaddress = (e) => {
    setaddress({ ...address, [e.target.name]: e.target.value });
  };
  const handle_Adress = (e) => {
    console.log(e.target.value, isChecked, 'isChecked');
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to ',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {

        //PREVIOUS CODE------------------------------------------------------------------
        // setIsChecked(!isChecked);
          // if (isChecked === false) {
          //   setaddress({
          //     ...address,
          //     addressLine2: address?.addressLine1,
          //     Permanentcity: address?.city,
          //     Permanentstate: address?.state,
          //     // localcontact:address?.localcontact,
          //     PermanentpostalCode: address?.postalCode,
          //     // emergencyContact :address?.emergencyContact

          //   });
          // } else {
          //   setaddress({
          //     ...address,
          //     addressLine2: '',
          //     Permanentcity: '',
          //     Permanentstate: '',
          //     // localcontact: ''

          //   });
          // }

          //---------------------------------------------------
          
          //NEW CODE -----------------------------------------
          if (address.addressLine1 !== address.addressLine2) {
            setaddress((prevAddress) => ({
              ...prevAddress,
              addressLine2: address.addressLine1,
              Permanentcity: address.city,
              Permanentstate: address.state,
              PermanentpostalCode: address.postalCode,
            }));
          } else {
            setaddress((prevAddress) => ({
              ...prevAddress,
              addressLine2: '',
              Permanentcity: '',
              Permanentstate: '',
              PermanentpostalCode: '',
            }));
          }
          setIsChecked(!isChecked);
        }
        //------------------------
    });
  }

  //salary



  //Bank
  const bankDetailsObj1 = {
    bankdetails1: '',
    accountHoldersName: '',
    accountNumber: '',
    bankname: '',
    IFSC: '',
    upi: '',
    branch: '',
  };
  const bankDetailsObj11 = {
    bankdetails1: '',
    accountHoldersName: '',
    accountNumber: '',
    bankname: '',
    IFSC: '',
    upi: '',
    branch: '',
  };
  const [expIndex, setExpIndex] = useState();
  const [contactIndex, setcontactIndex] = useState();
  const [contacteditIndex, setContacteditIndex] = useState();

  const [expeditIndex, setExpeditIndex] = useState();
  const [edueditIndex, setEdueditIndex] = useState();
  const [educationIndex, setEducationIndex] = useState();
  const [educationLenght, setEducationLenght] = useState();
  const [bankeditIndex, setbankeditIndex] = useState();
  const [lenghtbankDetail, setlenghtbankDetail] = useState();
  const [AddbankDetail, setAddbankDetail] = useState();
  const [bankDetail, setBankDetail] = useState([bankDetailsObj1]);
  const [bankDetailedit, setbankDetailedit] = useState([]);
  const [BankIndex, setBankIndex] = useState();

  const handleBankDetails = (e, index) => {
    console.log(e, index, 'ssssaaa');
    const updateBankD = bankDetail.map((bank1, i) => {
      if (index == i) {
        const uped = { ...bank1, [e.target.name]: e.target.value };
        return uped;
      } else {
        return bank1;
      }
    });

    setBankDetail([...updateBankD]);
  };

  const handleBankEdit = (e, index) => {
    console.log(e, index, 'ssssaaa');
    const updateBankD = bankDetail.map((bank1, i) => {
      if (index == i) {
        console.log(index, e.target.name, 'a', e.target.value, 'aditya')
        const uped = { ...bank1, [e.target.name]: e.target.value };
        console.log(uped, ' e.target.name');
        return uped;
      } else {
        return bank1;
      }
    });
    console.log(updateBankD, ' e.target.name');
    setbankDetailedit([...updateBankD]);
    setBankDetail([...updateBankD]);
    console.log(bankDetailedit, 'bankDetailedit');

  };

  const handleAnotherSetBank = () => {
    console.log('handleAnotherSetBank');
    setBankIndex(476);
    setAddbankDetail(bankDetail.length);
    setBankDetail([...bankDetail, bankDetailsObj1]);
  };

  const handleEDitSetBank = (bank, index) => {
    setBankIndex(474);
    setbankeditIndex(index);
    // setbankDetailedit([bank]);
  };
  const [Statutaryedit, setStatutaryedit] = useState([]);

  const handleStatutary = () => {
    setStatutaryedit(555);
  };

  const handleCancelStatutary = () => {
    setStatutaryedit(585);
  };



  const handleRemoveBank = (e, index) => {

    const upedu = bankDetail.filter((edu, i) => index != i);
    setBankDetail(upedu);
  };
  // education
  const eductionTemplate = {
    qualification: '',
    instution: '',
    startDate: '',
    endDate: '',
    university: '',
    specialization: '',
    score: 0,
    gradingSystem: '',
  };
  const [education, setEducation] = useState([eductionTemplate]);
  const handleEDitEducation = (bank, index) => {
    const updateedit = education.filter((edu, i) => {
      if (index == i) {
        const uped = { ...edu, ...bank };
        console.log('handle', edu);
        return uped;
      }
    });
    setEducationIndex(474);
    setEdueditIndex(index);
  };
  const handleEDitEXper = (index) => {

    setExpIndex(474);
    setExpeditIndex(index);
  };

  const handleEDitContact = (index) => {

    setcontactIndex(474);
    setContacteditIndex(index);
  };
  const handleCancelContact = (index) => {

    setcontactIndex(476);

  };


  const handleEducationDetails = (e, index) => {
    const updateEdu = education.map((edu, i) => {
      if (index == i) {
        const uped = { ...edu, [e.target.name]: e.target.value };
        return uped;
      } else {
        return edu;
      }
    });
    setEducation([...updateEdu]);
  };
  const handleEducationDetails1 = (e, index) => {
    const updateEdu = education.map((edu, i) => {
      if (index == i) {
        const uped = { ...edu, startDate: e };
        return uped;
      } else {
        return edu;
      }
    });
    setEducation([...updateEdu]);
  };

  const handleEducationDetailsendDate = (e, index) => {
    const updateEdu = education.map((edu, i) => {
      if (index == i) {
        const uped = { ...edu, endDate: e };
        return uped;
      } else {
        return edu;
      }
    });

    setEducation([...updateEdu]);
  };

  const [educationAdd, seteducationAdd] = useState();
  const handleAnotherSet = () => {

    seteducationAdd(education.length);
    setEducationIndex(476);
    setEducation([...education, eductionTemplate]);
  };

  // console.log(educationAdd, 'educationLenght')

  const handleRemoveQualification = (e, index) => {
    console.log(index, 'removeindec')
    // if (index == 0) {
    //   const upedu = education.filter((edu, i) => index != i);
    //   setEducation(upedu);
    // }
    const upedu = education.filter((edu, i) => index != i);
    setEducation(upedu);
  };
  // console.log(bankDetailedit, 'bankDetaileditbankDetailedit')
  // experience
  const experienceTemplate = {
    startDate: '',
    endDate: '',
    company: '',
    designation: '',
    responsibilities: '',
  };

  const [experience, setExperience] = useState([experienceTemplate]);

  useEffect(() => {
    // console.log('++++++++++++', experience.length);
    // calculateAge();
  }, [experience])
  const handleExpDetails = (e, index) => {
    const updateExp = experience.map((exp, i) => {
      if (index == i) {
        const upexp = { ...exp, [e.target.name]: e.target.value };
        return upexp;
      } else {
        return exp;
      }
    });
    setExperience([...updateExp]);
  };

  const handleExpStartDate = (e, index) => {
    const updateExp = experience.map((exp, i) => {
      if (index == i) {
        const upexp = { ...exp, startDate: e };
        return upexp;
      } else {
        return exp;
      }
    });
    setExperience([...updateExp]);
  };

  const handleExpEndDate = (e, index) => {
    const updateExp = experience.map((exp, i) => {
      if (index == i) {
        const upexp = { ...exp, endDate: e };
        return upexp;
      } else {
        return exp;
      }
    });
    setExperience([...updateExp]);
  };
  const [expnAdd, setExpAdd] = useState();

  const handleAnotherExp = () => {
    setExpIndex(476);
    setExpAdd(experience.length);
    setExperience([...experience, experienceTemplate]);
  };

  const handleRemove = (e, index) => {
    // if (index != 0) {
    //   const upepx = experience.filter((exp, i) => index != i);
    //   setExperience(upepx);
    // }
    const upepx = experience.filter((exp, i) => index != i);
    setExperience(upepx);
  };

  // certificate
  const certificateTemplate = {
    title: '',
    cerificateFile: '',
    remark: '',
  };

  const [certificate, setCertificate] = useState([certificateTemplate]);

  const addCertificateField = () => {
    setCertificate([...certificate, certificateTemplate]);
  };

  const removeCertificateField = (e, index) => {
    if (index !== 0) {
      const updatedCertificate = certificate.filter((cert, i) => index !== i);
      setCertificate(updatedCertificate);
    }
  };

  // contacts
  const personContactTemplate = {
    name: '',
    relationship: '',
    phone: '',
  };
  const [personContact, setPersonContact] = useState([personContactTemplate]);
  const [AddContactDetail, setAddContactDetail] = useState();

  const addPersonContactField = () => {
    setcontactIndex(475);
    setAddContactDetail(personContact.length)
    setPersonContact([...personContact, personContactTemplate]);
  };

  const removePersonContactField = (e, index) => {
    // if (index !== 0) {
    //   const updatedPersonContact = personContact.filter(
    //     (pct, i) => index !== i
    //   );
    //   setPersonContact(updatedPersonContact);
    // }
    const updatedPersonContact = personContact.filter(
      (pct, i) => index !== i
    );
    setPersonContact(updatedPersonContact);
  };

  const handlePersonContact = (e, index) => {
    const updatedPersonContact = personContact.map((pct, i) =>
      index == i ? Object.assign(pct, { [e.target.name]: e.target.value }) : pct
    );
    setPersonContact(updatedPersonContact);
  };

  const toInputUppercase = (e) => {
    e.target.value = ('' + e.target.value).toUpperCase();
  };

  const toCapitalize = (e) => {
    e.target.value =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  };
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  const calculateAge = function () {
    var today = new Date();
    // console.log(convert(dob), 'ssssssssssssjaj')
    // setAge(basicInfo?.dob?.split('T')[0]);
    const birthDate = convert(dob)?.split('-')[0];
    var age_now = today.getFullYear() - birthDate;
    setAge(age_now);

  }
  useEffect(() => {
    calculateAge();
  })
  const [total_months, settotal_months] = useState();
  const [total_ctc, settotal_ctc] = useState();

  useEffect(() => {
    const basicCtc_calu = (ctc * basicprce) / 100;
    const Housectccalcu = (basicCtc_calu * Houseprce) / 100;
    const basic = ctc / 2;
    const month = ctc / 12;
    const basicM = (month * basicprce) / 100;

    // console.log('basicMbasicM', month)
    setBasicmCtc(basicM);
    setBasicCtc(basicCtc_calu);
    setHouseCtc(Housectccalcu);
    const house_month_calculate = (basicmctc * Houseprce) / 100;
    setHousemCtc(house_month_calculate);
    let final11 = Math.round(basicctc) + Math.round(HouseCtc);
    let final = ctc - final11;
    const Conveyance_ctc = ConveyanceM * 12;
    const fixedctccalc = final - Conveyance_ctc;
    setfixedCtc(fixedctccalc);
    setConveyanceCtc(Conveyance_ctc);
    let final_month = Math.round(basicmctc) + Math.round(HousemCtc);
    let finalm = month - final_month;
    const Conveyance_m = ConveyanceM;
    const fixedM_calc = finalm - Conveyance_m;
    // setConveyanceM(Conveyance_m);
    setfixedMCtc(fixedM_calc);
    // console.log(final_month, fixedM_calc, finalm, 'final_month')

    settotal_months(Math.round(fixedMCtc) + Math.round(ConveyanceM) + Math.round(HousemCtc) + Math.round(basicmctc));
    settotal_ctc(fixedCtc + ConveyanceCTC + HouseCtc + basicctc)
  });
  useEffect(async () => {
    const fixedM_calc = fixedMCtc - ConveyanceM;
    // setConveyanceM(Conveyance_m);
    setfixedMCtc(fixedM_calc);
  }, [ConveyanceM]);

  useEffect(async () => {
    const res = await getEmployee(id);
    fetchRoles();

    setBasicInfo({
      employmentType: res?.employmentType,
      firstName: res?.firstName,
      blood: res?.blood,
      joinDate: res?.joinDate,
      // joinDate: moment(res?.joinDate.split('T')[0]).format("YYYY/MM/DD"),
      middleName: res?.middleName,
      lastName: res?.lastName,
      email: res?.email,
      // dob: new Date(moment(res?.dob.split('T')[0]).format("YYYY/MM/DD")),

      gender: res?.gender,
      mobileNo: res?.mobileNo,
      salary: res?.salary,
      userName: res?.userName,
      jobRole: res?.jobRole?._id,
      totalLeaves: res?.totalLeaves,
      employeeType: res?.employeeType,
      workLocation: res?.workLocation?._id,
      department: res?.department,
    });
    console.log("aaa--------------------------------", res)

    setIsChecked(res?.addressChecked || false);
    // console.log(date.setDate(date.getDate() + 1), 'aaaaaaasas');
    Setdob(new Date(res?.dob || '01/27/2023'))
    // Setdoj(new Date(moment(res?.joinDate.split('T')[0]).format("YYYY/MM/DD")))

    Setdoj(new Date(res?.joinDate))
    setCtc(res?.SALARYCOMPONENTS?.anualctc)
    // setmCtc(res?.SALARYCOMPONENTS?.montlyctc)
    setcurrentFile(res?.fileInfoPic)
    setExpresume(res?.resumeExp)
    setOtherDetails(res?.personalInformation);
    // setBankDetails(res?.bankDetails);
    setBankDetail(res?.bankDetails)

    setaddress(res?.address);
    // setEducation(res?.education);
    // setExperience(res?.previousExperience);

    setPersonContact(res?.emergencyContact);
    setConveyanceM(res?.SALARYCOMPONENTS?.ConveyancePrice || 0);
    setHouseper(res?.SALARYCOMPONENTS?.housepercent || 50);
    setbasicprce(res?.SALARYCOMPONENTS?.basicpercent || 50);
    console.log("aaa--------------------------------", res);

    const updateExp1 = res?.previousExperience.map((data, i) => {
      const upexp = {
        ...data,
        startDate: new Date(data?.startDate),
        endDate: new Date(data?.endDate),
        company: data?.company,
        designation: data?.designation,
        responsibilities: data?.responsibilities,
      };

      return upexp;
    })
    setExperience([...updateExp1]);
    const updateEduca = res?.education.map((data, i) => {
      const upedu = {
        ...data,
        startDate: new Date(data?.startDate),
        endDate: new Date(data?.endDate),
        qualification: data?.qualification,
        instution: data?.instution,
        // university: data?.university,
        // specialization: data?.specialization,
        // score: data?.score,
        // gradingSystem: data?.gradingSystem,
      };
      return upedu;

    })
    setEducation(updateEduca);

    setEducationLenght(education?.length);
    setlenghtbankDetail(bankDetail?.length);
  }, []);
  // console.log("--------------------------------", basicInfo)


  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {

        // console.log({ basicInfo });
        // console.log({ otherDetails });
        console.log('sssss', { basicInfo });
        // console.log({ address }, "address");
        // console.log({ education });
        // console.log({ experience });
        // console.log({ certificate });
        // console.log({ personContact });
        // return;
        if (basicInfo?.password !== basicInfo?.cnfPassword) {
          toast.error('Password and Confirm Password does not match');
          return;
        }

        if (!basicInfo?.firstName) {
          toast.error('Enter first Name');
          return;
        }
        if (!basicInfo?.lastName) {
          toast.error('Enter Last Name');
          return;
        }
        if (!basicInfo?.lastName) {
          toast.error('Enter lastName');
          return;
        }
        if (!basicInfo?.mobileNo) {
          toast.error('Enter mobileNo');
          return;
        }
        if (age11 <= 18) {
          toast.error('Age must be 18');
          return;
        }
        if (!basicInfo?.email) {
          toast.error('Enter email');
          return;
        }
        if (!basicInfo?.gender) {
          toast.error('Enter gender');
          return;
        }
        if (!basicInfo?.jobRole) {
          toast.error('Enter job Role');
          return;
        }
        if (!basicInfo?.mobileNo) {
          toast.error('Enter mobile Number');
          return;
        }
        if (basicInfo?.mobileNo.length >= 11) {
          toast.error('Mobile Number Must be 10');
          return;
        }
        if (!basicInfo?.workLocation || basicInfo?.workLocation === 'Please Select Location') {
          toast.error('Enter work Location');
          return;
        }
        if (!basicInfo?.employeeType) {
          toast.error('Enter employee Type');
          return;
        }
        const SALARYCOMPONENTS = {
          anualctc: ctc,
          basicpercent: basicprce,
          housepercent: Houseprce,
          ConveyancePrice: ConveyanceM,
          montlyctc: basicmctc,
          M_HRA: HousemCtc
        }
        // console.log({ bankDetail });
        // return;
        // const filedata = await FileUploadService.upload(currentFile);
        const ExperienceResume = await FileUploadService.upload(Expresume);
        console.log(currentFile, 'filedata');
        const employeeDetails = {
          ...basicInfo,
          SALARYCOMPONENTS: SALARYCOMPONENTS,
          resumeExp: ExperienceResume?.data,
          fileInfoPic: UploadImageSet?.data,
          personalInformation: otherDetails,
          // bankDetails,

          addressChecked: isChecked,
          bankDetails: bankDetail,
          dob: dob,
          // joinDate: doj,
          address,
          education,
          // previousExperience: experience,
          // emergencyContact: personContact,
        };
        console.log('employeeDetails', employeeDetails);

        toast
          .promise(
            updateEmployee(id, employeeDetails),
            // history.goBack();

            {
              error: 'Failed to Updating Empolyee Details',
              success: 'Empolyee Updated successfully',
              pending: 'updating Empolyee Details ...',
            }
          )
          .then((res) => {
            // dispatch(createNotify({
            //   notifyHead: `Purchase Order ${res?.data?.purchaseOrderNo}`,
            //   notifyBody: `Purchase Order ${res?.data?.purchaseOrderNo} got created`,
            //   createdBy: empId
            // }))
            history.goBack()
          });
        // updateEmployee(id, employeeDetails).then((res) => {
        //   history.goBack();
        // });


      }
    });
  };
  const handleSaveEXP = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const employeeDetails = {
          ...basicInfo,
          previousExperience: experience,
        }
        console.log('ideeeee', employeeDetails);
        updateEmployee(id, employeeDetails).then((res) => {
          console.log('save');
          setExpIndex(475);
          toast.success('Education Data is Save1')
          // history.goBack();
        });
      }
    });

  }
  const handleSaveContact = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const employeeDetails = {
          ...basicInfo,
          // education,
          emergencyContact: personContact,
        }
        console.log('ideeeee', employeeDetails);
        updateEmployee(id, employeeDetails).then((res) => {
          console.log('save');
          setcontactIndex(476);
          toast.success('Contact Data is Save')
          // history.goBack();
        });
      }
    });
  }
  const handleSaveEducation = () => {
    // console.log('save');
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const employeeDetails = {
          ...basicInfo,
          education,
        }
        console.log('ideeeee', employeeDetails);
        updateEmployee(id, employeeDetails).then((res) => {
          console.log('save');
          setEducationIndex(475);
          toast.success('Education Data is Save1')
          // history.goBack();
        });
      }
    });

  }

  const handleCancelEducation = () => {
    setEdueditIndex(475);

  }
  const handleCancelBank = () => {
    setBankIndex(475);

  }

  const handleCancelEXP = () => {
    setExpIndex(475);

  }
  // console.log('1111sasaAfter', bankeditIndex);
  const handleSaveBank = () => {
    // console.log('save');
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const employeeDetails = {
          ...basicInfo,
          bankDetails: bankDetail
        }
        console.log('ideeeee', employeeDetails);
        updateEmployee(id, employeeDetails).then((res) => {
          console.log('save');
          setBankIndex(475);
          toast.success('bank Data is Save1')
          // history.goBack();
        });
      }
    });

  }
  const handleSaveStatutary = (e) => {
    // console.log('save');
    // e.preventDefault();

    Swal.fire({
      title: 'Are you sure?',
      text: '  sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const employeeDetails = {
          ...basicInfo,
          personalInformation: otherDetails,
        }
        console.log('ideeeee', employeeDetails);
        updateEmployee(id, employeeDetails).then((res) => {
          console.log('save');
          setStatutaryedit(585);
          toast.success('Statutary Data is Save')
          // history.goBack();
        });
      }
    });

  }
  const UploadImage = async () => {
    console.log('Uploadingaa', currentFile.name);
    if (currentFile?.name) {
      const filedata = await FileUploadService.upload(currentFile);
      setUploadImageSet(filedata);
      toast.success('image uploaded successfully');
      console.log('Uploading', filedata);
    } else {
      setUploadImageSet(currentFile);
    }
  }

  // console.log(basicInfo?.employmentType, 'basicInfo?.employmentType')

  let stateArr = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Edit Employee</title>
        <meta name="description" content="Edit employee" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Edit Employee</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              {/* <div className="row">
                <div className="col-md-12">
                  <div className="profile-img-wrap edit-img">
                    <img
                      className="inline-block"
                      src={Avatar_02}
                      alt="user"
                    />
                    <div className="fileupload btn">
                      <span className="btn-text">edit</span>
                      <input className="upload" type="file" />
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      required
                      name="firstName"
                      type="text"
                      className="form-control"
                      value={basicInfo?.firstName}
                      onChange={handleBasicInfo}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Middle Name
                    </label>
                    <input

                      name="middleName"
                      type="text"
                      className="form-control"
                      value={basicInfo?.middleName}
                      onChange={handleBasicInfo}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      // required
                      name="lastName"
                      type="text"
                      className="form-control"
                      value={basicInfo?.lastName}
                      onChange={handleBasicInfo}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      value={basicInfo?.email}
                      onChange={handleBasicInfo}
                    />
                  </div>
                </div>

                {/* {basicInfo?.dob} */}

                <div className="col-md-3">
                  <div className="form-group">
                    <label>Date of Joining</label>
                    <div>

                      <DatePicker
                        className="form-control"
                        value={new Date(basicInfo.joinDate || '01/27/2023')}

                        // value={new Date(basicInfo?.joinDate)}
                        onChange={handleBasicInfoJoinDate}
                      // value={doj}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    {/* {basicInfo?.dob?.split('T')[0]} */}

                    <div>

                      <DatePicker
                        className="form-control"
                        // style={{ border: 'none', backgroundColor: 'red' }}
                        type="date"
                        style={{ backgroundColor: "red" }}
                        value={dob}
                        // value={basicInfo?.dob?.split('T')[0]}
                        onChange={Setdob}
                      />
                    </div>
                    {age11 <= 18 ? <span className="text-danger">Age Must be 18</span> : ''}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Age
                    </label>
                    <input
                      type="number"
                      // style={{ backgroundColor: "red" }}
                      className="form-control"
                      value={age11 || 0}
                      onChange={handleBasicInfo}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      name="gender"
                      value={basicInfo?.gender}
                      onChange={handleBasicInfo}
                    >
                      <option value="">Please Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Employee ID</label>

                    <input
                      type="number"
                      className="form-control"
                      value={id}
                      onChange={handleBasicInfo}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      name="mobileNo"
                      type="tel"
                      className="form-control"
                      value={basicInfo?.mobileNo}
                      onChange={handleBasicInfo}
                      // maxLength={10}
                      required
                      minLength={9}
                    />
                  </div>
                  {basicInfo?.mobileNo.length >= 11 ? <span className="text-danger">
                    Phone Number Must be 10
                    <br></br>
                  </span> : ''}
                  <br></br>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Job Role <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      name="jobRole"
                      value={basicInfo?.jobRole}
                      onChange={handleBasicInfo}
                    >
                      <option value="">Please Select job role</option>
                      {roles?.map((r, index) => (
                        <option key={index} value={r?._id}>
                          {r?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Employee Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      name="employeeType"
                      value={basicInfo?.employeeType}
                      onChange={handleBasicInfo}
                    >
                      <option value="">Employee Type</option>
                      {employeeType?.map((r, index) => (
                        <option key={index} value={r.employeeTypeName}>
                          {r.employeeTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Work Location <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      name="workLocation"
                      value={basicInfo?.workLocation}
                      onChange={handleBasicInfo}
                    >
                      <option value={'Please Select Location'}>Please Select Location</option>
                      {locs?.map((loc, index) => (
                        <option key={index} value={loc?._id}>
                          {loc?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      className="custom-select"
                      name="department"
                      value={basicInfo?.department}
                      onChange={handleBasicInfo}
                    >
                      <option>Please Select Department</option>
                      {depts?.map((dept, index) => (
                        <option key={index} value={dept?._id}>
                          {dept?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Religion</label>
                    <div>
                      <input
                        className="form-control"
                        type="text"
                        name="religion"
                        value={otherDetails?.religion}
                        onChange={handleotherDetails}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Marital Status
                    </label>
                    <select
                      className="custom-select"

                      name="maritalStatus"
                      value={otherDetails?.maritalStatus}
                      onChange={handleotherDetails}
                    >
                      <option>Select Status</option>
                      {MARITAL_STATUS.map((m, index) => (
                        <option key={index} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className="form-group" role="button">
                    <label>
                      Empolyment Type
                    </label>
                    <select
                      className="custom-select"
                      role="button"
                      // value={basicInfo?.department}
                      onChange={handleBasicInfo}
                      name="employmentType"
                      value={basicInfo?.employmentType}
                    // onChange={(e) => {
                    //   setEmployeeToAdd({
                    //     ...employeeToAdd,
                    //     employmentType: e.target.value,
                    //   });
                    // }}

                    >
                      <option>Please Select Empolyment Type</option>
                      <option >Full time</option>
                      <option >Permanent</option>
                      <option >Contractual</option>
                      <option >Part time</option>
                      <option >Work from home</option>
                      {/* {roles?.map((r, index) => (
                          <option key={index} value={r?._id}>
                            {r?.name}
                          </option>
                        ))} */}
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label>Blood Group</label>

                    <select
                      className="custom-select"
                      name="blood"
                      value={basicInfo?.blood}
                      // value={otherDetails?.maritalStatus}
                      onChange={handleBasicInfo}
                    >
                      <option>Select Status</option>
                      {Blood.map((m, index) => (
                        <option key={index} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>


                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Number of Kids</label>
                    <input
                      className="form-control"
                      type="number"
                      name="numberOfChildren"
                      value={otherDetails?.numberOfChildren}
                      onChange={handleotherDetails}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Employment of Spouse</label>
                    <input
                      className="form-control"
                      type="text"
                      name="employmentOfSpouse"
                      value={otherDetails?.employmentOfSpouse}
                      onChange={handleotherDetails}
                    />
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className="form-group">
                    <label>Upload your Pic</label>
                    <div className="custom-file">

                      <input
                        name="resumeFile"
                        type="file"
                        className="custom-file-input"
                        id="cv_upload"
                        // value={currentFile?.fileName}
                        onChange={(e) => setcurrentFile(e.target.files[0])}

                      />
                      <label className="custom-file-label" htmlFor="cv_upload"
                        value={currentFile?.fileName}
                      >
                        {currentFile[0]?.fileName || currentFile?.name || currentFile[0]?.fileName ?
                          <span className="">{currentFile?.name} {currentFile[0]?.fileName} {currentFile?.fileName} </span> : "Choose file"}

                        {/* {currentFile[0]?.fileName ? currentFile[0]?.fileName : "Choose file"} */}
                      </label>


                    </div>
                  </div>
                  <button type="button" className='btn btn-info'
                    //  onClick={UploadImage()}
                    onClick={() => UploadImage()}>Upload</button>
                </div>
                <div className='col-md-3'>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      className="form-control"
                      type="text"
                      name="password"
                      value={basicInfo?.password}
                      onChange={handleBasicInfo}
                    />
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      className="form-control"
                      type="text"
                      name="password"
                      value={basicInfo?.cnfPassword}
                      onChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          cnfPassword: e.target.value,
                        });
                      }}
                    // onChange={handleBasicInfo}
                    />
                  </div>
                </div>

              </div>

              {/* Tabs  */}
              <div style={{ paddingLeft: '0px' }} className="col-md-12 p-r-0">
                <div className="card tab-box">
                  <div className="row user-tabs">
                    <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                      <ul className="nav nav-tabs nav-tabs-bottom">
                        <li className="nav-item">
                          <a
                            href="#emp_other_details"
                            data-toggle="tab"
                            className="nav-link active"
                          // onClick={(e) => setShowTrx(!showTrx)}
                          >
                            {/* STATUTARY DETAIILS */}
                            Statutary Details
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#emp_bank"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Bank Details
                          </a>
                        </li>

                        <li className="nav-item">
                          <a
                            href="#emp_salary"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            {/* SALARY COMPONENTS */}
                            Salary Components
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#emp_address"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            {/* CONTACT ADDRESS */}
                            Contact Address
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#emp_edu"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Education
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#emp_exp"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Experience
                          </a>
                        </li>
                        {/* <li className="nav-item">
                          <a
                            href="#emp_cert"
                            data-toggle="tab"
                            className="nav-link"
                            // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Certificates
                          </a>
                        </li> */}
                        <li className="nav-item">
                          <a
                            href="#emp_contact"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Contacts
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  minHeight: '65vh',
                  maxHeight: '65vh',
                  overflowY: 'auto',
                }}
                className="card p-4 tab-content"
              >
                {/* Others Details  */}
                <div
                  className="tab-pane fade show active"
                  id="emp_other_details"
                >
                  <div className="">
                    <div className="row">
                      <div className="col-md-6">
                        PAN : {otherDetails?.pan}
                      </div>
                      <div className="col-md-6">
                        Passport No : {otherDetails?.passportNo}
                      </div>

                    </div>
                    <hr></hr>
                    <br></br>
                    <div className="row">
                      <div className="col-md-6">
                        PF Number: {otherDetails?.pfno}
                      </div>
                      <div className="col-md-5">
                        ESI Number: {otherDetails?.esino}
                      </div>

                      <div
                        className="col-md-1"
                      // className='float-right'
                      >
                        <div className="btn btn-primary" onClick={() => handleStatutary()}>
                          <EditIcon />
                        </div>
                      </div>
                    </div>
                    <hr></hr>
                  </div>

                  {Statutaryedit === 555 &&

                    <div className="">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>PAN</label>
                            <input
                              type="text"
                              name="pan"
                              pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"
                              title="Please enter valid Pan number. E.g. AAAAA1234A"
                              placeholder='PAN No.'
                              className="form-control"
                              value={otherDetails?.pan}
                              onChange={handleotherDetails}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Passport No</label>
                            <input
                              required
                              type="text"
                              placeholder="Passport No."
                              maxLength={10}
                              pattern="[a-zA-Z]{1}[0-9]{7}"
                              // pattern="[a-zA-Z]{2}[0-9]{5}[a-zA-Z]{1}"
                              title="Please enter valid Passport number. E.g. A2190457"
                              className="form-control"
                              name="passportNo"
                              value={otherDetails?.passportNo}
                              onChange={handleotherDetails}
                              onInput={toInputUppercase}
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>Passport Expiry Date</label>
                        <div>
                          <input
                            className="form-control"
                            type="date"
                            name="passportExp"
                            value={otherDetails?.passportExp?.split('T')[0]}
                            onChange={handleotherDetails}
                          />
                        </div>
                      </div>
                    </div> */}
                      </div>



                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>PF Number / UAN  Number</label>
                            <input
                              type="text"
                              placeholder="PF No."
                              maxLength={10}
                              pattern="[0-9]{7}"
                              title="Please enter valid Pf number. E.g. 0543211"
                              className="form-control"
                              name="pfno"
                              value={otherDetails?.pfno}
                              onChange={handleotherDetails}
                              onInput={toInputUppercase}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>ESI Number</label>
                            <div>
                              <input
                                className="form-control"
                                type="tel"
                                pattern="[0-9]{17}"
                                placeholder="ESI Number "
                                title="Please enter valid ESI Number. E.g. 99558565759955664"
                                name="esino"
                                maxLength={17}
                                value={otherDetails?.esino}
                                onChange={handleotherDetails}
                                onInput={toInputUppercase}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-1">
                          <button
                            type="submit"
                            style={{ marginTop: '15px' }}

                            className="btn btn-primary float-center"
                            onSubmit={(e) => handleSaveStatutary()}
                          >
                            Save
                          </button>
                        </div>
                        <div className="col-md-1">
                          <div style={{ marginTop: '15px', marginLeft: '0px' }}
                            className="btn btn-primary float-center"
                            onClick={(e) => handleCancelStatutary()}
                          >
                            Cancel
                          </div>
                        </div>


                      </div>



                    </div>
                  }
                </div>

                {/* SALARY COMPONENTS */}
                <div className="tab-pane fade show" id="emp_salary">

                  <div className="row">
                    <div className="col-md-4">
                      <label>Annual CTC</label>
                    </div>
                    <div className="col-md-4">
                      <div className='row'>
                        <div className="col-md-2" style={{ marginTop: '10px', marginRight: '-10px' }}>
                          <span className="input-group-addon" style={{ width: '400px' }} >₹</span>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">

                            <input
                              type="text"
                              name="year_ctc"
                              value={ctc}
                              className="form-control"
                              onChange={(e) => setCtc(e.target.value)}
                              // onChange={setCtc(e.target.value)}
                              Edit Employee           // value={SALARYCOMPONENTS?.anualctc}

                            />

                          </div>

                        </div>
                        <div className="col-md-4" style={{ marginTop: '10px' }}>
                          per year
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-4">
                      <div className="form-group">
                        <label>MONTHLY CTC</label>
                        <input
                          type="number"
                          name="monthly_ctc"
                          className="form-control"
                          // onChange={(e) => setmCtc(e.target.value)}
                          // value={mctc}
                        // value={bankDetails?.accountNumber}
                        />
                      </div>
                    </div> */}

                  </div>
                  <div className="row">
                    <div className="col-md-3" style={{ marginTop: '10px' }}>

                      Salary  Components
                    </div>
                    <div className="col-md-3" style={{ marginTop: '10px' }}>

                      Calculation Type
                    </div>
                    <div className="col-md-3" style={{ marginTop: '10px' }}>

                      Monthly Amount
                    </div>
                    <div className="col-md-3" style={{ marginTop: '10px' }}>
                      Annual Amount
                    </div>
                  </div>
                  <hr></hr>


                  <div className='row'>
                    <div className="col-md-3">
                      <p>Basic</p>
                    </div>
                    <div className="col-md-3">
                      <div className='row'>
                        <div className="col-md-6">
                          <input type="number"
                            className="form-control"
                            value={basicprce}
                            onChange={(e) => setbasicprce(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6" style={{ marginLeft: '117px', marginTop: '-34px' }}>
                          <span className="input-group-addon" style={{ width: '40px' }} >% of CTC</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <p>{basicmctc || 0}</p>
                    </div>
                    <div className="col-md-2">
                      <p>{basicctc || 0}</p>
                    </div>
                  </div>
                  <br></br>
                  <div className='row'>
                    <div className="col-md-3">
                      <p>House Rent Allowance</p>
                    </div>
                    <div className="col-md-3">
                      <div className='row'>
                        <div className="col-md-6">
                          <input type="number"
                            className="form-control"
                            value={Houseprce}
                            // value={basicInfo.name}
                            onChange={(e) => setHouseper(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6" style={{ marginLeft: '120px', marginTop: '-34px' }}>
                          <span className="input-group-addon" style={{ width: '40px' }} > % &nbsp; Basic</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <p>{HousemCtc || 0}</p>
                    </div>
                    <div className="col-md-3">
                      <p>{HouseCtc || 0}</p>
                    </div>
                  </div>
                  <br></br>
                  <div className='row'>
                    <div className="col-md-3">
                      <p>Conveyance Allowance</p>
                    </div>
                    <div className="col-md-3">
                      Fixed Amount
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        // name="monthly_ctc"
                        className="form-control"
                        onChange={(e) => setConveyanceM(e.target.value)}
                        value={ConveyanceM}
                      />
                      {/* <p>{ConveyanceM || 0}</p> */}
                      {/* <p>{ConveyanceCTC || 0}</p> */}
                    </div>
                    <div className="col-md-3">
                      <p>{ConveyanceCTC || 0}</p>
                    </div>
                  </div>
                  <br></br>
                  <div className='row'>
                    <div className="col-md-3">
                      <p>Fixed Allowance</p>
                    </div>
                    <div className="col-md-3">
                      Fixed Amount
                    </div>
                    <div className="col-md-3">
                      <p>{fixedMCtc || 0}</p>
                    </div>
                    <div className="col-md-3">
                      <p>{fixedCtc || 0}</p>
                    </div>
                  </div>
                  <br></br>
                  <div className='row'>
                    <div className='col-md-3'>
                      <h3>Cost to Company</h3>
                    </div>
                    <div className='col-md-3'></div>
                    <div className='col-md-3'>₹ {total_months}</div>
                    <div className='col-md-3'>₹ {total_ctc}</div>

                  </div>

                  <br />
                  {fixedCtc > 0 ? "" :
                    <div className='row borderdesign'>

                      <div className='col-md-1'>
                        <div className=' errorborder'>
                          <div style={{ backgroundColor: '#fef2f2', padding: '7px' }}>
                            <ErrorOutlineIcon></ErrorOutlineIcon>
                          </div>
                        </div>
                        {/* <h3>Fixed Cases</h3> */}
                      </div>
                      <div className='col-md-5 '>
                        <h4>System Calculated Components' Total</h4>
                        <span>Amount must be greater than zero.
                          {/* Adjust the CTC or any of the component's amount */}
                        </span>
                      </div>
                      {/* <div className='col-md-3'></div> */}
                      <div style={{ color: 'red' }} className='col-md-3'>₹ {fixedMCtc}</div>
                      <div style={{ color: 'red' }} className='col-md-3'>₹ {fixedCtc}</div>

                    </div>
                  }

                  {/*fixedCtc > 0 ? "system" :
                    <div className='row borderdesign'>
                      {/* <div className=' errorborder'>
                        <div style={{ backgroundColor: '#fef2f2', padding: '7px' }}>
                          <ErrorOutlineIcon></ErrorOutlineIcon>
                        </div>
                      </div> 
                      <div className=''>
                        <div className='col-md-5 '>
                          <h4>System Calculated Components' Total</h4>
                          {/* <span>Amount must be greater than zero. */}
                  {/* Adjust the CTC or any of the component's amount */}
                  {/* </span> 
                        </div>
                        {/* <div className='col-md-3'></div> 
                        <div className='col-md-3'>₹ {total_months}</div>
                        <div className='col-md-3'>₹ {total_ctc}</div>
                      </div>
                    </div>*/}



                </div>

                {/* Bank Deatails  */}

                <div className="tab-pane fade show" id="">
                  {/* <div className="tab-pane fade show" id="emp_bank"> */}


                </div>

                <div className="tab-pane fade show" id="emp_bank">
                  {bankDetail?.map((bank, index) => (
                    <div key={index}>
                      <div className="row">
                        {/* <div className="col-md-4">
                          Bank  Detaills : {bank?.bankdetails1}
                        </div> */}
                        <div className="col-md-4">
                          Bank Name : {bank?.bankname}
                        </div>
                        <div className="col-md-3">
                          Account Number : {bank?.accountNumber}
                        </div>
                        <div className="col-md-4">
                          Account Holder : {bank?.accountHoldersName}
                        </div>
                        <div
                          className="col-md-1"
                        // className='float-right'
                        >
                          <div className="btn btn-info float-right"
                            onClick={() => handleEDitSetBank(bank, index)}>
                            <EditIcon />
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                      <br></br>

                      <div className='row'>
                        {/* <div className="col-md-4">
                          Account Holder : {bank?.accountHoldersName}
                        </div> */}
                        <div className="col-md-4">
                          Branch : {bank?.branch}
                        </div>
                        <div className="col-md-3">
                          IFSC : {bank?.IFSC}
                        </div>
                        <div className="col-md-4">   
                          UPI : {bank?.upi}
                        </div>
                        <div
                          className="col-md-1"
                        // className='float-right'
                        >
                          <div
                            className="btn btn-primary float-right"
                            onClick={(e) => handleRemoveBank(e, index)}
                          >
                            <Delete />
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                      <br />
                    </div>
                  ))}

                  {
                    BankIndex == 474 &&
                    bankDetail?.map((edu, index) => (
                      // index < bankeditIndex &&
                      <div key={index}>
                        {bankeditIndex === index ? <>
                          <div className="row">
                            {/* <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Bank  Detaills{' '}
                                   <span className="text-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bankdetails1"
                                  value={edu?.bankdetails1}
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div> */}
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Bank Name
                                  {/* 11<span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bankname"
                                  value={edu?.bankname}
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Account Holder{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="accountHoldersName"
                                  value={edu?.accountHoldersName}
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Account Number{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  type="text"
                                  pattern="[0-9]{11}"
                                  maxLength={11}
                                  title="Please enter valid Account Code. E.g. 52520065104"

                                  name="accountNumber"
                                  className="form-control"
                                  value={edu?.accountNumber}
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  IFSC
                                </label>
                                <input
                                  type="text"
                                  maxLength={11}
                                  pattern="[a-zA-Z]{4}[0-9]{7}"
                                  // pattern="[a-zA-Z]{2}[0-9]{5}[a-zA-Z]{1}"
                                  title="Please enter valid IFSC Code. E.g. ABHY0065104"
                                  name="IFSC"
                                  value={edu?.IFSC}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">Branch</label>

                                <input
                                  type="text"
                                  name="branch"
                                  value={edu?.branch}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">UPI ID</label>
                                <input
                                  type="text"
                                  name="upi"
                                  value={edu?.upi}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleBankEdit(e, bankeditIndex)
                                  }
                                />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <br></br>

                              <div style={{ marginTop: '15px' }}
                                className="btn btn-primary float-center"
                                onClick={(e) => handleSaveBank()}
                              >
                                Save
                              </div>
                              <div style={{ marginTop: '15px', marginLeft: '11px' }}
                                className="btn btn-primary float-center"
                                onClick={(e) => handleCancelBank()}
                              >
                                Cancel
                              </div>
                            </div>
                          </div>

                        </>
                          : ''}
                      </div>
                    ))}



                  {!AddbankDetail ? '' :
                    BankIndex == 476 && bankDetail?.slice(AddbankDetail).map((edu, index) => (

                      <div key={index}>
                        <div className="row">
                          {/* <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Bank  Detaills15{' '}
                                
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="bankdetails1"
                                value={edu?.bankdetails1}
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              // onInput={toInputUppercase}
                              />
                            </div>
                          </div> */}
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Bank Name
                                {/* 11<span className="text-danger">*</span> */}
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="bankname"
                                value={edu?.bankname}
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              // onInput={toInputUppercase}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Account Holder{' '}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="accountHoldersName"
                                value={edu?.accountHoldersName}
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              // onInput={toInputUppercase}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Account Number{' '}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <input
                                type="text"
                                pattern="[0-9]{11}"
                                maxLength={11}
                                title="Please enter valid Account Code. E.g. 52520065104"

                                name="accountNumber"
                                className="form-control"
                                value={edu?.accountNumber}
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              // onInput={toInputUppercase}
                              />
                            </div>
                          </div>
                          <div className="col-md-3"></div>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                IFSC
                              </label>
                              <input
                                type="text"
                                maxLength={11}
                                pattern="[a-zA-Z]{4}[0-9]{7}"
                                // pattern="[a-zA-Z]{2}[0-9]{5}[a-zA-Z]{1}"
                                title="Please enter valid IFSC Code. E.g. ABHY0065104"
                                name="IFSC"
                                value={edu?.IFSC}
                                className="form-control"
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">Branch</label>

                              <input
                                type="text"
                                name="branch"
                                value={edu?.branch}
                                className="form-control"
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">UPI ID</label>
                              <input
                                type="text"
                                name="upi"
                                value={edu?.upi}
                                className="form-control"
                                onChange={(e) =>
                                  handleBankDetails(e, (bankDetail?.length - 1))
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <br></br>
                            <br></br>
                            <div
                              className="btn btn-primary float-center"
                              onClick={(e) => handleSaveBank()}
                            >
                              Save

                            </div>
                            <div
                              className="btn btn-primary float-right"
                              onClick={(e) => handleRemoveBank(e, (bankDetail?.length - 1))}
                            >
                              <Delete /> Remove Bank

                            </div>
                          </div>
                        </div>

                        {/* {index == 0 && ( */}

                        {/* )} */}
                        <hr />
                        <br></br>
                        <br></br>
                      </div>
                    ))}

                  <div className="btn btn-primary" onClick={handleAnotherSetBank}>
                    <Add /> Add Bank
                  </div>
                  {/* {bankDetailedit ? bankDetailedit[0]?.accountHoldersName : ''} */}

                </div>
                {/* Address  */}

                <div className="tab-pane fade show" id="emp_address">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label">Present Address</label>
                        <textarea
                          className="form-control"
                          cols="10"
                          rows="2"
                          placeholder="House No, Street"
                          name="addressLine1"
                          value={address?.addressLine1}
                          onChange={handleaddress}
                        ></textarea>
                      </div>
                    </div>

                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="col-form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={address?.city}
                          onChange={handleaddress}
                          onInput={toCapitalize}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="col-form-label">State</label>
                        <select
                          style={{ height: '44px' }}
                          className="custom-select"
                          name="state"
                          value={address?.state}
                          onChange={handleaddress}
                        >
                          <option value=""></option>
                          {stateArr.map((a) => (
                            <option value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="col-form-label">Pincode</label>
                        <input
                          type="tel"
                          maxLength={6}
                          className="form-control"
                          name="postalCode"
                          value={address?.postalCode}
                          onChange={handleaddress}
                        />
                      </div>
                    </div>
                  </div>
                  {/* {isChecked} */}
                  {['checkbox'].map((type) => (
                    <div
                      //  key={`default-${type}`}
                      className="col-mb-3"
                    >

                        <Form.Check
                          onChange={(e) => handle_Adress(e)}
                          // checked={isChecked} previous
                          checked={address.addressLine1 === address.addressLine2} //new
                          // type={type}   
                          // id={`default-${type}`} previous
                          type="checkbox"   
                          id="default-checkbox"   //new
                          label={`Same as Present `}
                        />
                    </div>
                  ))}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label"> Permanent Address</label>
                        <textarea
                          className="form-control"
                          cols="10"
                          rows="2"
                          placeholder="House No, Street"
                          name="addressLine2"
                          value={address?.addressLine2}
                          onChange={handleaddress}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="col-form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Permanentcity"
                          value={address?.Permanentcity}
                          onChange={handleaddress}
                          onInput={toCapitalize}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="col-form-label">State</label>
                        <select
                          style={{ height: '44px' }}
                          className="custom-select"
                          name="Permanentstate"
                          value={address?.Permanentstate}
                          onChange={handleaddress}
                        >
                          <option value=""></option>
                          {stateArr.map((a) => (
                            <option value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="col-form-label">Pincode</label>
                        <input
                          type="tel"
                          maxLength={6}
                          className="form-control"
                          name="PermanentpostalCode"
                          value={address?.PermanentpostalCode}
                          onChange={handleaddress}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label">Local Contact</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="localcontact"
                          value={address?.localcontact}
                          maxLength={10}
                          onChange={handleaddress}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label"> Emergency Contact</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="emergencyContact"
                          maxLength={10}
                          value={address?.emergencyContact}
                          onChange={handleaddress}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="tab-pane fade show" id="emp_edu">
                  {
                    education?.map((bank, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-4">
                            Qualification : {bank?.qualification}
                          </div>
                          <div className="col-md-4">
                            Instution: {bank?.instution}
                          </div>
                          <div className="col-md-3">
                            University : {bank?.university}
                          </div>
                          <div
                            className="col-md-1"
                          // className='float-right'
                          >
                            <div className="btn btn-info float-right" onClick={() => handleEDitEducation(bank, index)}>
                              <EditIcon />
                            </div>
                          </div>

                        </div>
                        <div className="row">
                          {/* <div className="col-md-4">
                          Specialization : {bank?.specialization}
                        </div> */}
                          {/* <div className="col-md-4">
                          Start Date : {bank?.startDate}
                        </div> */}
                          {/* <div className="col-md-4">
                          End Date :
                           {bank?.endDate}
                        </div> */}

                        </div>
                        <br></br>
                        <div className='row'>
                          <div className="col-md-4">
                            Specialization : {bank?.specialization}
                          </div>
                          <div className="col-md-4">
                            Score : {bank?.score}
                          </div>
                          <div className="col-md-3">
                            Grading System : {bank?.gradingSystem}
                          </div>

                          <div
                            className="col-md-1"
                          // className='float-right'
                          >
                            {/* <div className="btn btn-primary float-right" onClick={() => handleEDitEducation(bank, index)}>
                              <EditIcon />
                            </div> */}
                            <div
                              className="btn btn-primary float-right"
                              onClick={(e) => handleRemoveQualification(e, index)}
                            >
                              <Delete />
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        <br />

                      </div>
                    ))}

                  {
                    educationIndex == 474 &&
                    education?.map((edu, index) => (
                      <div key={index}>
                        {edueditIndex === index ? <>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Qualification{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input

                                  className="form-control"
                                  type="text"
                                  name="qualification"
                                  value={edu?.qualification}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Instution
                                  {/* 11<span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="instution"
                                  value={edu?.instution}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  University{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="university"
                                  value={edu?.university}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Specialization{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="specialization"
                                  value={edu?.specialization}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Start Date
                                </label>
                                <DatePicker
                                  id='dob'
                                  poppername="startDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={edu?.startDate}
                                  onChange={(e) =>
                                    handleEducationDetails1(e, index)
                                  }
                                />
                                {/* <input
                                type="date"
                                name="startDate"
                                value={edu?.startDate?.split('T')[0]}
                                className="form-control"
                                onChange={(e) =>
                                  handleEducationDetails(e, index)
                                }
                              /> */}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">End Date</label>
                                <DatePicker
                                  // poppername="endDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={edu?.endDate}
                                  onChange={(e) =>
                                    handleEducationDetailsendDate(e, index)
                                  }
                                />
                                {/* <input
                                type="date"
                                name="endDate"
                                value={edu?.endDate?.split('T')[0]}
                                className="form-control"
                                onChange={(e) =>
                                  handleEducationDetails(e, index)
                                }
                              /> */}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">Score</label>
                                <input
                                  type="number"
                                  name="score"
                                  value={edu?.score}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Grading System
                                </label>
                                <select
                                  className="custom-select"

                                  name="gradingSystem"
                                  value={edu?.gradingSystem}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                >
                                  <option value={'CGPA'}>CGPA</option>
                                  <option value={'Percentage'}>Percentage</option>
                                </select>
                                {/* <input
                                  type="text"
                                  name="gradingSystem"
                                  value={edu?.gradingSystem}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                /> */}
                              </div>

                            </div>

                          </div>

                          <div className='col-md-3'>
                            <br></br>

                            <div style={{ marginTop: '15px' }}
                              className="btn btn-primary float-center"
                              onClick={(e) => handleSaveEducation()}
                            >
                              Save
                            </div>
                            <div style={{ marginTop: '15px', marginLeft: '11px' }}
                              className="btn btn-primary float-center"
                              onClick={(e) => handleCancelEducation()}
                            >
                              Cancel
                            </div>
                          </div>
                          <hr />
                          <br></br>
                          <br></br>
                        </>
                          : ''}
                      </div>

                    ))}

                  {
                    educationIndex == 476 &&
                    education?.map((edu, index) => (
                      <div key={index}>
                        {educationAdd === index ? <>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Qualification{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input

                                  className="form-control"
                                  type="text"
                                  name="qualification"
                                  value={edu?.qualification}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Instution
                                  {/* 11<span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="instution"
                                  value={edu?.instution}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  University{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="university"
                                  value={edu?.university}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Specialization{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="specialization"
                                  value={edu?.specialization}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Start Date
                                </label>
                                <DatePicker
                                  id='dob'
                                  poppername="startDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={edu?.startDate}
                                  onChange={(e) =>
                                    handleEducationDetails1(e, index)
                                  }
                                />
                                {/* <input
                                type="date"
                                name="startDate"
                                value={edu?.startDate?.split('T')[0]}
                                className="form-control"
                                onChange={(e) =>
                                  handleEducationDetails(e, index)
                                }
                              /> */}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">End Date</label>
                                <DatePicker
                                  // poppername="endDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={edu?.endDate}
                                  onChange={(e) =>
                                    handleEducationDetailsendDate(e, index)
                                  }
                                />
                                {/* <input
                                type="date"
                                name="endDate"
                                value={edu?.endDate?.split('T')[0]}
                                className="form-control"
                                onChange={(e) =>
                                  handleEducationDetails(e, index)
                                }
                              /> */}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">Score</label>
                                <input
                                  type="number"
                                  name="score"
                                  value={edu?.score}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Grading System
                                </label>
                                <select
                                  className="custom-select"

                                  name="gradingSystem"
                                  value={edu?.gradingSystem}
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                >
                                  <option value={'CGPA'}>CGPA</option>
                                  <option value={'Percentage'}>Percentage</option>
                                </select>
                                {/* <input
                                  type="text"
                                  name="gradingSystem"
                                  value={edu?.gradingSystem}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleEducationDetails(e, index)
                                  }
                                /> */}
                              </div>
                            </div>
                          </div>
                          <div style={{ marginTop: '1px', marginLeft: '886px' }}
                            className="btn btn-primary float-center"
                            onClick={(e) => handleSaveEducation()}
                          >
                            Save
                          </div>
                          {/* {index == 0 && ( */}
                          <div
                            className="btn btn-primary float-right"
                            onClick={(e) => handleRemoveQualification(e, index)}
                          >
                            <Delete /> Remove Qualification

                          </div>
                          {/* )} */}
                          <hr />
                          <br></br>
                          <br></br>
                        </> : ''}
                      </div>

                    ))
                  }

                  <div className="btn btn-primary" onClick={handleAnotherSet}>
                    <Add /> Add Qualification
                  </div>
                </div>

                <div className="tab-pane fade show" id="emp_exp">
                  {
                    experience?.map((exp, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-4">
                            Company : {exp?.company}
                          </div>
                          <div className="col-md-4">
                            Designation: {exp?.designation}
                          </div>
                          <div className="col-md-3">
                            Responsibilities : {exp?.responsibilities}
                          </div>
                          <div
                            className="col-md-1"
                          // className='float-right'
                          >
                            <div className="btn btn-info float-right" onClick={() => handleEDitEXper(index)}>
                              <EditIcon />
                            </div>
                          </div>

                        </div>

                        <br></br>
                        <div className='row'>
                          <div className="col-md-4">
                            Start Date :-
                            {convert(exp?.startDate)}
                          </div>
                          <div className="col-md-4">
                            End Date :- {convert(exp?.endDate)}
                            {/* {exp?.endDate} */}
                          </div>
                          <div
                            className="col-md-3"
                          // className='float-right'
                          ></div>
                          <div
                            className="col-md-1"
                          // className='float-right'
                          >
                            {/* <div className="btn btn-primary float-right" onClick={() => handleEDitEducation(bank, index)}>
                              <EditIcon />
                            </div> */}
                            <div
                              className="btn btn-primary float-right"
                              onClick={(e) => handleRemove(e, index)}
                            >
                              <Delete />
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        <br />

                      </div>
                    ))}


                  {expIndex == 474 &&
                    experience?.map((exp, index) => (
                      <div key={index}>
                        {expeditIndex === index ? <>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Company
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="company"
                                  value={exp?.company}
                                  onChange={(e) => handleExpDetails(e, index)}
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Designation
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="designation"
                                  value={exp?.designation}
                                  onChange={(e) => handleExpDetails(e, index)}
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Responsibilities{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="responsibilities"
                                  value={exp?.responsibilities}
                                  onChange={(e) => handleExpDetails(e, index)}
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">Start Date</label>
                                <DatePicker
                                  // poppername="endDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={exp?.startDate}
                                  onChange={(e) =>
                                    handleExpStartDate(e, index)
                                  }
                                />

                                {/* <input
                              type="date"
                              name="startDate"
                              value={exp?.startDate?.split('T')[0]}
                              className="form-control"
                              onChange={(e) => handleExpDetails(e, index)}
                            /> */}
                              </div>
                            </div>

                            {/* {Expresume?.fileName} */}

                          </div>
                          <div className='row'>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label className="col-form-label">End Date</label>
                                <DatePicker
                                  // poppername="endDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={exp?.endDate}
                                  onChange={(e) =>
                                    handleExpEndDate(e, index)
                                  }
                                />

                              </div>
                            </div>
                            {/* <div className='col-md-3'>
                              <div className="form-group">
                                <label className="col-form-label">Upload Experience Letter</label>

                                <div className="custom-file">
                                  <input
                                    name="expFile"
                                    type="file"
                                    className="custom-file-input"
                                    // id="cv_upload"
                                    id="exp_upload"
                                    value={Expresume?.fileName}
                                    // value={exp?.fileName}
                                    // value={currentFile?.fileName}
                                    onChange={(e) => setExpresume(e.target.files[0])}
                                  />
                                  <label className="custom-file-label" htmlFor="exp_upload"
                                    value={Expresume?.fileName}
                                  >

                                    {Expresume?.fileName || Expresume?.name || Expresume?.fileName ?
                                      <span className="">{Expresume?.name} {Expresume[0]?.fileName} {Expresume?.fileName} </span> : "Choose file"}


                                  </label>

                                </div>
                              </div>
                            </div> */}
                            <div className='col-md-3'>
                            </div>
                            <div className='col-md-3'>
                            </div>

                            <div className='col-md-3' style={{ marginLeft: '95px' }}>
                              <br></br>

                              <div style={{ marginTop: '15px' }}
                                className="btn btn-primary float-center"
                                onClick={(e) => handleSaveEXP()}
                              >
                                Save
                              </div>
                              <div style={{ marginTop: '15px', marginLeft: '11px' }}
                                className="btn btn-primary float-center"
                                onClick={(e) => handleCancelEXP()}
                              >
                                Cancel
                              </div>
                            </div>
                            <hr />
                          </div>
                        </> : ''}
                      </div>
                    ))}

                  {expIndex === 476 &&
                    experience?.map((exp, index) => (
                      <div key={index}>

                        {expnAdd === index ? <>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Company
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="company"
                                  value={exp?.company}
                                  onChange={(e) => handleExpDetails(e, index)}
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Designation
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="designation"
                                  value={exp?.designation}
                                  onChange={(e) => handleExpDetails(e, index)}
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">
                                  Responsibilities{' '}
                                  {/* <span className="text-danger">*</span> */}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="responsibilities"
                                  value={exp?.responsibilities}
                                  onChange={(e) => handleExpDetails(e, index)}
                                // onInput={toInputUppercase}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label className="col-form-label">Start Date</label>
                                <DatePicker
                                  // poppername="endDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={exp?.startDate}
                                  onChange={(e) =>
                                    handleExpStartDate(e, index)
                                  }
                                />

                                {/* <input
                              type="date"
                              name="startDate"
                              value={exp?.startDate?.split('T')[0]}
                              className="form-control"
                              onChange={(e) => handleExpDetails(e, index)}
                            /> */}
                              </div>
                            </div>

                            {/* {Expresume?.fileName} */}

                          </div>
                          <div className='row'>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label className="col-form-label">End Date</label>
                                <DatePicker
                                  // poppername="endDate"
                                  className="form-control"
                                  // style={{ border: 'none', backgroundColor: 'red' }}
                                  value={exp?.endDate}
                                  onChange={(e) =>
                                    handleExpEndDate(e, index)
                                  }
                                />

                              </div>
                            </div>
                            {/* <div className='col-md-3'>
                              <div className="form-group">
                                <label className="col-form-label">Upload Experience Letter</label>

                                <div className="custom-file">
                                  <input
                                    name="expFile"
                                    type="file"
                                    className="custom-file-input"
                                    // id="cv_upload"
                                    id="exp_upload"
                                    value={Expresume?.fileName}
                                    // value={exp?.fileName}
                                    // value={currentFile?.fileName}
                                    onChange={(e) => setExpresume(e.target.files[0])}
                                  />
                                  <label className="custom-file-label" htmlFor="exp_upload"
                                    value={Expresume?.fileName}
                                  >

                                    {Expresume?.fileName || Expresume?.name || Expresume?.fileName ?
                                      <span className="">{Expresume?.name} {Expresume[0]?.fileName} {Expresume?.fileName} </span> : "Choose file"}


                                  </label>

                                </div>
                              </div>
                            </div> */}
                            <div className="col-md-1" >
                              <div className="form-group text-center">
                                <div style={{ marginTop: '35px' }}
                                  className="btn btn-primary float-center"
                                  onClick={(e) => handleSaveEXP()}
                                >
                                  Save
                                </div>
                                {/* <label style={{ marginTop: '7px' }} className="col-form-label">Remove</label> */}
                                {/* <Delete onClick={(e) => handleRemove(e, index)} /> */}
                              </div>
                            </div>
                            <div className="col-md-1" >
                              <div className="form-group text-center">
                                <div
                                  style={{ marginTop: '29px' }}
                                  className="btn btn-primary float-right"
                                  onClick={(e) =>
                                    handleRemove(e, index)
                                  }
                                >
                                  <Delete />
                                </div>

                                {/* <label style={{ marginTop: '7px' }} className="col-form-label">Remove</label> */}
                                {/* <Delete onClick={(e) => handleRemove(e, index)} /> */}
                              </div>
                            </div>
                          </div>
                        </> : ''}
                      </div>
                    ))}

                  <div className="btn btn-primary" onClick={handleAnotherExp}>
                    <Add /> Add Experience
                  </div>
                </div>

                <div className="tab-pane fade show" id="emp_cert">
                  {certificate?.map((c, index) => (
                    <div key={index} className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Certificate Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="col-form-label">
                            Certificate File
                          </label>
                          <input
                            type="file"
                            name="cerificateFile"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="col-form-label">Remark</label>
                          <textarea
                            className="form-control"
                            cols="10"
                            rows="1"
                            placeholder="Add Remark about Certificate"
                            name="remark"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-1">
                        <div className="form-group text-center">
                          <label className="col-form-label">Remove</label>
                          <Delete
                            onClick={(e) => removeCertificateField(e, index)}
                          />
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}

                  <div
                    className="btn btn-primary"
                    onClick={addCertificateField}
                  >
                    <Add /> Add Certificate
                  </div>
                </div>

                {/* Contact Details  */}

                <div className="tab-pane fade show" id="emp_contact">
                  {
                    personContact?.map((p, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-3">
                            Name : {p?.name}
                          </div>
                          <div className="col-md-3">
                            Relationship: {p?.relationship}
                          </div>
                          <div className="col-md-3">
                            Phone : {p?.phone}
                          </div>
                          <div
                            className="col-md-3"
                          // className='float-right'
                          >
                            <div
                              className="btn btn-info float-right"
                              onClick={() => handleEDitContact(index)}>
                              <EditIcon />
                            </div>

                            <div
                              style={{ marginLeft: '153px' }}
                              className="btn btn-primary float-right"
                              onClick={(e) =>
                                removePersonContactField(e, index)
                              }
                            >
                              <Delete />
                            </div>
                          </div>


                        </div>

                        <hr></hr>
                        <br />

                      </div>
                    ))}
                  {contactIndex === 474 &&
                    personContact?.map((p, index) => (
                      <div key={index} className="row">
                        {contacteditIndex === index ? <>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Name
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={p?.name}
                                onChange={(e) =>
                                  handlePersonContact(e, index)
                                }
                                onInput={toCapitalize}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Relationship
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="relationship"
                                value={p?.relationship}
                                onChange={(e) =>
                                  handlePersonContact(e, index)
                                }
                                onInput={toCapitalize}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label className="col-form-label">
                                Phone
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="phone"
                                value={p?.phone}
                                onChange={(e) =>
                                  handlePersonContact(e, index)
                                }
                                onInput={toCapitalize}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div style={{ marginTop: '35px' }}
                              className="btn btn-primary float-center"
                              onClick={(e) => handleSaveContact()}
                            >
                              Save
                            </div>
                            <div style={{ marginTop: '35px', marginLeft: '11px' }}
                              className="btn btn-primary float-center"
                              onClick={(e) => handleCancelContact()}
                            >
                              Cancel
                            </div>
                          </div>
                        </> : ''}
                      </div>
                    )
                    )}


                  {contactIndex === 475 && personContact?.map((p, index) => (
                    <div key={index} className="row">
                      {AddContactDetail === index ? <>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="col-form-label">
                              Name
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="name"
                              value={p?.name}
                              onChange={(e) =>
                                handlePersonContact(e, index)
                              }
                              onInput={toCapitalize}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="col-form-label">
                              Relationship
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="relationship"
                              value={p?.relationship}
                              onChange={(e) =>
                                handlePersonContact(e, index)
                              }
                              onInput={toCapitalize}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="col-form-label">
                              Phone
                            </label>
                            <input
                              className="form-control"
                              type="tel"
                              name="phone"
                              maxLength={10}
                              value={p?.phone}
                              onChange={(e) =>
                                handlePersonContact(e, index)
                              }
                              onInput={toCapitalize}
                            />
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div style={{ marginTop: '35px' }}
                            className="btn btn-primary "
                            onClick={(e) => handleSaveContact()}
                          >
                            Save
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div style={{ marginTop: '35px' }}
                            className=""
                            onClick={(e) =>
                              removePersonContactField(e, index)
                            }
                          >
                            <Delete />
                          </div>
                        </div>

                      </> : ''}
                    </div>
                  )
                  )}
                  <div className="row">
                    <div className="col-md-12 col-sm-12">

                      <div
                        className="btn btn-primary"
                        onClick={addPersonContactField}
                      >
                        + Add Contacts
                      </div>
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
      </div >
    </div >
  );
};

export default AddEmployee;





