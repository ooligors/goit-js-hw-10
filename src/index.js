import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list')
}


refs.input.addEventListener('input', debounce(dataInput, DEBOUNCE_DELAY))

function dataInput(e) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    const inputValue = (e.target.value).trim().toLowerCase();
    if (inputValue === '') {
        return;
    }

    fetchCountries(inputValue)
        .then(data => {
            console.log('data', data);

            if (data.status === 404) {
                return Notify.failure('Oops, there is no country with that name');
            }

            if (data.length > 10) {
                return Notify.info('Too many matches, please enter a more specific country');
            }
            if (data.length > 1) {
                return renderCountryList(data);
            }

            if (data.length === 1) {
                return renderCountry(data[0]);
            }


        })
        .catch(err => {
            console.log("catch >>", err);
        });


}


function renderCountry(dataCountry) {

    const { flags: { svg }, name: { official }, capital, population, languages } = dataCountry;
    const markup = () => {
        const language = Object.values(languages);
        return `
        <div div class="card" >
     <div class="wrapper">
          <img class="flag" src="${svg}" alt="flag of country"  width=90px>
           <h1 class="country">${official} </h1>
      </div>
      <p class="capital">Capital: ${capital}</p>
       <p class="population">Population: ${population}</p>
       <p class="language">Language: ${language}</p>
         </div>
        `}
    refs.countryInfo.innerHTML = markup();
}

function renderCountryList(dataCountryList) {
    dataCountryList.forEach(country => {
        const li = document.createElement('li');
        li.innerHTML = `
        <h3>
            <img src="${country.flags.svg}" alt="flag of country" width="30">
            ${country.name.official}
        </h3>`;
        refs.countryList.appendChild(li);
    });
}
