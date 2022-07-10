/**
 * Lightbox modify
 */

const svgIcons = {
    close: '<svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#faab21;}.cls-2{fill:#fff;}</style></defs><rect class="cls-1" width="50" height="50"/><path class="cls-2" d="M16.59,14,14.33,16.3,23,25,14.34,33.7,16.6,36l8.68-8.7,8.12,8.11,2.26-2.26L27.54,25l8.13-8.1-2.26-2.26-8.13,8.1Z" transform="translate(0 0)"/></svg>',
    next: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#FAAB21"/><path d="M26.3229 21.677L28 20L26.3229 18.3229L18 10L16.3229 11.6771L24.6459 20L16.3229 28.3229L18 30L26.3229 21.677Z" fill="white"/></svg>',
    zoom: '<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="25" fill="#FAAB21"/><path d="M24.6598 13C18.2209 13 13 18.2209 13 24.6599C13 31.0989 18.2209 36.3198 24.6599 36.3198C27.1359 36.3198 29.4322 35.5475 31.3198 34.232V34.2306L34.9197 37.5C35.0802 37.6605 35.3353 37.6646 35.5 37.5L37.8306 35.1694C37.991 35.0089 37.9828 34.7428 37.8306 34.5892L34.2319 31.3211C35.5474 29.4322 36.3197 27.1359 36.3197 24.6599C36.3197 18.2209 31.0989 13 24.6598 13ZM24.6598 33.5763C19.7352 33.5763 15.7435 29.5845 15.7435 24.6599C15.7435 19.7353 19.7353 15.7435 24.6598 15.7435C29.5844 15.7435 33.5762 19.7353 33.5762 24.6599C33.5762 29.5845 29.5844 33.5763 24.6598 33.5763Z" fill="white"/><path d="M25.8847 19.3977H23.513V23.513H19.3977V25.8847H23.513V30H25.8847V25.8847H30V23.513H25.8847V19.3977Z" fill="white"/></svg>',
    prev: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" transform="rotate(-180 20 20)" fill="#FAAB21"/><path d="M13.6771 18.323L12 20L13.6771 21.6771L22 30L23.6771 28.3229L15.3541 20L23.6771 11.6771L22 10L13.6771 18.323Z" fill="white"/></svg>'
}

let mklbItems = document.getElementsByClassName('mklbItem');
let mklbMainContainer = document.getElementsByClassName('elgallery-mainContainer')[0];
let lightboxContainer;
let auto = 0;
let interval;
let curindex=0;
let container_width = mklbMainContainer.offsetWidth;
// максимальная ширина, меньше которой уже выравниваем по 4 картинки
let maxcontentWidth = 768;
// 1 - это > maxcontentWidth, 0 - это меньше maxcontentWidth
let lastSize = 1;
let _firstLoad = false;

// обрабатываем ресайз окна
window.addEventListener('resize', ready );

function ready(event){
    // do stuff here
    container_width = mklbMainContainer.offsetWidth;
    _mklbSyncSlide();
    _mklbSyncOverlaySlide();
    let putimg = false;
    
    if ( window.innerWidth <= maxcontentWidth ){
        if ( lastSize==1 ){
            putimg=true;
        }
        lastSize = 0;
    }else{
        if ( lastSize==0 ){
            putimg=true;
        }
        lastSize = 1;
    }

    if ( putimg ){
        _putImages();
    }

    _syncImgWidth();
}

document.addEventListener("DOMContentLoaded", ready);

function firstLoad(){
    if (!_firstLoad){
        _firstLoad=true;
        _putImages();
        _syncImgWidth();
    }
}

