import axios from 'axios'

const baseURL = import.meta.env.VITE_BASEURL
const url = baseURL + 'customers'
const urlMeta = baseURL + 'customers/meta'

console.log('CustomerService baseURL : '+baseURL);

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
  static async getCustomers (pageNumber, size, metaFilter, operatorFilter, valFilter, token) {
    console.log('CustomerService > getCustomers > metaFilter : ',metaFilter);
    console.log('CustomerService > getCustomers > operatorFilter : ',operatorFilter);
    console.log('CustomerService > getCustomers > valFilter : ',valFilter);
    try {
      console.log('CustomerService > getCustomers > try, token : ', token)
      const res = await fetch(`${url}?pageNumber=${pageNumber}&size=${size}&meta=${metaFilter}&operator=${operatorFilter}&val=${valFilter}`, {
          method: 'GET',
          headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer '+token
          }
        });
        console.log('CustomerService > getCustomers > after fetch')
        console.log('CustomerService > getCustomers > res.ok', res.ok)
        if (res.ok) {
          const data = await res.json();
          return data
        } else {
          const message = `An error has occured: ${res.status} - ${res.statusText}`;
            throw new Error(message);
        }
      } catch (err) {
        const response = err.response
        console.log('CustomerService > getCustomers > error response : ' + JSON.stringify(response));
        //console.log('CustomerService > getCustomers > error response status: ' + err.response.status)
        return ({
          data: [{"errorMessage": response.data.message}],
          count: -1
        })
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
