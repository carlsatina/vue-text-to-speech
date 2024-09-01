import { ref } from 'vue'
import axios from "axios"

const getAllWords = async () => {
    const response = ref (null)

    try {
        response.value = await axios.get(process.env.VUE_APP_JSON_SERVER + '/data')
    } catch (err) {
        console.log('getAllWords: ', err)
    }

    return response.value
}

export default getAllWords