function _putImages(){
    // iterate over plugin containers
    var container = document.getElementsByClassName("elgallery-widget");
    for (var i = 0; i < container.length; i++) {
        let _item = container.item(i);
        let _blkimages = _item.getElementsByClassName('block-none')[0];
        let _images = _blkimages.getElementsByClassName('mklbItem');
        // let _images = _item.getElementsByClassName('mklbItem');
        let _target = _item.getElementsByClassName('grid-adopt')[0];
        let _target_tail = _item.getElementsByClassName('grid-last')[0];
        
        // assuming elm is the element
        while (_target.firstChild) {
            _target.removeChild(_target.firstChild);
        }
        while (_target_tail.firstChild) {
            _target_tail.removeChild(_target_tail.firstChild);
        }

        // считаем есть ли лишние и добавляем их в последний ряд
        let _lastitems = _images.length % ( lastSize==0 ? 4 : 7 );
        if (_lastitems>0){
            for (var k = _images.length - _lastitems; k <= _images.length-1 ; k++) {
                const _nimg = _images.item(k).cloneNode(true);
                _nimg.setAttribute('data',k);
                _nimg.addEventListener('click', (ev) => {
                    _mklbSyncSlide(ev.currentTarget.getAttribute('data'));
                });
                _target_tail.appendChild( _nimg );
                // console.log(_nimg);
            }
        }

        // сбрасываем все в первый контейнер
        for (var j = 0; j < _images.length - _lastitems; j++) {
            const _nimg = _images.item(j).cloneNode(true);
            _nimg.setAttribute('data',j);
            _nimg.addEventListener('click', (ev) => {
                _mklbSyncSlide(ev.currentTarget.getAttribute('data'));
            });
            _target.appendChild( _nimg );
        }
    }
}

function _syncImgWidth(){
    var container = document.getElementsByClassName("elgallery-widget");
    for (var i = 0; i < container.length; i++) {
        let _item = container.item(i);
        let _blkimages = _item.getElementsByClassName('grid-adopt')[0];
        let _images = _blkimages.getElementsByClassName('mklbItem');
        for (let j = 0; j < _images.length; j++) {
            const element = _images[j];
            element.style.width = 'auto';
        }
        if ( _images.length>0 ){
            let _imgw = _images[0].offsetWidth;
            let _target_tail = _item.getElementsByClassName('grid-last')[0];
            _images = _target_tail.getElementsByClassName('mklbItem');
            for (let j = 0; j < _images.length; j++) {
                const element = _images[j];
                element.style.width = _imgw+'px';
            }
        }
    }
}

/**
 * Iterate over all images
 */
for (let i=0; i< mklbItems.length; i++) {
    let mklbItem = mklbItems[i];
    mklbItem.addEventListener('click', () => {
        curindex=i;
        _mklbSyncSlide();
    });
    if (i==0){
        _mklbAddInnerGallery(mklbItem);
    }
}

/**
 * Open lightbox gallery with overlay by cyrindex sync
 * @param {*} curindex 
 */
function _mklbOpen(curindex) {
    let currentItem = mklbItems[curindex]
    
    lightboxContainer = document.createElement('div');
    lightboxContainer.id = "mkLightboxContainer";

    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    lightboxContainer.appendChild(overlay);

    let overlayToInner = document.createElement('div');
    overlayToInner.id = 'overlayToInner';
    

    let gallery = [];
    let index = 0;
    let mklbInner = document.createElement('div');
    mklbInner.id = 'mklbInner';

    for (let i=0; i < mklbItems.length; i++) {
        if('gallery' in mklbItems[i].dataset 
		  && mklbItems[i].dataset.gallery === currentItem.dataset.gallery) {
            gallery.push(mklbItems[i]);
			
			if('auto' in mklbItems[i].dataset) {
				auto = mklbItems[i].dataset.auto;
			}
			
            if(mklbItems[i] === currentItem) {
                index = gallery.length;
            }
            let imageContainer = document.createElement('section');
            imageContainer.className = 'imageContainer';
            imageContainer.appendChild(_mklbAddImage(mklbItems[i]));
            mklbInner.appendChild(imageContainer);
        };
    }


    let prev = document.createElement('div');
    prev.id = 'prev';
    prev.innerHTML = svgIcons.prev;
    let prevContainer = document.createElement('div');
    prevContainer.id = "prevContainerOuter";
    prevContainer.appendChild(prev);
    overlayToInner.appendChild(prevContainer);
    prevContainer.addEventListener('click', () => _mklbSlide(true));


    let next = document.createElement('div');
    next.id = 'next';
    next.setAttribute('data-next', (index <= gallery.length) ? index+1 : 1);
    next.innerHTML = svgIcons.next;
    let nextContainer = document.createElement('div');
    nextContainer.id = "nextContainerOuter";
    nextContainer.appendChild(next);
    overlayToInner.appendChild(nextContainer);
	nextContainer.addEventListener('click', ()=>_mklbSlide(false) );
    
    overlayToInner.appendChild(mklbInner);
    lightboxContainer.appendChild(overlayToInner);

    let closeIconContainer = document.createElement('div');
    closeIconContainer.id = "closeIconContainer";
    closeIconContainer.innerHTML = svgIcons.close;
    lightboxContainer.appendChild(closeIconContainer);
    closeIconContainer.addEventListener('click', _closeLightbox)

    document.body.appendChild(lightboxContainer);
    overlay.addEventListener('click', _closeLightbox)

    // sync slides with index
    _mklbSyncOverlaySlide()
}

