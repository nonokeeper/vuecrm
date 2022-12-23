import axios from 'axios'

const baseURL = import.meta.env.VITE_BASEURL
const url = baseURL + 'login'

console.log('url : '+url);

class LoginService {

  // Create a Collection
  static async connect (credentials) {
    //console.log('CollectionService createCollection');
    try {
      const res = await axios.post(`${url}`, credentials)
      return res.data
    } catch (err) {
      console.log('LoginService connect error : ' + err)
      return (err)
    }
  }

}

export default LoginService