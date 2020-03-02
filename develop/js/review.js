const popupTemplate = require('../templates/popup.hbs');

import { myMap } from './map.js';
import { clusterer } from './map.js';
import { placemarksCoords } from '../index.js';
import { basicStorage } from '../index.js';

export function createReview(point) {
    const name = document.querySelector('#review-name');
    const textReview = document.querySelector('#review');
    const popupBlock = document.querySelector('.popup');

    let date = new Date();
    let dateStr = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    let newReview = {
        name: name.value,
        date: dateStr,
        review: textReview.value
    }

    if (name.value && review.value) {                     
        let flag = false;
        if (basicStorage.items.length) {
            for (const item of basicStorage.items) {
                if (item.address == point.address) {
                    item.reviews.push(newReview);
                    point.reviews = item.reviews;
                    flag = true;
                    break;
                }
            }
        }
            
        if (flag == false) {
            point.reviews = [];
            point.reviews.push(newReview);
            basicStorage.items.push(point);
        }                            
    } else {
        alert('Заполните все поля, чтобы добавить отзыв')
    }

    myMap.balloon.setData({
        address: point.address,
        reviews: point.reviews
    });
    
    placemarksCoords.items.push(point.coords);

    //let placemark = addPlacemark(point, newReview);

    /* if (placemark) {
        clusterer.add(placemark); 
    } */

    localStorage.data = JSON.stringify({
        items: basicStorage.items
    });
}