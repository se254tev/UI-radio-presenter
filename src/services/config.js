const API_BASE_URL = import.meta.env.VITE_API_URL;

export const HTTP_API = API_BASE_URL;
export const WS_URL = API_BASE_URL.replace("https", "wss") + "/ws/radio";
export const STREAM_URL = API_BASE_URL + "/stream/live.m3u8";

export default API_BASE_URL;
