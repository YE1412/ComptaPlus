import http from "../http.common";

class PaymentDataService {
  getAll() {
    return http.get("/payments");
  }

  getAllTypes() {
    return http.get("/payments/types");
  }

  get(id: number) {
    return http.get(`/payments/find`, {
      params: {
        actorId: id,
      },
    });
  }

  create(data: any) {
    return http.post(`/payments`, data);
  }

  update(id: number, data: any) {
    return http.put(`/payments/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/payments/${id}`);
  }

  deleteAll() {
    return http.delete(`/payments`);
  }

  findByTypes(types: any) {
    return http.get(`/payments/types/${types}`);
  }
}

export default new PaymentDataService();
