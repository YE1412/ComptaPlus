import http from "../http.common";

class UserDataService {

  getAll() {
    return http.get("/users");
  }

  get(login: string, password: string) {
    return http.get(`/users/login/${login}/pass/${password}`);
  }

  checkEmail(email: string) {
    return http.get(`/users/email/${email}`);
  }

  checkLogin(login: string) {
    return http.get(`/users/login/${login}`);
  }

  create(data: any) {
    return http.post(`/users`, data);
  }

  update(id: any, data: any) {
    return http.put(`/users/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/users`);
  }

  findByType(type: any) {
    return http.get(`/users/type/${type}`);
  }
}

export default new UserDataService();
