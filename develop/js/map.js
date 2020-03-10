import { basicStorage } from '..';
import { createReview } from './review';
import { getPlacemarks } from './placemark';
import popupTemplate from '../templates/popup.hbs'

export let clusterer;
export let myMap;

export function loadMap() {
    let addReview, closeButton;
    const balloonLayout = ymaps.templateLayoutFactory.createClass(popupTemplate(), {
        build: function () {
            balloonLayout.superclass.build.call(this);
            const popupBlock = document.querySelector('.popup');

            addReview = popupBlock.querySelector('.add-review');
            closeButton = popupBlock.querySelector('.popup__close');

            this._element = this.getParentElement().querySelector('.popup');
            this.applyElementOffset();
            
            addReview.addEventListener('click', onAddReviewClick);
            closeButton.addEventListener('click', () => {
                this.closeBalloon();
            });
        },
        clear: function () {
            balloonLayout.superclass.clear.call(this);

            addReview.removeEventListener('click', onAddReviewClick);
            closeButton.removeEventListener('click', () => {
                this.closeBalloon();
            });
        },
        closeBalloon: function () {
            this.events.fire('userclose');
        },
        applyElementOffset: function () {
            Object.assign(this._element.style, {
                left: (this._element.offsetWidth) + 'px',
                top: (this._element.offsetHeight / 2) + 'px'
            });
        },
        getShape: function () {
            balloonLayout.superclass.getShape.call(this);

            if (this._element) {
                var style = getComputedStyle(this._element);
                var position = {
                    left: parseFloat(style.left),
                    top: parseFloat(style.top),
                };
        
                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                    [position.left, position.top], [
                        position.left + this._element.offsetWidth,
                        position.top + this._element.offsetHeight
                    ]
                ]));
            }
        }
    })

    myMap = new ymaps.Map('map', {
        center: [59.93, 30.31],
        zoom: 13,
        controls: ['zoomControl', 'fullscreenControl']
    }, { balloonLayout });
    
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        `<div class=ballon__content>
            <h2 class=ballon__header>{{ properties.balloonContentHeader|raw }}</h2>
            <div class=ballon__body>
            <a href="#" class=ballon__link data-coord="{{ properties.balloonContentCoords|raw }}">{{ properties.balloonContentLink|raw }}</a>
            <div class=ballon__review>
                <b>{{ properties.balloonContentReviewName|raw }}:</b> {{ properties.balloonContentReview|raw }}
            </div>
            <div class=ballon__footer>{{ properties.balloonContentFooter|raw }}</div>
            </div>
        </div>`
    );

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

    if (basicStorage.length) {
        getPlacemarks();
    }

    myMap.events.add('click', e => {
        const coords = e.get('coords');

        ymaps.geocode(coords).then(function (res) {

            try {
                let newContent = `${res.geoObjects.get(0).properties.get('description')}, ${res.geoObjects.get(0).properties.get('name')}`;

                myMap.balloon.open(coords, {
                    properties: {
                        address: newContent,
                        coords: coords
                    }
                }); 
            } catch (e) {
                alert('Не удалось определить адрес.');
            }
        });
    });
}

function onAddReviewClick(e) {
    e.preventDefault();
            
    let data = myMap.balloon.getData().properties;
    let address, coords;

    // Проверка на то, существует ли уже объект от яндекса

    data.address ? address = data.address : address = data._data.address;
    data.coords ? coords = data.coords : coords = data._data.point.reverse();

    let point = {
        properties: {
            address: address,
            coords: coords
        }
    }; 

    createReview(point);
}