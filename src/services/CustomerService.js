import axios from 'axios'

const baseURL = import.meta.env.VITE_BASEURL

const url = baseURL + 'customers'
const urlMeta = baseURL + 'customers/meta'

console.log('baseURL : '+baseURL);

class CustomerService {
  // Get Customers Meta
  static async getCustomersMeta () {
    try {
      const res = await axios.get(urlMeta)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomersMeta error : ' + err)
      return (err)
    }
  }

  // Update Customers Meta
  static async updateCustomersMeta (body) {
    try {
      const res = await axios.put(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomersMeta error : ' + err)
      return (err)
    }
  }

  // Insert One Field to Customers Meta
  static async insertCustomersMeta (body) {
    try {
      const res = await axios.post(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomersMeta error : ' + err)
      return (err)
    }
  }

  // Get Customers
  static async getCustomers (pageNumber, size, filters) {
    try {
      const res = await axios.get(`${url}?pageNumber=${pageNumber}&size=${size}`, {
        params: filters,
      });
      return res.data;
    } catch (err) {
      console.log('CustomerService getCustomers error : ' + err)
      return (err)
    }
  }

  // Search Customers by filters
  static async searchCustomers (pageNumber, size, filters) {
    try {
      var body = {pageNumber : pageNumber, size: size, filters:filters}
      var res = await axios.post(`${url}/search`, body);
      return res.data
    } catch (err) {
      console.log('CustomerService searchCustomers error : ' + err)
      return (err)
    }
  }

  // Get Customer by Id
  static async getCustomer (id) {
    try {
      const res = await axios.get(`${url}/${id}`)
      return res.data
    } catch (err) {
      console.log('CustomerService getCustomers error : ' + err)
      return (err)
    }
  }

  // Create a Customer
  static async insertCustomer (body) {
    return axios.post(url, body)
  }

  // Update a Customer
  // Called from FO CustomerEdit.vue with full data (including the _id)
  // Call BO then customersController.js to do a router.put
  static async updateCustomer (body) {
    return axios.put(url, body)
  }

  // Delete a Customer
  static async deleteCustomer (id) {
    return axios.delete(`${url}/${id}`)
  }
}

export default CustomerService
