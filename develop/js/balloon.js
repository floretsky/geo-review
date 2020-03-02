import popupTemplate from '../templates/popup.hbs';
import { myStorage } from '../index.js';

export function showForm(point) {
    const popupBlock = document.querySelector('.popup');

    /*let reviewsArr = [];

    for (const item of myStorage.items) {                       
        if (item.address == point.address) {
            reviewsArr.push(...item.reviews);
        }
    }

    point.reviews = reviewsArr;

    reviewBlock.style.left = point.position[0] + 'px';
    reviewBlock.style.top = point.position[1] + 'px';             
    reviewBlock.classList.remove('visually-hidden');*/

    const htmlReview = popupTemplate(point);
    reviewBlock.innerHTML = htmlReview;
    
    return point;
}