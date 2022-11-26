import http from "../http.common";
class UserDataService {
  getAll() {
    return http.get("/users");
  }
  getAllDevises() {
    return http.get("/users/devises");
  }
  getAllPrices() {
    return http.get("/users/prices");
  }
  get(login, password) {
    return http.get(`/users/login`, {
      params: {
        login: login,
        password: password,
      },
    });
  }
  checkEmail(email) {
    return http.get(`/users/email`, {
      params: {
        login: email,
      },
    });
  }
  checkLogin(login) {
    return http.get(`/users/email`, {
      params: {
        login: login,
      },
    });
  }
  create(data) {
    return http.post(`/users`, data);
  }
  update(id, data) {
    return http.put(`/users/${id}`, data);
  }
  delete(id) {
    return http.delete(`/users/${id}`);
  }
  deleteAll() {
    return http.delete(`/users`);
  }
  findByType(type) {
    return http.get(`/users/type/${type}`);
  }
}
export default new UserDataService();
