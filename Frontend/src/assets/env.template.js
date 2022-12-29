(function (window) {
  window["env"] = window["env"] || {};
  window["env"].API_BACKEND_URL = `${ENV_API_BACKEND_PROTOCOL}://${ENV_API_BACKEND_URL}:${ENV_API_BACKEND_PORT}/${ENV_API_BACKEND_PATH}`;
})(this)