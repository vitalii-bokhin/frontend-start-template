document.addEventListener('DOMContentLoaded', function () {
    const fsElem = document.getElementById('js-first-screen');

    (function initFun() {
        if (fsElem) {
            let padTop = 100;

            if (window.innerWidth < 1200) {
                padTop = 60;
            }

            fsElem.style.height = (window.innerHeight - padTop) + 'px';
        }

        try {
            FlexImg('.flex-img');
        } catch (error) {
            console.log(error);
        }

        try {
            CoverImg.reInit('body');
        } catch (error) {
            console.log(error);
        }

        try {
            Tab.reInit();
        } catch (error) {
            console.log(error);
        }

        // resize events
        window.removeEventListener('winResized', initFun);
        window.removeEventListener('winWidthResized', initFun);

        if (window.innerWidth > 1200) {
            window.addEventListener('winResized', initFun);
        } else {
            window.addEventListener('winWidthResized', initFun);
        }
    })();

    // frames animate
    try {
        const frAn = new FramesAnimate('stopmotion-frames', {
            fps: 4
        });

        frAn.onLoad = function () {
            console.log('onLoad');
        }

        frAn.onStop = function () {
            // code
        }
    } catch (error) {
        console.log(error);
    }

    // scrollbox
    try {
        new Scrollbox('#vert-scroll', {
            bar: true
        });

        new Scrollbox('#hor-scroll', {
            horizontal: true,
            bar: true
        });
    } catch (error) {
        console.log(error);
    }


    // cover images
    try {
        CoverImg.init();
    } catch (error) {
        console.log(error);
    }


    // toggle button
    try {
        Toggle.init({
            button: '.js-toggle',
            onDocumenClickOff: '.js-document-toggle-off',
            offButton: '.js-tgl-off',
            toggledClass: 'toggled' // def: toggled
        });

        Toggle.onChange = function (toggleElem, targetElements, state) {
            // code...
        }
    } catch (error) {
        console.log(error);
    }


    // ajax button
    try {
        Ajax.init('.js-ajax');

        Ajax.success = function (response) {
            //  code...
        }
    } catch (error) {
        console.log(error);
    }


    // popup
    try {
        Popup.init('.js-open-popup');
        MediaPopup.init('.js-open-media-popup');

        Popup.onOpen(function (elSel, btnEl) {
            console.log(elSel, btnEl);
        });
    } catch (error) {
        console.log(error);
    }

    // menu
    try {
        if (window.innerWidth < 1000) {
            Menu.init('.menu__item_has-children', '.menu__sub-menu');
        }
    } catch (error) {
        console.log(error);
    }

    // mobile nav
    try {
        MobNav.init({
            openBtn: '.js-open-menu',
            closeBtn: '.js-close-menu',
            headerId: 'header',
            closeLink: '.menu a.js-anchor'
        });
    } catch (error) {
        console.log(error);
    }

    // tooltip
    try {
        ToolTip.init({
            element: '.js-tooltip'
        });

        ToolTip.onShow = function (btnEl, tooltipDivEl) {

        }
    } catch (error) {
        console.log(error);
    }

    // alert
    try {
        new Alert({
            content: 'This content in top alert.',
            position: 'top',
            addClass: 'top-alert-block'
        });

        new Alert({
            content: '<div class="row alert__row row_col-middle row_sm-x-nw"><div class="col">На нашем веб-сайте используются файлы cookies, которые позволяют улучшить Ваше взаимодействие с сайтом. Когда вы посещаете данный веб-сайт, Вы даете согласие на использование файлов cookies.</div><div class="col"><button class="js-alert-close btn btn_be">Хорошо</button></div></div>',
            showOnce: true
        });
    } catch (error) {
        console.log(error);
    }

    // accord
    try {
        Accord.init('.accord__button');
    } catch (error) {
        console.log(error);
    }

    // more
    try {
        More.init('.more__btn');
    } catch (error) {
        console.log(error);
    }


    // tab
    try {
        Tab.init({
            container: '.tab',
            button: '.tab__button',
            item: '.tab__item'
        });
    } catch (error) {
        console.log(error);
    }

    // video
    try {
        Video.init('.video__btn-play');
    } catch (error) {
        console.log(error);
    }

    // fullscreen scroll
    try {
        FsScroll.init({
            container: '.fsscroll',
            screen: '.fsscroll__screen',
            duration: 700
        });
    } catch (error) {
        console.log(error);
    }

    // screens
    try {
        Screens.init({
            horizontal: true
        });
    } catch (error) {
        console.log(error);
    }

    // Screens2.init({
    // 	container: '.screen-wrap',
    // 	duration: 700, // default - 1000
    // 	menuCurrentClass: 'current' // default - 'menu__item_current'
    // });

    // smooth scroll
    // ScrollSmooth.init();

    // anchor
    try {
        Anchor.init('.js-anchor', 700, 100);
        // Anchor.scroll('section-3');
    } catch (error) {
        console.log(error);
    }

    // diagram
    try {
        var diagram = new Diagram({
            canvasId: 'diagram',
            charts: [
                {
                    value: 37,
                    color: 'green',
                    width: 20,
                    numContId: 'diagram-num-1'
                },
                {
                    value: 45,
                    color: '#d0295e',
                    width: 10,
                    offset: 2,
                    numContId: 'diagram-num-2'
                }
            ],
            maxValue: 100
        });


        // diagram 2
        var diagram_2 = new Diagram({
            canvasId: 'diagram-2',
            charts: [
                {
                    value: 84,
                    color: '#fd8d40',
                    width: 30,
                    numContId: 'diagram-2-num-1'
                },
                {
                    value: 39,
                    color: '#0000ff',
                    width: 30,
                    offset: 2,
                    numContId: 'diagram-2-num-2'
                }
            ],
            maxValue: 100,
            animate: true
        });

        diagram_2.animate(2700);

        // diagram 2
        var diagram_3 = new Diagram({
            canvasId: 'diagram-3',
            charts: [
                {
                    value: 67,
                    color: '#fd8d40',
                    width: 15,
                    numContId: 'diagram-3-num-1'
                },
                {
                    value: 75,
                    color: '#d0295e',
                    width: 15,
                    offset: 2,
                    numContId: 'diagram-3-num-2'
                },
                {
                    value: 83,
                    color: 'green',
                    width: 15,
                    offset: 2,
                    numContId: 'diagram-3-num-3'
                },
                {
                    value: 91,
                    color: '#0000ff',
                    width: 15,
                    offset: 2,
                    numContId: 'diagram-3-num-4'
                }
            ],
            maxValue: 100,
            animate: true
        });

        diagram_3.animate(4200);
    } catch (error) {
        console.log(error);
    }

    // numberspin
    try {
        var numberspin = new Numberspin({
            elemSel: '.numberspin',
            format: true
        });

        numberspin.animate(4200);
    } catch (error) {
        console.log(error);
    }

    // share
    try {
        Share.init('.js-share-btn');
    } catch (error) {
        console.log(error);
    }

    // timer
    try {
        if (document.getElementById('timer')) {
            var timer = new Timer({
                elemId: 'timer',
                continue: true
            });

            timer.onStop = function () {
                Popup.message('Timer Stopped');
            }

            timer.start(50);

            // timer 2
            var timer2 = new Timer({
                elemId: 'timer-2',
                format: 'extended'
            });

            timer2.onStop = function () {
                Popup.message('Timer 2 Stopped');
            }

            timer2.start(130);

            // stopwatch
            var stopwatch = new Timer({
                elemId: 'stopwatch',
                stopwatch: true
            });

            stopwatch.onStop = function () {
                Popup.message('Stopwatch Stopped');
            }

            stopwatch.start(0);

            // stopwatch 2
            var stopwatch2 = new Timer({
                elemId: 'stopwatch-1',
                stopwatch: true,
                format: 'extended'
            });

            stopwatch2.onStop = function () {
                Popup.message('Stopwatch Stopped');
            }

            stopwatch2.start(0);
        }

    } catch (error) {
        console.log(error);
    }

    // zoom
    try {
        Zoom.init('.js-zoom-container');
    } catch (error) {
        console.log(error);
    }

    // cursor
    try {
        if (window.innerWidth > 1100) {
            Cursor.init([
                { selector: '.curs-link', class: 'hover-a' },
                { selector: '.curs-btn', class: 'hover-btn' },
                { selector: '.curs-main' }
            ]);
        }
    } catch (error) {
        console.log(error);
    }

    // get content via Ajax
    try {
        var getCont = new GetContentAjax({
            eventBtn: '.js-get-content-ajax',
            event: 'click',
            outputDiv: '#output-ajax',
            sourceFile: '/get-content-ajax.php'
        });

        getCont.output = function (response) {
            var result = response.match(/\<div id\="source"\>([\s\S]*?)\<\/div\>/);

            return result[1];
        }
    } catch (error) {
        console.log(error);
    }

    // fieldsets
    try {
        NextFieldset.init('.js-next-fieldset-btn', '.js-prev-fieldset-btn');

        NextFieldset.onChange = function (prevFsEl, curFsEl) {
            // ...
        }
    } catch (error) {
        console.log(error);
    }

    // autocomplete
    try {
        var contries;

        // autocomplete data
        AutoComplete.getValues = function (inpElem, returnFun) {
            switch (inpElem.name) {
                case 'fruits':
                    returnFun([
                        { val: "mc", value: "Pinapple", id: 1 },
                        { val: "vn", value: "Apple", id: 2 },
                        { val: "eth", value: "Berry", id: 3 },
                        { val: "ms", value: "Cherry", id: 4 },
                        { val: "mn", value: "Mandarin", id: 5 },
                        { val: "mk", value: "Marakuja", id: 6 }
                    ], 'value', 'val', 'id');
                    break;

                case 'country':
                    if (contries) {
                        returnFun(contries, 'name', 'name', 'id');
                    } else {
                        dAirGet.countries(function (c) {
                            contries = JSON.parse(c);
                            returnFun(contries, 'name', 'name', 'id');
                        });
                    }
                    break;

                default:
                    break;
            }
        }

        AutoComplete.onSelect(function (inpElem, val, secVal) {
            if (inpElem.name == 'country') {

            }
        });
    } catch (error) {
        console.log(error);
    }

    // submit form
    try {
        Form.init('.form');
    } catch (error) {
        console.log(error);
    }

    // slick slider
    try {
        $('#slider').on('init', function () {
            CoverImg.reInit('#slider');
        });

        $('#slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1
        });
    } catch (error) {
        console.log(error);
    }


    // scroll pane
    try {
        $('.scroll-pane').jScrollPane();
    } catch (error) {
        console.log(error);
    }

    // masked inputs
    try {
        $('input[data-type="tel"]').each(function () {
            new Maskinput(this, 'tel');
        });
        $('input[data-type="name"]').each(function () {
            new Maskinput(this, 'cyr');
        });
    } catch (error) {
        console.log(error);
    }

    // mouse parallax
    try {
        if ($('.parallax-element').length) {
            new Mouseparallax($('.parallax-element.el2'), {
                listener: $('#sec1')
            });

            new Mouseparallax($('.parallax-element.el3'), {
                listener: $('#sec2')
            });
        }
    } catch (error) {
        console.log(error);
    }

    // drag'n'drop
    try {
        DragAndDrop.init();

        DragAndDrop.onDragged(function () {
            console.log('dragged');
        });
    } catch (error) {
        console.log(error);
    }

});

// GetCountriesAndCitiesList
function dAirGetInit() {
    try {
        dAirGet.countries(function (c) {
            var contryObjArr = JSON.parse(c);

            Select.setOptions('.countries', contryObjArr, 'name', 'name', 'id');
        });
    } catch (error) {
        console.log(error);
    }

    try {
        Select.onSelect(function (inpElem, val, secVal) {
            if (inpElem.name == 'country') {
                dAirGet.region(secVal, function (c) {
                    var regionObjArr = JSON.parse(c);
                    Select.setOptions('.cities', regionObjArr, 'name', 'name');
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}