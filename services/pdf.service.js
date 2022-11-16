const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = {
  exportBugs,
}

function exportBugs(bugs, fileName = 'bugs-list.pdf') {
  // Create a document
  const doc = new PDFDocument()

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(fs.createWriteStream(fileName))

  // Embed a font, set the font size, and render some text
  //   doc
  //     .font('fonts/PalatinoBold.ttf')
  //     .fontSize(25)
  //     .text('Saved Animals During Casep 2022 Bootcamp:', 100, 100)

  // Add an image, constrain it to a given size, and center it vertically and horizontally
  bugs.forEach(({ title, description, severity, createdAt }) => {
    doc.fontSize(25)
    doc.text(`Bug name: ${title}`, {
      width: 410,
      align: 'left',
    })

    doc.moveDown()
    doc.fontSize(8)
    doc.text(`Severity: ${severity}`, {
      width: 410,
      align: 'center',
    })

    doc.moveDown()
    doc.fontSize(14)
    doc.text(`Description: ${description} || 'No description available'`, {
      width: 410,
      align: 'center',
    })

    doc.moveDown()
    doc.fontSize(8)
    doc.text(`CreatedAt: ${new Date(+createdAt)}`, {
      width: 410,
      align: 'left',
    })

    // draw bounding rectangle
    doc.rect(doc.x, 0, 410, doc.y).stroke()
  })
  doc.end()
}
