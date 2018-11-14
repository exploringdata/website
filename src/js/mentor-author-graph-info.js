jQuery.getJSON('/gexf/mentor-author-graph.json', data => {
    let table = jQuery('#books');
    for (let node of data.nodes) {
        if (node.attributes.hasOwnProperty('book')) {
            let author = '';
            let mentors = [];
            for (let edge of data.edges) {
                if (node.id == edge.sourceID) {
                    author = edge.targetID
                } else if (node.id == edge.targetID) {
                    mentors.push(edge.sourceID);
                }
            }
            let mentor_links = mentors.map(d => `<a href="/vis/mentor-author-graph/#${d}">${d}</a>`);

            let book_links = [];
            if (node.attributes.hasOwnProperty('asin')) {
                book_links.push(`<a href="${node.attributes.url}">Amazon.com</a>`);
                book_links.push(`<a href="https://openlibrary.org/search?isbn=${node.attributes.asin}&mode=everything">Open Library</a>`);
            } else {
                book_links.push(`<a href="https://www.amazon.com/gp/search?ie=UTF8&tag=xpdt-20&index=books&keywords=${encodeURIComponent(node.attributes.title)}">Amazon.com</a>`);
                book_links.push(`<a href="https://openlibrary.org/search?q=${encodeURIComponent(node.attributes.title)}&mode=everything">Open Library</a>`);
            }
            book_links.push(`<a href="https://www.overdrive.com/search?q=${encodeURIComponent(node.attributes.title)}">Overdrive</a>`);

            table.append(`<tr>
                <td data-order="${author}"><a href="/vis/mentor-author-graph/#${author}">${author}</a></td>
                <td data-order="${node.attributes.title}"><a href="/vis/mentor-author-graph/#${node.attributes.title}">${node.attributes.title}</a></td>
                <td data-order="${mentors.length},${mentors}">${mentor_links.join(' - ')}</td>
                <td>${book_links.join(' - ')}</td>
            </tr>`)
        }
    }
    table.DataTable({
        columnDefs: [{ 'orderable': false, 'targets': 3 }],
        info: false,
        order: [[2, 'desc']],
        paging: false
    });
})