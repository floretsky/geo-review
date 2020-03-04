import { basicStorage } from '..';
import { placemarksCoords } from '..';
import { myMap } from './map.js';
import { clusterer } from './map.js';
import { addPlacemark } from './placemark.js';

export function createReview(point) {
    const name = document.querySelector('#review-name');
    const place = document.querySelector('#review-place');
    const textReview = document.querySelector('#review');

    let date = new Date();
    let dateStr = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    let newReview = {
        name: name.value,
        place: place.value,
        date: dateStr,
        review: textReview.value
    }

    if (name.value && review.value && place.value) {                     
        let flag = false;
        
        if (basicStorage.items.length) {
            for (let item of basicStorage.items) {
                if (item.properties.address == point.properties.address) {
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

    placemarksCoords.items.push(point.properties.coords);

    let placemark = addPlacemark(point, newReview);

    if (placemark) {
        clusterer.add(placemark); 
    } 

    if (myMap.balloon.isOpen()) {
        myMap.balloon.open(point.properties.coords, {
            properties: {
                address: point.properties.address,
                coords: point.properties.coords,
            }, reviews: point.reviews
        });
    }

    localStorage.data = JSON.stringify({
        items: basicStorage.items
    });
}