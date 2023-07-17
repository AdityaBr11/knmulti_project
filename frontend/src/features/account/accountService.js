import axios from "axios";
import httpService from "../../lib/httpService";

const API_URL = `/generalledger/`;

const createLedger = async (ledgerData) => {
  const response = await httpService.post(API_URL, ledgerData);
  return response.data;
}

const getLedgers = async() => {
  const response = await httpService.get(API_URL);
  // const response = await axios.get(`http://localhost:3000/api/v1/generalledger`)
  return response.data;
}

const accountService = {
  createLedger,
  getLedgers,
}

export default accountService