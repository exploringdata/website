---
title: Data Mining and Data Visualization
description: Exploring Data is a showcase of interactive data visualizations comprising topics like world aid flow, climate change, programming languages, football, knowledge graph relations, and networks.
created: 2012-09-07 18:35:00
template: base2.html
image: /img/exploringdata.jpg
pre_render: [body]
---
{% import 'macros.html' as m %}
{% set excluded_templates = [
  'print.html',
  'page-with-sidebar.html'
] %}
{% set docs = get_docs('/') | selectattr('image') | rejectattr('template', 'in', excluded_templates) | list %}
{{ m.content_gallery(docs, limit=8) }}