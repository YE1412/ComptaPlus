import http from "../http.common";

class ActorDataService {
  getAll() {
    return http.get("/actors");
  }

  get(id: number) {
    return http.get(`/actors/find`, {
      params: {
        actorId: id,
      },
    });
  }

  create(data: any) {
    return http.post(`/actors`, data);
  }

  update(id: number, data: any) {
    return http.put(`/actors/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/actors/${id}`);
  }

  deleteAll() {
    return http.delete(`/actors`);
  }

  findByAmountAndType(montantHt: any, type: any) {
    return http.get(`/actors/amount/${montantHt}/type/${type}`);
  }
}

export default new ActorDataService();
