// visgexf.sig.iterNodes(n => {
//     let attr = n.attr.attributes;
//     if (attr.author) authors++;
//     if (attr.book) books++;
//     if (attr.mentor) mentors++;
// });


jQuery.getJSON('/gexf/mentor-author-graph.json', data => {
    let books = [];
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
            table.append(`<tr>
                <td>${author}</td>
                <td>${node.id}</td>
                <td data-sort="${mentors.length}">${mentors.join(', ')}</td>
                <td><a href="${node.attributes.url}">Amazon.com</a></td>
            </tr>`)
            books.push(node);
        }
    }

    new Tablesort(document.getElementById('books'), {descending: true});
})