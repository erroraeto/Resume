// LIST DETAILS
let listDetail = document.querySelector('.list-details');
let listItems = document.querySelectorAll('.list-details > *');
let coverTitle = document.querySelector('.section__cover > .cover__title');
let cover = document.querySelector('.section__cover');

function onWindowResize() {
    // SOFT SKILLS: LIST
    let open = Array.from(listItems).find((item) => item.open == true);
    listDetail.style = `--comp-width: ${ open.clientWidth - parseFloat(getComputedStyle(open).paddingInline) * 2 }px`;
}

onWindowResize();
window.addEventListener( 'resize', onWindowResize );

Array.from(listItems).forEach((item) => {
    item.addEventListener( 'click', (event) => {
        if ( event.target.closest('details').open != true ) return;
        event.preventDefault();
    });
});

// GRID HEXAGON
let gridHex = document.querySelector('.grid-hexagon');
let gridHexWrapp = document.querySelector('.grid-hexagon__wrapper');
let gridHexItem = document.querySelectorAll('.grid-hexagon__item');

// let coverTitle = document.querySelector('.cover__title');

window.onload = () => {

    coverTitle.style = `--half:${coverTitle.clientWidth / 2}px`


    // GRID HEXAGONE
    gridHex.style.height = gridHex.style.width = gridHex.offsetParent.clientHeight + 'px';
    gridHexWrapp.style.height = gridHexWrapp.style.width = gridHex.clientWidth / 2 + 'px';
    gridHexWrapp.style.padding = gridHex.clientWidth / 2 + 'px';
    gridHexItem.forEach((item) => {
        item.style.height = item.style.width = item.offsetHeight + 'px';
        observer.observe(item);
    });

    circleCenter = {
        x: Math.abs(gridHex.clientWidth / 2 - gridHexWrapp.clientWidth / 2),
        y: Math.abs(gridHex.clientHeight / 2 - gridHexWrapp.clientHeight / 2),
    };
    circleRadius = Math.min(circleCenter.x, circleCenter.y);
    gridHex.scrollTo({ left: circleCenter.x, top: circleCenter.y, behavior: "smooth"});


};

// GRID HEXAGONE DRAGG
let isDown = false,
    startX,
    startY,
    circleRadius,
    circleCenter = {},
    initialMouseX,
    initialMouseY,
    initialElementX,
    initialElementY;

gridHexWrapp.addEventListener('mousedown', onClickGridHex);
gridHexWrapp.addEventListener('touchstart', onClickGridHex);

let lastTouch;

function onClickGridHex(e) {
    document.body.style = 'user-select: none';
    let dragBox = {
        left: Math.abs(gridHex.offsetLeft + gridHex.clientWidth / 2 - gridHex.scrollLeft),
        top: Math.abs(gridHex.offsetTop + gridHex.clientHeight / 2 - gridHex.scrollTop),
    };

    isDown = true;
    if (e.type == 'touchstart') {
        e.preventDefault();
        initialMouseX = e.touches[0].pageX - gridHex.offsetLeft;
        initialMouseY = e.touches[0].pageY - gridHex.offsetTop;
    } else {
        initialMouseX = e.pageX - gridHex.offsetLeft;
        initialMouseY = e.pageY - gridHex.offsetTop;
    }
    initialElementX = dragBox.left - gridHex.offsetLeft;
    initialElementY = dragBox.top - gridHex.offsetTop;

    window.addEventListener('mousemove', onMoveGridHex);
    window.addEventListener('touchmove', (e) => onMoveGridHex(e));
    ['mouseup', 'mouseleave'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );
    ['touchend', 'touchcancel'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );

};

function onMoveGridHex(e) {
    if (!isDown) return;
    document.body.style = '';

    let x,
        y;
    if (e.type == 'touchmove') {
        x = e.touches[0].pageX - gridHex.offsetLeft;
        y = e.touches[0].pageY - gridHex.offsetTop;
    } else {
        e.preventDefault();
        x = e.pageX - gridHex.offsetLeft;
        y = e.pageY - gridHex.offsetTop;
    }

    const dx = x - initialMouseX;
    const dy = y - initialMouseY;

    let newX = initialElementX - dx;
    let newY = initialElementY - dy;

    const distanceFromCenter = Math.sqrt(
        Math.pow(newX - circleCenter.x, 2) + Math.pow(newY - circleCenter.y, 2)
    );

    if (distanceFromCenter > circleRadius) {
        const angle = Math.atan2(newY - circleCenter.y, newX - circleCenter.x);
        newX = circleCenter.x + circleRadius * Math.cos(angle);
        newY = circleCenter.y + circleRadius * Math.sin(angle);
    }

    gridHex.scrollTo( newX, newY );

};

function onLeaveGridHex(e) {
    isDown = false;

    window.removeEventListener('mousemove', onMoveGridHex);
    window.removeEventListener('touchmove', (e) => onMoveGridHex(e));
    ['mouseup', 'mouseleave'].forEach( ev => window.removeEventListener( ev , onLeaveGridHex) );
    ['touchend', 'touchcancel'].forEach( ev => window.removeEventListener( ev , onLeaveGridHex) );
    gridHex.scrollTo({ left: circleCenter.x, top: circleCenter.y, behavior: "smooth"});
};

// GRID HEXAGONE ITEM TRANSLATE, SCALLABLE
function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
};

gridHex.addEventListener('scroll', bubble);

function bubble() {
    gridHexItem.forEach((item) => {

        let size = 0.5;
        let zoneStartX = (gridHex.scrollLeft + gridHex.clientWidth / 2) - gridHex.clientWidth / 8;
        let zoneEndX = zoneStartX + gridHex.clientWidth / 8 * 2;
        let itemCenterX = (item.offsetLeft + item.parentElement.offsetLeft) + item.offsetWidth / 2;

        let zoneStartY = (gridHex.scrollTop + gridHex.clientHeight / 2) - gridHex.clientHeight / 8;
        let zoneEndY = zoneStartY + gridHex.clientHeight / 8 * 2;
        let itemCenterY = (item.offsetTop + item.parentElement.offsetTop) + item.offsetHeight / 2;
        if (zoneStartX < itemCenterX && itemCenterX < zoneEndX && zoneStartY < itemCenterY && itemCenterY < zoneEndY) {
            size = 1;
        };

        let compStyles = item.getBoundingClientRect();
        let circleRadius = Math.abs(item.offsetWidth / 2 - compStyles.width / 2);
        let circleCenter = {
            x: circleRadius / 3,
            y: circleRadius / 3,
        };

        let newX = gridHex.scrollLeft + gridHex.clientWidth / 2 - item.offsetWidth / 2 - item.offsetLeft - item.parentElement.offsetLeft;
        let newY = gridHex.scrollTop + gridHex.clientHeight / 2 - item.offsetHeight / 2 - item.offsetTop - item.parentElement.offsetTop;

        const distanceFromCenter = Math.sqrt(
            Math.pow(newX - circleCenter.x, 2) + Math.pow(newY - circleCenter.y, 2)
        );

        if (distanceFromCenter > circleRadius) {
            const angle = Math.atan2(newY - circleCenter.y, newX - circleCenter.x);
            newX = circleCenter.x + circleRadius * Math.cos(angle);
            newY = circleCenter.y + circleRadius * Math.sin(angle);
        }

        item.style.transform = `translateX(${newX}px) translateY(${newY}px) scale(${size})`;
    });
};

const observer = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            entry.target.classList.add('hover')
        } else {
            entry.target.classList.remove('hover')
        }
    })
}, {
    root: gridHex,
    rootMargin: '-45%',
    threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
});