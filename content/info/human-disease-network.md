---
related: /vis/human-disease-network/
title: A Network Graph of Human Diseases
description: The human disease network graph is a visualization based on a study that explored relations of human disorders and disease-genes by Goh K-I, Cusick ME, Valle D, Childs B, Vidal M, Barabási A-L (2007).
template: page-with-sidebar.html
created: 2012-09-27 16:45:57
image: human-disease-network.png
tags: [network graph, sigmajs, gephi]
---
A [network of disorders and disease genes](/vis/human-disease-network/) linked by known disorder-gene associations from the study [The Human Disease Network](https://www.barabasilab.com/publications/the-human-disease-network), Goh K-I, Cusick ME, Valle D, Childs B, Vidal M, Barabási A-L (2007), Proc Natl Acad Sci USA 104:8685-8690. Disorders and genes are nodes in the graph. A disorder's size corresponds to the number of genes known to be associated with it.

The [graph dataset](https://gephi.org/datasets/diseasome.gexf.zip) for this visualization comes from the <a href="https://gephi.wordpress.com/2009/07/02/diseasome-explore-the-human-disease-network/">Diseasome project</a> by Mathieu Bastian and Sébastien Heymann. In its original version the [interactive graph](/vis/human-disease-network/) used their dataset as is. The current version created in November 2018 uses the same coloring and sizes but a different layout applied in [Gephi](https://gephi.org/) and is rendered in the browser with [sigma.js](https://sigmajs.org/).

## Graph Navigation

You can zoom in and out the graph with the mouse wheel. You can move the graph by clicking and holding the left mouse button and moving the mouse. When you zoom into the graph more node names will be shown. To highlight disorders or genes and their connections type the name in the top menu's search form.