const popupTemplate = require('../templates/popup.hbs');
const clusterLayout = require('../templates/cluster.hbs');

import { createReview } from './review';
import { getPlacemarks } from './placemark';
import { basicStorage } from '..';

export let clusterer = '';
export let myMap;

export function loadMap() {

    ymaps.ready(init);

    function init() {

        const balloonLayout = ymaps.templateLayoutFactory.createClass(popupTemplate(), {
            build: function () {
                balloonLayout.superclass.build.call(this);
                const popupBlock = document.querySelector('.popup');
                const closeButton = popupBlock.querySelector('.popup__close');
                const addReview = popupBlock.querySelector('.add-review');
                
                closeButton.addEventListener('click', () => {
                    this.closeBalloon();
                })

                addReview.addEventListener('click', (e) => {
                    e.preventDefault();

                    let data = myMap.balloon.getData();

                    let point = {
                        address: data.address,
                        coords:  data.coords,
                        position: data.position
                    }; 

                    createReview(point);
                })

            },
            clear: function () {
                balloonLayout.superclass.clear.call(this);
            },
            closeBalloon: function () {
                this.events.fire('userclose');
            }
        })

        const clusterContentLayout = ymaps.templateLayoutFactory.createClass(clusterLayout());

        myMap = new ymaps.Map('map', {
            center: [59.93, 30.31],
            zoom: 13,
            controls: ['zoomControl', 'fullscreenControl']
        }, { balloonLayout });
        
        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(clusterContentLayout);

        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons', // стили кластера
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            balloonLayout: 'islands#balloon', // переопределяем кастомный popup на стандартный
            clusterBalloonItemContentLayout: customItemContentLayout,
            clusterBalloonPanelMaxMapArea: 0, // не будет открываться в режиме панели
            clusterBalloonPagerSize: 5, // кол-во страниц
            groupByCoordinates: false, // если true то группирует только с одинаковыми координатами
            clusterDisableClickZoom: true, // отключаем зумирование при клике на кластер
            clusterHideIconOnBalloonOpen: false,
        });

        myMap.geoObjects.add(clusterer);

        if (basicStorage.items.length) {
            getPlacemarks();
        }

        myMap.events.add('click', e => {
            const coords = e.get('coords'),
                position = e.get('position');

            ymaps.geocode(coords).then(function (res) {
                var newContent = res.geoObjects.get(0) ?
                        res.geoObjects.get(0).properties.get('name') :
                        'Не удалось определить адрес.';

                myMap.balloon.open(coords, {
                    address: newContent,
                    coords: coords,
                    position: position
                });
            });
        });
    }
}