import http from "../http.common";

class OrderDataService {
  getAll() {
    return http.get("/orders");
  }

  get(id: number) {
    return http.get(`/orders/find`, {
      params: {
        actorId: id,
      },
    });
  }

  getNbOrders() {
    return http.get(`/orders/nb`);
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
}

export default new OrderDataService();
