//VARIABLES
const url = '../docs/sample.pdf'

let pdfDoc = null, // represents grabbed document
	pageNum = 1,
	pageIsRendering = false,
	pageNumIsPending = null;

const scale = 1.5,
	canvas = document.querySelector('#pdf-render'),
	ctx = canvas.getContext('2d');

//FUNCTIONS
const renderPage = num => {

};

//GET document
//pdfjsLib obj provided by pdf.js
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
	pdfDoc = pdfDoc_;
	console.log(pdfDoc);
});
