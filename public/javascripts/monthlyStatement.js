const test = document.querySelector('p').innerText
        const docDefinition = { content:test};
            pdfMake.createPdf(docDefinition).open({}, window);