$(() => {
    let props = {
        drawing: {
            defaultLabelColor: '#fff',
            defaultLabelSize: 12,
            defaultLabelBGColor: '#fff',
            defaultLabelHoverColor: '#000',
            labelThreshold: 7,
            defaultEdgeType: 'curve'
        },
        graph: {
            minNodeSize: 3,
            maxNodeSize: 30,
            minEdgeSize: 2,
            maxEdgeSize: 20
        },
        forceLabel: 1,
        type: 'directed'
    };
    visgexf.init('sig', '/gexf/mentor-author-graph.json', props, () => nodeClick(visgexf));
});


function nodeClick(Graph) {
    Graph.sig.bind('upnodes', event => {
        let node = Graph.sig.getNodes(event.content)[0];
        let attr = node.attr.attributes;
        if (attr.hasOwnProperty('book')) {
            let author = '';
            let body = `<h4>${attr.title}</h4>`;
            let label = 'Book info';
            let mentors = [];

            Graph.sig.iterEdges(e => {
                if (e.source == node.id) {
                    author = e.target;
                } else if (e.target == node.id) {
                    mentors.push(e.source);
                }
            });
            let mentor_links = mentors.map(d => `<a href="/vis/mentor-author-graph/#${d}">${d}</a>`);
            let book_links = bookLinks(attr);

            if (attr.hasOwnProperty('image')) {
                body += `<img src="${attr.image}" alt="book image" style="float:right;margin-left: 1em;">`;
            }

            body += `<p>Author: ${author}<br>Book recommended by: ${mentor_links.join(' - ')}`
            body += `<h3 class="clearfix">Book links</h3>${book_links.join(' - ')}`;
            nodeinfo(label, body);
        }
    });
}