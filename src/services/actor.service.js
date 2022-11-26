import http from "../http.common";
class ActorDataService {
  getAll() {
    return http.get("/actors");
  }
  getAllTypes() {
    return http.get("/actors/types");
  }
  get(id) {
    return http.get(`/actors/find`, {
      params: {
        actorId: id,
      },
    });
  }
  create(data) {
    return http.post(`/actors`, data);
  }
  update(id, data) {
    return http.put(`/actors/${id}`, data);
  }
  delete(id) {
    return http.delete(`/actors/${id}`);
  }
  deleteAll() {
    return http.delete(`/actors`);
  }
  findByTypes(types) {
    return http.get(`/actors/types/${types}`);
  }
}
export default new ActorDataService();
