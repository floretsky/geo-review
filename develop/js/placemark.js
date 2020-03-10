import { basicStorage } from '..';
import { placemarksCoords } from '..';
import { myMap } from './map.js';
import { clusterer } from './map.js';

export function getPlacemarks() {
    for (const item of basicStorage) {
        for (const review of item.reviews) {
            placemarksCoords.push(item.properties.coords);
            
            let placemark = addPlacemark(item, review);

            if (placemark) {
                clusterer.add(placemark); 
            }
        }
    }
}

export function addPlacemark(point, newReview) {
    if (placemarksCoords.length) {
        let placemark = new ymaps.Placemark(
            placemarksCoords[placemarksCoords.length - 1], {
                balloonContentHeader: newReview.place,
                balloonContentLink: point.properties.address,
                balloonContentReviewName: newReview.name,
                balloonContentReview: newReview.review,
                balloonContentFooter: newReview.date,
                balloonContentCoords: point.properties.coords
            }, 
            {
                openBalloonOnClick: false,
                preset: 'islands#violetIcon'
            }
        );

        placemark.events.add('click', function () { 
            myMap.balloon.open(point.properties.coords, {
                properties: {
                    address: point.properties.address,
                    coords: point.properties.coords
                },
                reviews: point.reviews
            }); 
        }) 

        return placemark;
    }
    
    return 
}   