//VARIABLES
const url = '../docs/sample.pdf'
const pageCount = document.querySelector('#page-count');
const pageNumber = document.querySelector('#page-num');

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

//GET document
//pdfjsLib obj provided by pdf.js
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
	pdfDoc = pdfDoc_;
	pageCount.textContent = pdfDoc.numPages;

	renderPage(pageNum)
});
