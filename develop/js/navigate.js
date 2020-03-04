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
                function (res) {
                    let nearest = res.geoObjects.get(0);
                    const reviewsArr = [];
                    const address = nearest.properties.get('name');
                    
                    for (const item of basicStorage.items) {                       
                        if (item.properties.address === address) {
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