require('@fortawesome/fontawesome-free/css/all.min.css');
import './styles/style.css';
import { loadMap } from './js/map';
import { getPlacemarks } from './js/placemark';

export let basicStorage = {
    items: []
};

if (localStorage.data) {
    basicStorage = JSON.parse(localStorage.data);
}

export let placemarksCoords = {
    items: []
};

loadMap();
getPlacemarks();