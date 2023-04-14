const baseURL = import.meta.env.VITE_BASEURL
const url = baseURL + 'email'
import axios from "axios";

class EmailService {
    // Send Email
    static async sendEmail (to) {
        console.log('EmailService > sendEmail > to : ', to);
        try {
            const data = { "to": to };
            const res = await axios.post(url, data)
            //console.log('EmailService > sendEmail > res : ', res);
            if (res.status = 200) {
                return res;
            } else {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }
        } catch (err) {
            console.log('EmailService > sendEmail > catch(err) : ', err);
        }
    }
}

export default EmailService