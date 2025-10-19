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
let gridItem = document.querySelectorAll('.grid-hexagon__item');

let gridHex = document.querySelector('.grid-hexagon');
let gridHexWrapp = document.querySelector('.grid-hexagon__wrapper');
let gridHexItem = document.querySelectorAll('.grid-hexagon__item');

window.onload = () => {


    // GRID HEXAGONE
    circleRadius = gridHex.clientWidth / 2 - gridHexWrapp.clientWidth / 2;
    circleCenter = {
        x: circleRadius,
        y: circleRadius,
    };
    gridHexWrapp.style.margin = circleRadius * 2 + 'px';
    gridHexWrapp.scrollIntoView({ block: "center", inline: "center", container: "nearest" });


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
    if ( (touchDelay < 180) && (touchDelay > 0) ) {
        onClickGridHex(ev);
    }
    lastTouch = new Date().getTime();
}, false );

function onClickGridHex(e) {
    document.body.style = 'user-select: none';
    let dragBox = {
        left: gridHex.offsetLeft + gridHexWrapp.offsetLeft - gridHex.scrollLeft,
        top: gridHex.offsetTop + gridHexWrapp.offsetTop - gridHex.scrollTop,
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
    window.addEventListener('pointermove', onMoveGridHex);
    ['mouseup', 'mouseleave'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );
    ['touchend', 'touchcancel'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );

};

function onMoveGridHex(e) {
    if (!isDown) return;
    e.preventDefault();
    document.body.style = '';

    const x = e.pageX - gridHex.offsetLeft;
    const y = e.pageY - gridHex.offsetTop;
    
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
    gridHexWrapp.scrollIntoView({ behavior: "smooth", block: "center", inline: "center", container: "nearest" })
    
    document.children[0].style = '';
};

// GRID HEXAGONE SCALLABLE
const observer = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        // if (entry.isIntersecting) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            entry.target.style.scale = entry.intersectionRatio;
            entry.target.classList.add('hover')
            if (entry.intersectionRatio < 0.99) {
                entry.target.classList.remove('hover')
            }
        } else {
            entry.target.style.scale = `0.3`;
            entry.target.classList.remove('hover')
        }
    })
}, {
    root: gridHex,
    rootMargin: '-37%',
    threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
});

gridHexItem.forEach((item) => {
    observer.observe(item);
});