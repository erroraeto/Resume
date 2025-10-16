function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// SCROLLBAR
// let scrollbar = document.querySelector('.scrollbar'),
//     thumb = document.querySelector('.scrollbar__thumb'),
//     // body = document.querySelector('.body'),
//     thumbSelect = true;

// body.addEventListener('scroll', thumbPosition);
// scrollbar.addEventListener('scroll', thumbPosition);

// async function thumbPosition() {
//     // thumb.style.setProperty( "opacity", 1 );
//     // thumb.style.setProperty( "width", 'calc( 100% + 4px )' );
//     let scrollThumbPos = ( body.offsetHeight * body.scrollTop ) / body.scrollHeight;
//     scrollbar.style.setProperty( "--scroll-y", `${scrollThumbPos}px` );
//     await sleep(2000);
//     // thumb.style.removeProperty("opacity");
//     // thumb.style.removeProperty("width");
// };


// let pointerIsDown,
// pointerStartY,
// pointerSnap = [],
// pointerScrollTop;

// thumb.addEventListener('mousedown', (event) => {

//     document.body.style = 'user-select: none';
//     pointerIsDown = true;
//     pointerStartY = event.clientY;
//     pointerScrollTop = body.scrollTop;
//     thumb.style.setProperty( "width", 'calc( 100% + 4px )' );
//     thumb.style.setProperty( "opacity", 1 );

//     document.onmousemove = (event) => {
//         if (pointerIsDown) {
//             const y = event.clientY;
//             const walkY = (y - pointerStartY) * body.scrollHeight / body.offsetHeight;
//             body.classList.add('body-scrolling');
//             body.scrollTop = pointerScrollTop + walkY;
//         }
//     };

//     document.onmouseup = () => {
//         document.body.style = '';
//         pointerIsDown = false;
//         thumb.style.removeProperty("width");
//         thumb.style.removeProperty("opacity");
//     };
// });

// LIST DETAILS
let listDetail = document.querySelector('.list-details');
let listItems = document.querySelectorAll('.list-details > *');
let coverTitle = document.querySelector('.section__cover > .cover__title');
let cover = document.querySelector('.section__cover');

function onWindowResize() {

    // SCROLLBAR: HEIGHT
    // scrollbar.style.setProperty("--scrollbar-height", `${body.offsetHeight / body.children.length - parseFloat(getComputedStyle(scrollbar).marginBlock) * 2 - 2}px`);

    // COVER: WIDTH
    // cover.style.width = `${coverTitle.clientWidth}px`

    // SOFT SKILLS: LIST
    let open = Array.from(listItems).find((item) => item.open == true);
    listDetail.style = `--comp-width: ${ open.clientWidth - parseFloat(getComputedStyle(open).paddingInline) * 2 }px`;
}

onWindowResize();
window.addEventListener( 'resize', onWindowResize );

Array.from(listItems).forEach((item) => {
    // item.addEventListener( 'mouseover', selectItem );
    // item.addEventListener( 'click', (event) => event.preventDefault());
    item.addEventListener( 'click', (event) => {
        if ( event.target.closest('details').open != true ) return;
        event.preventDefault();
    });
});

// function selectItem(event) {
//     if (event.target.closest('details').open == true) return;
//     event.target.closest('details').open = true;
// };

// GRID HEXAGON
let gridItem = document.querySelectorAll('.grid-hexagon__item');

// Array.from(gridItem).forEach((item) => {
//     item.addEventListener( 'mouseover', (event) => {
//         if (event.target.className != 'grid-hexagon__item') return;
//         // event.target.querySelector('#popover').showPopover();
//         event.target.querySelector('.grid-hexagon__dialog').show();
//     });
//     item.addEventListener( 'mouseout', (event) => {
//         // event.target.querySelector('#popover').hidePopover();
//         event.target.querySelector('.grid-hexagon__dialog').close();
//     });
// });


// function selectItem(event) {
//     if (event.target.closest('details').open == true) return;
//     event.target.closest('details').open = true;
// };

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
    circleCenter = {};


let initialMouseX, initialMouseY;
let initialElementX, initialElementY;

gridHexWrapp.addEventListener('mousedown', (e) => {
    document.body.style = 'user-select: none';
    let dragBox = gridHexWrapp.getBoundingClientRect();

    isDown = true;
    // initialMouseX = e.pageX - gridHex.offsetLeft;
    // initialMouseY = e.pageY - gridHex.offsetTop;
    initialMouseX = e.layerX;
    initialMouseY = e.layerY;
    initialElementX = dragBox.left - gridHex.offsetLeft;
    initialElementY = dragBox.top - gridHex.offsetTop;

    window.addEventListener('mousemove', onMoveGridHex);
    ['mouseup', 'mouseleave'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );

});

function onMoveGridHex(e) {
    if (!isDown) return;
    e.preventDefault();
    document.body.style = '';

    // const x = e.pageX - gridHex.offsetLeft;
    // const y = e.pageY - gridHex.offsetTop;
    const x = e.layerX;
    const y = e.layerY;
    
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
    gridHex.firstChild.scrollIntoView({ behavior: "smooth", block: "center", inline: "center", container: "nearest" })

};

// GRID HEXAGONE SCALLABLE
const observer = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (entry.intersectionRatio > 0.95) {
                entry.target.style.scale = `1`;
                entry.target.classList.add('hover')
            } else {
                entry.target.style.scale = `0.5`;
                entry.target.classList.remove('hover')
            }
        } else {
            entry.target.style.scale = `0.1`;
        }
    })
}, {
    root: gridHex,
    rootMargin: '-37%',
    threshold: [0.0, 0.25, 0.5, 0.75, 1],
});

gridHexItem.forEach((item) => {
    observer.observe(item);
});