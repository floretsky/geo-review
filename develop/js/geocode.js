export function geoCodeByCoords(coords) {
    return ymaps.geocode(coords).then(function (res) {
       // let position = e.get('domEvent').get('position');
        let nearest = res.geoObjects.get(0);  
                
        /* let point = {
            address: `${nearest.properties.get('description')}, ${nearest.properties.get('name')}`,
            coords: coords,
            position: formPosition(position)
        }; */

        return `${nearest.properties._data.description}, ${nearest.properties._data.name}`; 
        }
    )
}