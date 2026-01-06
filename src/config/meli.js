import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const meliApi = axios.create({
    baseURL: 'https://api.mercadolibre.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default meliApi;