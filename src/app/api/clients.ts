import axios from "axios";

const getStreamServiceBaseURL = () => {
  return "/core";
};

const getInternetSearcherBaseURL = () => {
  return "/internet-searcher";
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