import axios from "axios";

axios.defaults.withCredentials = true;

let PORT = 3000;
PORT = import.meta.env.PROD ? import.meta.env.CLIENT_PROD_PORT : PORT;
PORT = import.meta.env.DEV ? import.meta.env.CLIENT_DEV_PORT : PORT;
// console.log("envs vars");
// console.log(import.meta.env);
export default axios.create({
  baseURL: `http://localhost:${PORT}/dist/api`,
  withCredentials: true,
});
