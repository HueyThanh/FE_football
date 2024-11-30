import axios from "axios";
import { API_PATH } from "src/AppConfig";

const PATH = API_PATH;

export const getAllTeam = () => {
  let url = PATH + "/getAllTeam";
  return axios.get(url);
};

export const addTeam = (payload) => {
  let url = PATH + "/insertTeam";
  return axios.post(url, payload);
};
export const updateTeam = (payload) => {
  let url = PATH + "/updateTeam";
  return axios.post(url, payload);
};

export const deleteTeam = (id) => {
  let url = PATH + "/deleteTeam/" + id;
  return axios.delete(url);
};

export const getRankingTeam = () => {
  let url = PATH + "/bxh";
  return axios.get(url);
};

export const getPlayerByIDTeam = (id) => {
  let url = PATH + "/getPlayerByIDTeam/" + id;
  return axios.get(url);
};
export const getAllPlayerByIDTeam = (id) => {
  let url = PATH + "/getAllPlayerByIDTeam/" + id;
  return axios.get(url);
};
