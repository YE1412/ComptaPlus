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

  get(id: number) {
    return http.get(`/invoices/find`, {
      params: {
        actorId: id,
      },
    });
  }

  getMore(ids: number[]) {
    return http.get(`/invoices/find/${ids}`);
  }

  create(data: any) {
    return http.post(`/invoices`, data);
  }

  update(id: number, data: any) {
    return http.put(`/invoices/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/invoices/${id}`);
  }

  deleteAll() {
    return http.delete(`/invoices`);
  }

  // findByTypes(types: any) {
  //   return http.get(`/invoices/types/${types}`);
  // }
}

export default new InvoiceDataService();