function _mklbAddImage(item) {
    let image = document.createElement('img');
    image.src = ('src' in item.dataset) ? item.dataset.src : item.src;
    return image;
}

function _mklbAddInnerGallery(currentItem) {
    let gallery = [];
    let index = 0;


    let mklbInner = document.createElement('div');
    mklbInner.id = 'mklbInnerMini';

    for (let i=0; i < mklbItems.length; i++) {
        if('gallery' in mklbItems[i].dataset 
		  && mklbItems[i].dataset.gallery === currentItem.dataset.gallery) {
            gallery.push(mklbItems[i]);
			
			if('auto' in mklbItems[i].dataset) {
				auto = mklbItems[i].dataset.auto;
			}
			
            if(mklbItems[i] === currentItem) {
                index = gallery.length;
            }
            let imageContainer = document.createElement('section');
            imageContainer.className = 'imageContainerInner';
            imageContainer.appendChild(_mklbAddImage(mklbItems[i]));
            mklbInner.appendChild(imageContainer);
        };
    }

    let prev = document.createElement('div');
    prev.id = 'prev';
    prev.innerHTML = svgIcons.prev;
    let prevContainer = document.createElement('div');
    prevContainer.id = "prevContainer";
    prevContainer.appendChild(prev);
    mklbMainContainer.appendChild(prevContainer);
    prevContainer.addEventListener('click', () => _mklbSlideInner(true));

    let next = document.createElement('div');
    next.id = 'next';
    next.setAttribute('data-next', (index <= gallery.length) ? index+1 : 1);
    next.innerHTML = svgIcons.next;
    let nextContainer = document.createElement('div');
    nextContainer.id = "nextContainer";
    nextContainer.appendChild(next);
    mklbMainContainer.appendChild(nextContainer);
	nextContainer.addEventListener('click', function() {
		_mklbSlideInner(false);
	});

    let zoom = document.createElement('div');
    zoom.id = 'zoom';
    zoom.innerHTML = svgIcons.zoom;
    let zoomContainer = document.createElement('div');
    zoomContainer.id = "zoomContainer";
    zoomContainer.appendChild(zoom);
    mklbMainContainer.appendChild(zoomContainer);
    zoomContainer.addEventListener('click', () => _mklbZoomInner());
    
    mklbInner.style.marginLeft = (index-1) * (-100) + '%';
    mklbMainContainer.appendChild(mklbInner);

}

function _closeLightbox() {
    document.getElementById('mkLightboxContainer').remove();
	clearInterval(interval);
}

function _mklbSlide(slideToPrev) {
    let elements = document.getElementsByClassName('imageContainer').length;
    
    if (slideToPrev && curindex === 0 ) {
        curindex = (elements - 1)
    } else if (slideToPrev) {
        curindex-=1;
    } else if(curindex === (elements-1) ) {
        curindex=0;
    } else {
        curindex+=1;
    }
    
    _mklbSyncOverlaySlide();
    _mklbSyncSlide();    
}

function _mklbZoomInner(){
    _mklbOpen( curindex )
}

function _mklbSlideInner(slideToPrev) {
    let elements = document.getElementsByClassName('imageContainerInner').length;
    
    if (slideToPrev && curindex === 0 ) {
        curindex = (elements - 1)
    } else if (slideToPrev) {
        curindex-=1;
    } else if(curindex === (elements-1) ) {
        curindex=0;
    } else {
        curindex+=1;
    }
    
    _mklbSyncSlide();
}

function _mklbSyncSlide(ind = false){

    let inner = document.getElementById('mklbInnerMini');
    if (ind!==false){
        curindex=parseInt(ind);
    }
    if ( inner ){
        inner.style.transform = 'translate3d('+(-curindex*container_width)+'px,0,0)';
    }
}

function _mklbSyncOverlaySlide(){
    let inner = document.getElementById('mklbInner');
    if ( inner ){
        inner.style.transform = 'translate3d('+(-curindex*document.getElementById('mkLightboxContainer').offsetWidth)+'px,0,0)';
    }
}