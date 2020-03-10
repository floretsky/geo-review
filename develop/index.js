require('@fortawesome/fontawesome-free/css/all.min.css');
import './styles/style.css';
import { loadMap } from './js/map';
import { navigateFromCarousel } from './js/navigate';

export let basicStorage = [];

if (localStorage.data) {
    basicStorage = JSON.parse(localStorage.data);
}

export let placemarksCoords = [];

ymaps.ready(function () {
    loadMap();
    navigateFromCarousel();
})