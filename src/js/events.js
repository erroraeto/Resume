function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

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

window.onload = () => {


    // GRID HEXAGONE
    gridHex.style.height = gridHex.style.width = gridHex.offsetParent.clientHeight + 'px';
    gridHexWrapp.style.height = gridHexWrapp.style.width = gridHex.clientWidth / 2 + 'px';
    // gridHexWrapp.style.paddingBlock = gridHex.clientHeight / 2 + 'px';
    // gridHexWrapp.style.paddingInline = gridHex.clientWidth / 2 + 'px';
    gridHexWrapp.style.padding = gridHex.clientWidth / 2 + 'px';

    // circleRadius = gridHex.clientWidth / 2 - gridHexWrapp.clientWidth / 2;
    // circleCenter = {
    //     x: circleRadius,
    //     y: circleRadius,
    // };
    circleCenter = {
        x: Math.abs(gridHex.clientWidth / 2 - gridHexWrapp.clientWidth / 2),
        y: Math.abs(gridHex.clientHeight / 2 - gridHexWrapp.clientHeight / 2),
    };
    circleRadius = Math.min(circleCenter.x, circleCenter.y);
    // gridHexWrapp.style.margin = circleRadius * 2 + 'px';
    // gridHexWrapp.scrollIntoView({ block: "center", inline: "center", container: "nearest" });
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

let lastTouch;
gridHexWrapp.addEventListener( "touchstart", (ev) => {
    let now = new Date().getTime();
    let touchDelay = now - lastTouch;
    if ( (touchDelay < 240) && (touchDelay > 60) ) {
        onClickGridHex(ev);
    }
    lastTouch = new Date().getTime();
}, false );

function onClickGridHex(e) {
    document.body.style = 'user-select: none';
    let dragBox = {
        left: Math.abs(gridHex.offsetLeft + gridHex.clientWidth / 2 - gridHex.scrollLeft),
        top: Math.abs(gridHex.offsetTop + gridHex.clientHeight / 2 - gridHex.scrollTop),
        // left: gridHex.offsetLeft + gridHexWrapp.offsetLeft - gridHex.scrollLeft,
        // top: gridHex.offsetTop + gridHexWrapp.offsetTop - gridHex.scrollTop,
    };

    isDown = true;
    if (e.type == 'touchstart') {
        initialMouseX = e.touches[0].pageX - gridHex.offsetLeft;
        initialMouseY = e.touches[0].pageY - gridHex.offsetTop;
        document.children[0].style = 'overflow: hidden; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none';
    } else {
        initialMouseX = e.pageX - gridHex.offsetLeft;
        initialMouseY = e.pageY - gridHex.offsetTop;
    }
    initialElementX = dragBox.left - gridHex.offsetLeft;
    initialElementY = dragBox.top - gridHex.offsetTop;

    window.addEventListener('mousemove', onMoveGridHex);
    window.addEventListener('touchmove', (e) => onMoveGridHex(e));
    // window.addEventListener('pointermove', onMoveGridHex);
    ['mouseup', 'mouseleave'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );
    ['touchend', 'touchcancel'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );

};

function onMoveGridHex(e) {
    if (!isDown) return;
    // e.preventDefault();
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

    // const x = e.pageX - gridHex.offsetLeft;
    // const y = e.pageY - gridHex.offsetTop;
    
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
    // gridHexWrapp.scrollIntoView({ behavior: "smooth", block: "center", inline: "center", container: "nearest" })
    // gridHex.scrollTo({ left: circleRadius, top: circleRadius, behavior: "smooth"});
    gridHex.scrollTo({ left: circleCenter.x, top: circleCenter.y, behavior: "smooth"});

    document.children[0].style = '';
};

// GRID HEXAGONE SCALLABLE
// const observer = new IntersectionObserver( (entries) => {
//     entries.forEach((entry) => {
//         // if (entry.isIntersecting) {
//         if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
//             entry.target.style.scale = entry.intersectionRatio;
//             entry.target.classList.add('hover')
//             if (entry.intersectionRatio < 0.99) {
//                 entry.target.classList.remove('hover')
//             }
//         } else {
//             entry.target.style.scale = `0.3`;
//             entry.target.classList.remove('hover')
//         }
//     })
// }, {
//     root: gridHex,
//     rootMargin: '-37%',
//     threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
// });

// gridHexItem.forEach((item) => {
//     observer.observe(item);
// });




function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
};

