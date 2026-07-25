import axios from "axios";

const getStreamServiceBaseURL = () => {
  return `${import.meta.env.VITE_CORE_URL + "/core" || 'http://localhost:8101/core'}`;
};

const getInternetSearcherBaseURL = () => {
  return `${import.meta.env.VITE_SEARCHER_URL + "/internet-searcher" || 'http://localhost:8102/internet-searcher'}`;
};

export const streamServiceClient = axios.create({
  baseURL: getStreamServiceBaseURL(),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export const internetSearcherClient = axios.create({
  baseURL: getInternetSearcherBaseURL(),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})