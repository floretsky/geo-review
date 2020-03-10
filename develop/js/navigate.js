import { basicStorage } from '..';
import { myMap } from './map.js';

export function navigateFromCarousel() {
    document.addEventListener('click', function(e) {
        let elem = e.target;

        if (elem.classList.contains('ballon__link')) {
            e.preventDefault;
            
            let coords = elem.dataset.coord.split(',');
            let myReverseGeocoder = ymaps.geocode(coords);

            myReverseGeocoder.then(
                function () {
                    const reviewsArr = [];
                    const address = elem.dataset.address;      

                    for (const item of basicStorage) {
                        if (address === item.properties.address) {
                            reviewsArr.push(...item.reviews);
                        }
                    }

                    let point = { 
                        properties: {
                            address: address,
                            coords: coords
                        }, reviews: reviewsArr
                    };

                    return point;
                }
            ).then(point => {
                myMap.balloon.open(point.properties.coords, {
                    properties: {
                        address: point.properties.address,
                        coords: point.properties.coords
                    },
                    reviews: point.reviews
                }); 
            })
        }
    })
}