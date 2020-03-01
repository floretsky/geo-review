import { geoCodeByCoords } from './geocode.js';

const popupTpl = require('../templates/popup.hbs');


const init = () => {
    const balloonLayout = ymaps.templateLayoutFactory.createClass(popupTpl(), {
        build: function () {
            balloonLayout.superclass.build.call(this);
            const closeButton = document.querySelector('.popup__close');

            closeButton.addEventListener('click', () => {
                this.closeBalloon();
            })
        },
        clear: function () {
            balloonLayout.superclass.clear.call(this);
        },
        closeBalloon: function () {
            this.events.fire('userclose');
        }
    })
    
    const myMap = new ymaps.Map('map', {
        center: [59.93, 30.31],
        zoom: 13,
        controls: ['zoomControl', 'fullscreenControl']
    }, { balloonLayout });

    myMap.events.add('click', e => {
        const coords = e.get('coordPosition');
        var names = [];
        ymaps.geocode(coords).then(function (res) {

            res.geoObjects.each(function (obj) {
                names.push(obj.properties.get('name'));
            });
        });

        myMap.balloon.open(coords, {
            properties: {
                address: names[0],
            }
        });
    });
}

export default init;