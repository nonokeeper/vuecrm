import axios from 'axios'

const baseURL = import.meta.env.VITE_BASEURL
const url = baseURL + 'collections'

console.log('url : '+url);

class CollectionService {

  // Create a Collection
  static async createCollection (name) {
    if (name !== '') {
      try {
        const res = await axios.post(`${url}/${name}`)
        console.log('CollectionService createCollection OK');
        return res.data
      } catch (err) {
        console.log('CollectionService createCollection error : ' + err)
        return (err)
      }
    } else console.log('CollectionService createCollection KO');
  }

  // Modify the collection name
  static async majCollection (name, field, label) {
    console.log('CollectionService majCollection');
    var body = {}
    body.field = field
    body.label = label
    body.collection = name
    console.log('body :', body);
    try {
      const res = await axios.post(`${url}/meta/rename`, body)
      return res.data
    } catch (err) {
      console.log('CollectionService majCollection error : ' + err)
      return (err)
    }
  }

  // Delete one field for the collection name
  static async deleteField (name, field) {
    console.log('CollectionService majCollection');
    var body = {}
    body.field = field
    body.collection = name
    console.log('body :', body);
    try {
      const res = await axios.post(`${url}/meta/delete`, body)
      return res.data
    } catch (err) {
      console.log('CollectionService majCollection error : ' + err)
      return (err)
    }
  }

  // Add one field to the collection name
  static async addFieldCollection (name, field, label, type, group, required) {
    console.log('CollectionService addFieldCollection');
    var body = {}
    body.field = field
    body.label = label
    body.type = type
    body.group = group
    body.required = required
    body.collection = name
    console.log('body :', body);
    try {
      const res = await axios.post(`${url}/meta/add`, body)
      return res.data
    } catch (err) {
      console.log('CollectionService addFieldCollection error : ' + err)
      return (err)
    }
  }

  // Get Collection Infos
  static async getCollectionInfos (name) {
    console.log('CollectionService getCollectionInfos name = ', name);
    try {
      const res = await axios.get(`${url}/infos/${name}`)
      return res.data
    } catch (err) {
      console.log('CollectionService getCollections error : ' + err)
      return (err)
    }
  }

  // Search Collections
  static async findCollections (name) {
    if (name == '' || name == undefined)
      try {
        const res = await axios.get(url)
        return res.data
      } catch (err) {
        console.log('CollectionService findCollections error : ' + err)
        return (err)
      }
    else
      try {
        const res = await axios.get(`${url}/${name}`)
        return res.data
      } catch (err) {
        console.log('CollectionService findCollections error : ' + err)
        return (err)
      }
  }

  // Drop a Collection
  static async deleteCollection (name) {
    //console.log('CollectionService deleteCollection');
    try {
      const res = await axios.delete(`${url}/${name}`)
      return res.data
    } catch (err) {
      console.log('CollectionService deleteCollection error : ' + err)
      return (err)
    }
  }

}

export default CollectionService