gridHex.addEventListener('scroll', () => {
    gridHexItem.forEach((item) => {
        let compStyles = item.getBoundingClientRect();

        // let newX = gridHex.scrollLeft - (gridHexWrapp.offsetLeft / 2);
        // let newY = gridHex.scrollTop - (gridHexWrapp.offsetTop / 2);

        // const containerMinX = -item.offsetWidth / 2;
        // const containerMinY = -item.offsetHeight / 2;
        // const containerMaxX = item.offsetWidth / 2;
        // const containerMaxY = item.offsetHeight / 2;

        // let compStyles = window.getComputedStyle(item);
        const containerMinX = compStyles.width / 2 - item.offsetWidth / 2;
        const containerMinY = compStyles.height / 2 - item.offsetHeight / 2;
        const containerMaxX = item.offsetWidth / 2 - compStyles.width / 2;
        const containerMaxY = item.offsetHeight / 2 - compStyles.height / 2;

        // let newX = (gridHexWrapp.clientWidth / 1.57) - gridHex.scrollLeft - (item.offsetLeft + containerMaxX);
        // let newY = (gridHexWrapp.clientHeight / 1.57) - gridHex.scrollTop - (item.offsetTop + containerMaxY);
        // let newX = gridHexWrapp.clientWidth / 2 - gridHex.clientWidth / 2 - gridHex.scrollLeft;
        // let newY = gridHexWrapp.clientHeight / 2 - gridHex.clientHeight / 2 - gridHex.scrollTop;
        let newX = gridHex.scrollLeft + gridHex.clientWidth / 2 - item.offsetWidth / 2 - item.offsetLeft;
        let newY = gridHex.scrollTop + gridHex.clientHeight / 2 - item.offsetHeight / 2 - item.offsetTop;
        let circleRadius = item.offsetWidth / 2 - compStyles.width / 2;
        let circleCenter = {
            x: circleRadius,
            y: circleRadius,
        };

        const distanceFromCenter = Math.sqrt(
            Math.pow(newX - circleCenter.x, 2) + Math.pow(newY - circleCenter.y, 2)
        );

        if (distanceFromCenter > circleRadius) {
            const angle = Math.atan2(newY - circleCenter.y, newX - circleCenter.x);
            newX = circleCenter.x + circleRadius * Math.cos(angle);
            newY = circleCenter.y + circleRadius * Math.sin(angle);
        }







        let sizeX = item.offsetLeft + compStyles.width / 2 - newX;
        let sizeY = item.offsetTop + compStyles.height / 2 - newY;
        let cenX = newX / sizeX;
        let cenY = newY / sizeY;
        let size = Math.min( cenX, cenY )

        // item.style.transform = `translateX(${clamp(containerMinX, newX, containerMaxX)}px) translateY(${clamp(containerMinY, newY, containerMaxY)}px) scale(${clamp( 0.1, size, 1 )})`;
        item.style.transform = `translateX(${clamp(containerMinX, newX, containerMaxX)}px) translateY(${clamp(containerMinY, newY, containerMaxY)}px) scale(0.5)`;
        // item.style.transform = `translateX(${newX}px) translateY(${newY}px) scale(0.5)`;
    });
});


















//  let newX = e.pageX - dragOffsetX;
// let newY = e.pageY - dragOffsetY;

// if (newX < 0) newX = 0;
// if (newY < 0) newY = 0;
// if (newX + draggableWidth > containerWidth) newX = containerWidth - draggableWidth;
// if (newY + draggableHeight > containerHeight) newY = containerHeight - draggableHeight;

// draggableElement.style.left = newX + 'px';
// draggableElement.style.top = newY + 'px';