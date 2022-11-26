import http from "../http.common";
class SessionDataService {
  validate(id) {
    return http.post("/session", {
      sessionID: id,
    });
  }
  get() {
    return http.get(`/session`);
  }
  delete() {
    return http.post("/sessions/logout");
  }
}
export default new SessionDataService();
