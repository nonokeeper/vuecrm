import axios from 'axios'

const baseURL = import.meta.env.VITE_BASEURL
const url = baseURL + 'data'
const urlMeta = baseURL + 'data/meta'

console.log('DataService url : '+url);
console.log('DataService urlMeta : '+urlMeta);

class DataService {
  // Get Data Meta
  static async getDataMeta (entity) {
    if(!entity) {
      return {};
    }
    try {
      const res = await axios.get(urlMeta, {params: { "entity": entity}})
      return res.data
    } catch (err) {
      console.log('DataService getDataMeta error : ' + err)
      return (err)
    }
  }

  // Update Data Meta
  static async updateDataMeta (body) {
    try {
      const res = await axios.put(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('DataService getDataMeta error : ' + err)
      return (err)
    }
  }

  // Insert One Field to Data Meta
  static async insertDataMeta (body) {
    try {
      const res = await axios.post(urlMeta, body)
      return res.data
    } catch (err) {
      console.log('DataService getDataMeta error : ' + err)
      return (err)
    }
  }

  // Get Data
  static async getData (entity, pageNumber, size, metaFilter, operatorFilter, valFilter, token) {
    //console.log('DataService getData > entity : ', entity);
    //console.log('DataService > getData > metaFilter : ',metaFilter);
    //console.log('DataService > getData > operatorFilter : ',operatorFilter);
    //console.log('DataService > getData > valFilter : ',valFilter);
    try {
      //console.log('DataService > getData > try, token : ', token)
      const res = await fetch(`${url}?entity=${entity}&pageNumber=${pageNumber}&size=${size}&meta=${metaFilter}&operator=${operatorFilter}&val=${valFilter}`, {
          method: 'GET',
          headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer '+token
          }
        });
        //console.log('DataService > getData > after fetch')
        //console.log('DataService > getData > res.ok', res.ok)
        if (res.ok) {
          const data = await res.json();
          return data
        } else {
          const message = `An error has occured: ${res.status} - ${res.statusText}`;
            throw new Error(message);
        }
      } catch (err) {
        const response = err.response
        console.log('DataService > getData > error response : ' + JSON.stringify(response));
        return ({
          data: [{"errorMessage": response.data.message}],
          count: -1
        })
    }
  }

  // Search Data by filters
  static async searchData (pageNumber, size, filters) {
    try {
      var body = {pageNumber : pageNumber, size: size, filters:filters}
      var res = await axios.post(`${url}/search`, body);
      return res.data
    } catch (err) {
      console.log('DataService searchData error : ' + err)
      return (err)
    }
  }

  // Get Data by Id
  static async getDataById (id) {
    try {
      const res = await axios.get(`${url}/${id}`)
      return res.data
    } catch (err) {
      console.log('DataService getData error : ' + err)
      return (err)
    }
  }

  // Create a Data
  static async insertData (body, entity) {
    return axios.post(`${url}/${entity}`, body)
  }

  // Update a Data
  // Called from FO DataEdit.vue with full data (including the _id)
  // Call BO then dataController.js to do a router.put
  static async updateData (body) {
    return axios.put(url, body)
  }

  // Delete a Data
  static async deleteData (id, entity) {
    console.log(`DataService > deleteData with ${entity} and id : ${id}`)
    return axios.delete(`${url}/${entity}/${id}`)
  }
}

export default DataService
