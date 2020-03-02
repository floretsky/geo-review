import { basicStorage } from '../index.js';
import { placemarksCoords } from '../index.js';
import { clusterer } from './map.js';
import { myMap } from './map.js';

export function getPlacemarks() {
    for (const item of basicStorage.items) {
        for (const review of item.reviews) {
            placemarksCoords.items.push(item.coords);
            
            let placemark = addPlacemark(item, review);

            if (placemark) {
                clusterer.add(placemark); 
            }
        }
    }
}

export function addPlacemark(point, newReview) {
    if (placemarksCoords.items.length) {
        let placemark = new ymaps.Placemark(
            placemarksCoords.items[placemarksCoords.items.length - 1], {
                openBalloonOnClick: false,
                balloonContentHeader: newReview.place,
                balloonContentLink: point.address,
                balloonContentBody: newReview.textReview,
                balloonContentFooter: newReview.date,
                balloonContentCoords: point.coords,
            }, 
            { 
                preset: 'islands#darkOrangeIcon'
            }
        );

        placemark.events.add('click', function () { 
            myMap.balloon.setData({
                address: point.address,
                reviews: point.reviews
            });
        })

        return placemark;
    }
    
    return 
}   