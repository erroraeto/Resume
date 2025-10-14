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
    gridHex.firstChild.scrollIntoView({ block: "center", inline: "center", container: "nearest" });
    const relativePosition = getPositionRelativeToParent(gridHexWrapp);
    console.log('Position relative to parent:', relativePosition);
};

let isDown = false,
    startX,
    scrollLeft,
    startY,
    scrollTop;

gridHexWrapp.addEventListener('mousedown', (e) => {
    document.body.style = 'user-select: none';

    isDown = true;
    startX = e.pageX - gridHex.offsetLeft;
    scrollLeft = gridHex.scrollLeft;
    startY = e.pageY - gridHex.offsetTop;
    scrollTop = gridHex.scrollTop;
    window.addEventListener('mousemove', onMoveGridHex);
    ['mouseup', 'mouseleave'].forEach( ev => window.addEventListener( ev , onLeaveGridHex) );
});

function onMoveGridHex(e) {
    if (!isDown) return;
    e.preventDefault();
    document.body.style = '';

    const x = e.pageX - gridHex.offsetLeft;
    const walkX = (x - startX);
    gridHex.scrollLeft = scrollLeft - walkX;
    const y = e.pageY - gridHex.offsetTop;
    const walkY = (y - startY);
    gridHex.scrollTop = scrollTop - walkY;

    getPositionRelativeToParent(gridHexWrapp);
};

function onLeaveGridHex(event) {
    isDown = false;

    window.removeEventListener('mousemove', onMoveGridHex);
    gridHex.firstChild.scrollIntoView({ behavior: "smooth", block: "center", inline: "center", container: "nearest" })

    getPositionRelativeToParent(gridHexWrapp);
};









function getPositionRelativeToParent(element) {
    const parent = element.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    let left = ( elementRect.left + (elementRect.width / 2) ),
        top = ( elementRect.top + (elementRect.height / 2) ),
        pLeft = ( parentRect.width / 2 ),
        pTop = ( parentRect.height / 2 );

    let X = Math.abs( (pLeft - left) );
    X = Math.abs( X * 1 / (pLeft - elementRect.width / 2) );

    let Y = Math.abs( (pTop - top) );
    Y = Math.abs( X * 1 / (pTop - elementRect.height / 2) );

    let XYbigg = Math.abs(1 - Math.max( X, Y ));

    element.style = `--scale: ${ XYbigg };`
    // element.style = `--scaleX: ${ 1 - Math.abs(pLeft - left) }; --scaleY: ${ 1 - Math.abs(pTop - top) };`
    // element.style = `scale: ${pLeft - left}px ${pTop - top}px`

    console.log(X);
    return {
        // left: ( elementRect.left + (elementRect.width / 2) ),
        // top: ( elementRect.top + (elementRect.height / 2) ),
        // pLeft: ( parentRect.width / 2 ),
        // pTop: ( parentRect.height / 2 ),
        // onCenterX: ( pLeft - left ),
        // onCenterY: ( pTop - top ),
        X
    };
};

// Usage with nested elements
// const relativePosition = getPositionRelativeToParent(gridHexWrapp);
// console.log('Position relative to parent:', relativePosition);