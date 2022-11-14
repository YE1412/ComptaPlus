import http from "../http.common";

class OrderDataService {
  getAll() {
    return http.get("/orders");
  }

  // getAllTypes() {
  //   return http.get("/orders/types");
  // }

  get(id: number) {
    return http.get(`/orders/find`, {
      params: {
        actorId: id,
      },
    });
  }

  create(data: any) {
    return http.post(`/orders`, data);
  }

  update(id: number, data: any) {
    return http.put(`/orders/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/orders/${id}`);
  }

  deleteAll() {
    return http.delete(`/orders`);
  }

  // findByTypes(types: any) {
  //   return http.get(`/orders/types/${types}`);
  // }
}

export default new OrderDataService();
