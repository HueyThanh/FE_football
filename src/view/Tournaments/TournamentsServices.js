import axios from "axios";
import { API_PATH } from "src/AppConfig";

const PATH = API_PATH;

export const getAllTournaments = () => {
  let url = PATH + "/getAllTournament";
  return axios.get(url);
};

export const addTournaments = (payload) => {
  let url = PATH + "/insertTour";
  return axios.post(url, payload);
};

export const updateTournaments = (payload) => {
  let url = PATH + "/updateTour";
  return axios.put(url, payload);
};

export const deleteTournaments = (id) => {
  let url = PATH + "/deleteTour/" + id;
  return axios.delete(url);
};

export const thongKeByTour = (id) => {
  let url = PATH + "/thongke/" + id;
  return axios.get(url);
};

export const thongKeCard = (payload) => {
  let config = {
    params: { ...payload },
  };
  let url = PATH + "/thongke2";
  return axios.get(url, config);
};
