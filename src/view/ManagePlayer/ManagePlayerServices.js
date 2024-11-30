import axios from "axios";
import { API_PATH } from "src/AppConfig";

const PATH = API_PATH;

export const getAllPlayer = () => {
  let url = PATH + "/getAllPlayer";
  return axios.get(url);
};

export const addPlayer = (payload) => {
  let url = PATH + "/insertPlayer";
  return axios.post(url, payload);
};
export const updatePlayer = (payload) => {
  let url = PATH + "/updatePlayer";
  return axios.post(url, payload);
};

export const deletePlayer = (id) => {
  let url = PATH + "/deletePlayer/" + id;
  return axios.delete(url);
};

export const updateImagePlayer = (payload) => {
  let url = PATH + "/updateImagePlayer";
  return axios.post(url, payload);
};
