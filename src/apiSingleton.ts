import createAPI from "./api";
import config from "./config";

export default createAPI({
  baseUrl: config.baseUrl,
});
