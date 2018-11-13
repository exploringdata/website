---
created: 2018-11-12 21:40:59
related: /vis/mentor-author-graph/
title: Network Graph of Book Recommendations from Tribe of Mentors
description: The Graph of Mentors, Books and Authors visualizes book recommendations from the book Tribe Of Mentors by Tim Ferriss and his interviewees.
template: vis/sigma.html
image: mentor-author-graph.png
scripts:
- /js/network/mentor-author-graph.js
---

A network graph of authors, books and mentors based on recommendations in the book Tribe Of Mentors by Tim Ferriss and his interviewees.
Author: Ramiro Gómez • Visualization: exploring-data.com/vis/mentor-author-graph/ • Information: exploring-data.com/info/mentor-author-graph/

let authors = 0;
let books = 0;
let mentors = 0;

visgexf.sig.iterNodes(n => {
    let attr = n.attr.attributes;
    if (attr.author) authors++;
    if (attr.book) books++;
    if (attr.mentor) mentors++;
});