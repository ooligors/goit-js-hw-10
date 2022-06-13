const API_URL = 'https://restcountries.com/v3.1';

export function fetchCountries(enterCountry) {
    const url = `${API_URL}/name/${enterCountry}?fields=name,capital,population,flags,languages`;
    return fetch(url)
        .then(response => response.json())
}