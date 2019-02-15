//VARIABLES
const url = '../docs/sample.pdf'
const pageCount = document.querySelector('#page-count');
const pageNumber = document.querySelector('#page-num');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');

let pdfDoc = null, // represents grabbed document
	pageNum = 1,
	pageIsRendering = false,
	pageNumIsPending = null;

const scale = 1.5,
	canvas = document.querySelector('#pdf-render'),
	ctx = canvas.getContext('2d');

//FUNCTIONS
const renderPage = num => {
	pageIsRendering = true;

	//getPage is a method from pdf-js, available to us because pdfDoc is, by the point, no longer null and is instead an object representing a PDF.
	pdfDoc.getPage(num).then(page => {

		//set the scale of the document from pdf-js
		const viewport = page.getViewport({scale});
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		const renderCtx = {
			canvasContext: ctx, viewport
		}
		page.render(renderCtx).promise.then(() => {
			pageIsRendering = false;

			if(pageNumIsPending) {
				renderPage(pageNumIsPending) //includes the number of page to render
				pageNumIsPending = null;
			}
		});

		//output current page in the div
		pageNumber.textContent = num;
	});
};

//Check for pages rendering - called when we attempt to choose pages
const queueRenderPage = num => {
	if(pageIsRendering) {
		//set pending page to the passed in num
		pageNumIsPending = num;
	} else {
		//otherwise, render the passed in page
		renderPage(num);
	}
}

//show prev/next pages
const showPrevPage = () => {
	if(pageNum <= 1) {
		return; //if on first page
	}
	pageNum--;
	queueRenderPage(pageNum)
}

const showNextPage = () => {
	if(pageNum >= pdfDoc.numPages) {
		return
	}
	pageNum++;
	queueRenderPage(pageNum);
}

//GET document
//pdfjsLib obj provided by pdf.js
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
	pdfDoc = pdfDoc_;
	pageCount.textContent = pdfDoc.numPages;

	renderPage(pageNum);
})
	// catch for when the document does not exist/cannot be found
	.catch(err => {
		const div = document.createElement('div');
		div.className = 'error';
		div.appendChild(document.createTextNode(err.message));
		document.querySelector('.container').insertBefore(div, canvas);

		//remove the top bar
		document.querySelector('.top-bar').style.display = 'none';
	});

//Button events
prevButton.addEventListener('click', showPrevPage);
nextButton.addEventListener('click', showNextPage);
