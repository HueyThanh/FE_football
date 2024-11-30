import axios from "axios";
import { API_PATH } from "src/AppConfig";

const PATH = API_PATH;

export const getAllTeamAway = () => {
  let url = PATH + "/getAllTeamAway";
  return axios.get(url);
};

export const addTeamAway = (payload) => {
  let url = PATH + "/insertTeamAway";
  return axios.post(url, payload);
};
export const updateTeamAway = (payload) => {
  let url = PATH + "/updateTeamAway";
  return axios.post(url, payload);
};

export const deleteTeamAway = (id) => {
  let url = PATH + "/deleteTeamAway/" + id;
  return axios.delete(url);
};

export const getRankingTeamAway = () => {
  let url = PATH + "/bxh";
  return axios.get(url);
};

export const getPlayerByIDTeam = (id) => {
  let url = PATH + "/getPlayerByIDTeam/" + id;
  return axios.get(url);
};
