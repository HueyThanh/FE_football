import axios from "axios";
import { API_PATH } from "src/AppConfig";

const PATH = API_PATH;

export const getAllMatch = () => {
  let url = PATH + "/getAllMatch";
  return axios.get(url);
};

export const addMatch = (payload) => {
  let url = PATH + "/insertMatches";
  return axios.post(url, payload);
};
export const updateMatch = (payload) => {
  let url = PATH + "/updateMatches";
  return axios.put(url, payload);
};

export const deleteMatch = (id) => {
  let url = PATH + "/deleteMatches/" + id;
  return axios.delete(url);
};

export const addCard = (payload) => {
  let url = PATH + "/insertCard";
  return axios.post(url, payload);
};

export const addGoal = (payload) => {
  let url = PATH + "/insertGoals";
  return axios.post(url, payload);
};

export const getTopScorers = () => {
  let url = PATH + "/top-scorers";
  return axios.get(url);
};

export const getGoalHome = (payload) => {
  let config = {
    params: { ...payload },
  };
  let url = PATH + "/getGoalHome";
  return axios.get(url, config);
};

export const getGoalAway = (payload) => {
  let config = {
    params: { ...payload },
  };
  let url = PATH + "/getGoalAway";
  return axios.get(url, config);
};

export const getByCaculate = (payload) => {
  let config = {
    params: { ...payload },
  };
  let url = PATH + "/getByCaculate";
  return axios.get(url, config);
};
