import axios from 'axios';

const API_KEY = '4823621-792051e21e56534e6ae2e472f';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, perPage = 40) {
  const searchParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  };
  const response = await axios.get('', { params: searchParams });
  return response.data;
}