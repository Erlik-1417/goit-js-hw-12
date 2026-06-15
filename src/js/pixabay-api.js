import axios from 'axios';

const API_KEY = '56323626-86daf2d15d21cca2bf86958bc';
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
