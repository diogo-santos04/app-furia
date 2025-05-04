import axios from 'axios'

const api = axios.create({
    baseURL: 'https://app-furia.onrender.com/api'
})

export { api }