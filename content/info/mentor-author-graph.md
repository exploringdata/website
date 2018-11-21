---
created: 2018-11-15 14:44:59
disclaimer: 1
related: /vis/mentor-author-graph/
title: Network Graph of Book Recommendations from Tribe of Mentors
description: The Graph of Mentors, Books and Authors visualizes book recommendations from the book Tribe Of Mentors by Tim Ferriss and his interviewees.
template: page-wide.html
image: mentor-author-graph.png
tags: [network graph, books, authors, sigmajs, gephi, networkx, interactive]
scripts:
- /vendor/npm/jquery.dataTables.min.js
- /compiled/mentor-author-graph/common.js
- /compiled/mentor-author-graph/info.js
styles:
- //cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css
---
The interactive [Graph of Mentors, Books and Authors](/vis/mentor-author-graph/) visualizes book recommendations from the book [Tribe Of Mentors](https://tribeofmentors.com/) by Tim Ferriss and his interviewees. The book is a collection of 130+ interviews with people who are exceptional at what they do. Tim asked them a set of 11 questions including one about which book they gave away the most as a gift or which books had greatly influenced their lives.

Taking all these recommendations I created a graph, that has 4 kinds of nodes: authors, books, mentors, and mentors who are also recommended authors. I assigned a weight of 1 to each mentor, which is distributed equally among their recommended books, i.e. if a mentor recommended 4 books, each edge connecting them gets a weight of 0.25. The size of a book node is then calculated as the sum of its incoming edges multiplied by its in-degree, i.e. the number of mentors recommending it. The weight of an author in turn is the sum of all edge weights with their books as targets multiplied by the number of mentors who recommended at least one of their books.

The people interviewed in Tribe of Mentors come from different backgrounds, are good at different things and recommend different books. The 100 mentors in the graph named 224 different books by 205 different authors adding up to 522 nodes (some are both authors and mentors) and 474 edges. The resulting disconnected graph has just a few nodes which stand out, most notable [Viktor E. Frankl](/vis/mentor-author-graph/#Viktor E. Frankl) and his book Man' Search for Meaning. The 2nd largest author node is [Timothy Ferriss](/vis/mentor-author-graph/#Timothy Ferriss) himself, who authored 2 books that were recommended by several mentors.

A handful of other books were recommended multiple times, but the vast majority are named just once. You can see the details in the table below, that lists all the books mentioned.

<table id="books" class="display">
<thead>
<tr>
    <th>Author</th><th>Title</th><th>Recommended by</th><th>Book links</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## How the graph was created

The graph was created with the Python library [Networkx](https://networkx.github.io/) and laid out in [Gephi](https://gephi.org/) using the Force Atlas layout. The browser version is rendered with the JavaScript library [sigma.js](http://sigmajs.org/).