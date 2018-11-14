---
created: 2018-11-12 21:40:59
related: /vis/mentor-author-graph/
title: Network Graph of Book Recommendations from Tribe of Mentors
description: The Graph of Mentors, Books and Authors visualizes book recommendations from the book Tribe Of Mentors by Tim Ferriss and his interviewees.
template: page-wide.html
image: mentor-author-graph.png
tags: [network graph, books, authors, sigmajs, gephi, networkx, interactive]
scripts:
- /vendor/npm/jquery.dataTables.min.js
- /compiled/mentor-author-graph-info.js
styles:

- //cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css
---

A network graph of authors, books and mentors based on recommendations in the book Tribe Of Mentors by Tim Ferriss and his interviewees.
Author: Ramiro Gómez • Visualization: exploring-data.com/vis/mentor-author-graph/ • Information: exploring-data.com/info/mentor-author-graph/

let authors = 0;
let books = 0;
let mentors = 0;

<table id="books" class="display">
<thead>
<tr>
    <th>Author</th><th>Title</th><th>Recommended by</th><th>Book links</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<!-- <div id="amzn-assoc-ad-623d5c40-6d6c-484c-8c0d-21afa99a74c2"></div><script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=623d5c40-6d6c-484c-8c0d-21afa99a74c2"></script> -->