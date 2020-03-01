export function geoCodeByCoords(coords) {
    ymaps.geocode(coords).then(function (res) {
        var names = [];

        res.geoObjects.each(function (obj) {
            names.push(obj.properties.get('name'));
        });

        return names[0];
    });
};