function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let phaseList = document.querySelector('.section__about .list-phase');

// phaseList.onscroll = (e) => {
[ 'scroll', 'mousewheel', 'touchmove' ].forEach( event => phaseList.addEventListener( event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    })
);
// document.addEventListener('load', () => {
//     // phaseList.classList.remove('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
//     phaseList.children[1].scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
//     // phaseList.classList.add('scroll-snap-type__x-mandatory', 'scroll-behavior__smooth');
// }, true);

// SCROLLBAR
let scrollbar = document.querySelector('.scrollbar'),
    thumb = document.querySelector('.scrollbar__thumb'),
    main = document.querySelector('.main'),
    thumbSelect = true;

main.addEventListener('scroll', thumbPosition);
scrollbar.addEventListener('scroll', thumbPosition);

async function thumbPosition() {
    // thumb.style.setProperty( "opacity", 1 );
    // thumb.style.setProperty( "width", 'calc( 100% + 4px )' );
    let scrollThumbPos = ( main.offsetHeight * main.scrollTop ) / main.scrollHeight;
    scrollbar.style.setProperty( "--scroll-y", `${scrollThumbPos}px` );
    await sleep(2000);
    // thumb.style.removeProperty("opacity");
    // thumb.style.removeProperty("width");
};


let pointerIsDown,
pointerStartY,
pointerSnap = [],
pointerScrollTop;

thumb.addEventListener('mousedown', (event) => {

    document.body.style = 'user-select: none';
    pointerIsDown = true;
    pointerStartY = event.clientY;
    pointerScrollTop = main.scrollTop;
    thumb.style.setProperty( "width", 'calc( 100% + 4px )' );
    thumb.style.setProperty( "opacity", 1 );

    document.onmousemove = (event) => {
        if (pointerIsDown) {
            const y = event.clientY;
            const walkY = (y - pointerStartY) * main.scrollHeight / main.offsetHeight;
            main.classList.add('main-scrolling');
            main.scrollTop = pointerScrollTop + walkY;
        }
    };

    document.onmouseup = () => {
        pointerIsDown = false;
        thumb.style.removeProperty("width");
        thumb.style.removeProperty("opacity");
    };
});

// LIST DETAILS
let listDetail = document.querySelector('.list-details');
let listItems = document.querySelectorAll('.list-details > *');
let coverTitle = document.querySelector('.section__cover > .cover__title');
let cover = document.querySelector('.section__cover');

function onWindowResize() {

    // SCROLLBAR: HEIGHT
    scrollbar.style.setProperty("--scrollbar-height", `${main.offsetHeight / main.children.length - parseFloat(getComputedStyle(scrollbar).marginBlock) * 2 - 2}px`);
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