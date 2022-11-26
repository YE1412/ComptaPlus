import http from "../http.common";
class PaymentDataService {
  getAll() {
    return http.get("/payments");
  }
  getAllTypes() {
    return http.get("/payments/types");
  }
  // getAllOrders() {
  //   return http.get("/payments/orders");
  // }
  getAllInvoices() {
    return http.get("/payments/invoices");
  }
  get(id) {
    return http.get(`/payments/find`, {
      params: {
        actorId: id,
      },
    });
  }
  create(data) {
    return http.post(`/payments`, data);
  }
  update(id, data) {
    return http.put(`/payments/${id}`, data);
  }
  delete(id) {
    return http.delete(`/payments/${id}`);
  }
  deleteAll() {
    return http.delete(`/payments`);
  }
  findByTypes(types) {
    return http.get(`/payments/types/${types}`);
  }
}
export default new PaymentDataService();
