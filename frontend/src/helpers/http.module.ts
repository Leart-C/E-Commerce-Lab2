import axios from "axios";

import { baseUrl } from "../routes/paths";

const httpModule = axios.create({
  baseURL: baseUrl,
});

export default httpModule;
