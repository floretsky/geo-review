const points = require('./points.json');
const clusterLayout = require('./cluster.hbs');

const init = () => {
    const myMap = new ymaps.Map('map', {
        center: [59.93, 30.31],
        zoom: 13,
        controls: ['zoomControl', 'fullscreenControl']
    });

    const clasterContentLayout = ymaps.templateLayoutFactory.createClass(clusterLayout());

    const clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons', // стили кластера
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        balloonLayout: 'islands#balloon', // переопределяем кастомный popup на стандартный
        clusterBalloonItemContentLayout: clasterContentLayout,
        clusterBalloonPanelMaxMapArea: 0, // не будет открываться в режиме панели
        clusterBalloonPagerSize: 5, // кол-во страниц
        groupByCoordinates: false, // если true то группирует только с одинаковыми координатами
        clusterDisableClickZoom: true, // отключаем зумирование при клике на кластер
        clusterHideIconOnBalloonOpen: false,
    });

    points.forEach(item => {
        const point = new ymaps.Placemark(item.coords, {
            address: item.address,
            review: item.review,
        }, {
            preset: 'islands#violetIcon'
        });

        clusterer.add(point);
    });

    myMap.geoObjects.add(clusterer);
}

export default init;