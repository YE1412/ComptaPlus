import http from "../http.common";
class InvoiceDataService {
  getAll() {
    return http.get("/invoices");
  }
  getAllSellers() {
    return http.get("/invoices/sellers");
  }
  getAllBuyers() {
    return http.get("/invoices/buyers");
  }
  getAllDevises() {
    return http.get("/invoices/devises");
  }
  getAllOrders() {
    return http.get("/invoices/orders");
  }
  getAllLanguages() {
    return http.get("/invoices/languages");
  }
  getAllPayments() {
    return http.get("/invoices/payments");
  }
  get(id) {
    return http.get(`/invoices/find`, {
      params: {
        actorId: id,
      },
    });
  }
  getMore(ids) {
    return http.get(`/invoices/find/${ids}`);
  }
  create(data) {
    return http.post(`/invoices`, data);
  }
  update(id, data) {
    return http.put(`/invoices/${id}`, data);
  }
  delete(id) {
    return http.delete(`/invoices/${id}`);
  }
  deleteAll() {
    return http.delete(`/invoices`);
  }
}
export default new InvoiceDataService();
