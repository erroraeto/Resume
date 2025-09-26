// SCROLLBAR
let scrollbar = document.querySelector('.scrollbar__list'),
    main = document.querySelector('.main'),
    thumbSelect = true;

const scrolling = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.5) {
            for (let i = 0; i < main.children.length; i++) {
                if (main.children[i] == entry.target) {
                    scrollbar.children[i].style = '--opacity-marker: 0; --opacity-text: 1; --visibility-circle: hidden';
                } else {
                    scrollbar.children[i].style = '';
                };
            }
            thumbSelect = false;
        } else if (entry.intersectionRatio <= 0.5) {
            thumbSelect = true;
        }
    })
}, {
    root: main,
    threshold: 0.5,
});

Array.from(main.children).forEach((section) => scrolling.observe(section));

Array.from(scrollbar.children).forEach((item) => item.onclick = (event) => {
    for (let i = 0; i < scrollbar.children.length; i++) {
        if (scrollbar.children[i] == event.target) {
            main.children[i].scrollIntoView({behavior: "smooth"});
        };
    }
});

// LIST DETAILS
let listItem = document.querySelectorAll('.list-details > *');

function onWindowResize() {
    let open = Array.from(listItem).find((item) => item.open == true);
    Array.from(listItem).forEach((item) => {
        item.children[1].style.width = `${ open.clientWidth - parseFloat(getComputedStyle(open).paddingInline) * 2 }px`;
    });
}

onWindowResize();
window.addEventListener( 'resize', onWindowResize );

Array.from(listItem).forEach((item) => {
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