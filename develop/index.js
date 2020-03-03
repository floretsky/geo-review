require('@fortawesome/fontawesome-free/css/all.min.css');
import './styles/style.css';
import { loadMap } from './js/map';
import { navigateFromCarousel } from './js/navigate';

export let basicStorage = {
    items: []
};

if (localStorage.data) {
    basicStorage = JSON.parse(localStorage.data);
}

export let placemarksCoords = {
    items: []
};

ymaps.ready(function () {
    loadMap();
    navigateFromCarousel();
})