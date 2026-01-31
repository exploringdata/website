data = null
graph = {
    nodes: [],
    links: [],
    config: null
}
node_map = {}
path = null
sep = {
    link: ' → '
}
svg = null
text_suffix = '\n\nClick to see the migrated players.'

add_node = (name)->
    if not node_map.hasOwnProperty name
        graph.nodes.push({name: name})
        node_map[name] = graph.nodes.length - 1
    return node_map[name]


node_name = (s)->
    s.replace /[FT]:/, ''


node_text = (d)->
    node_name(d.name) + ': ' + d.value


link_text = (d)->
    node_name(d.source.name) + sep.link + node_name(d.target.name) + ': ' + d.value


is_from = (s)->
    s.indexOf('F:') is 0


make_graph = (config) ->
    agg_links = {}
    graph.config = config

    # aggregate links
    for record in data
        from_node = add_node('F:' + record[config.from.key])
        to_node = add_node('T:' + record[config.to.key])

        link_key = from_node + '|' + to_node
        if not agg_links.hasOwnProperty link_key
            agg_links[link_key] = 0

        agg_val = null
        if config.aggregate.key
            agg_val = parseInt record[config.aggregate.key], 10
        else
            agg_val = config.aggregate.value

        agg_links[link_key] += agg_val

    # create links
    for key, val of agg_links
        nodes = key.split('|')
        graph.links.push {
            key: key,
            source: graph.nodes[nodes[0]],
            target: graph.nodes[nodes[1]],
            value: val}


draw_sankey = ()->
    width = parseInt(d3.select('#vis').style('width').replace('px', ''))
    if width < 400
        width = 400

    # create vis
    margin = {top: 1, right: 1, bottom: 6, left: 1}
    width = width - margin.left - margin.right
    height = 1080 - margin.top - margin.bottom

    color = d3.scale.category20()

    svg = d3.select('#vis').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(7)
        .size([width, height])
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32)

    path = sankey.link()
    link = svg.append('g').selectAll('.link')
        .data(graph.links)

    link.enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', (d)-> Math.max(1, d.dy))
        .sort((a, b)-> b.dy - a.dy)
        .on('click', link_click)
        .append('title')
            .text((d)-> link_text(d) + text_suffix)

    node = svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', (d)-> 'translate(' + d.x + ',' + d.y + ')')

    node.append('rect')
        .attr('height', (d)-> d.dy)
        .attr('width', sankey.nodeWidth())
        .style('fill', (d)-> d.color = color(node_name(d.name)))
        .style('stroke', (d)-> d3.rgb(d.color).darker(2))
        .on('click', node_click)
        .append('title')
            .text((d)-> node_text(d) + text_suffix)

    node.append('text')
        .attr('x', -6)
        .attr('y', (d)-> d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .text((d)-> node_name(d.name))
        .filter((d)->  d.x < width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')


update_links = (links)->
    svg.selectAll('path.link')
        .style('opacity', (d)-> if d in links then 1 else 0)


draw_rankings = ()->
    bar_options = {}
    bar_options.width = parseInt d3.select('#sidebar').style('width').replace('px', ''), 10

    rank = graph.links.sort (a, b)-> b.value - a.value
    bar_data = []
    for d in rank.slice(0, 10)
        bar_data.push {
            name: link_text(d),
            value: d.value}
    barh '#top-paths', bar_data, bar_options

    from = graph.nodes.filter((d) -> is_from(d.name))
    rank = from.sort (a, b)-> b.value - a.value
    bar_data = []
    for d in rank.slice(0, 10)
        bar_data.push {name: node_text(d), value: d.value}
    barh '#most-emigrations', bar_data, bar_options

    to = graph.nodes.filter((d) -> not is_from(d.name))
    rank = to.sort (a, b)-> b.value - a.value
    bar_data = []
    for d in rank.slice(0, 10)
        bar_data.push {name: node_text(d), value: d.value}
    barh '#most-immigrations', bar_data, bar_options


show_players = (players)->
    players = players.sort (a, b)-> if a.firstName > b.firstName then 1 else -1
    d3.select('#overlay').style('display', 'block')
    container = d3.select('#detail-info')
    container.selectAll('div.row').remove()
    container.selectAll('div').data(players).enter().append('div')
        .attr('class', 'row')
        .html((d)->
            '<div class="col-md-2"><img class="img-thumbnail" src="' + d.image + '"/></div>' + '<div class="player-info col-md-10"><h5>' + d.firstName + ' ' + d.lastName + ': ' + d.birthCountry + sep.link + d.nationality + '</h5></div>'
        )


position_detail_info = ()->
    d3.select('#rankings').style('display', 'none')
    d3.select('#overlay').style('top', window.pageYOffset + 'px')


node_click = (d)->
    position_detail_info()
    if is_from d.name
        update_links d.sourceLinks
        key = 'birthCountry'
    else
        update_links d.targetLinks
        key = 'nationality'

    players = []
    country = node_name(d.name)
    for rec in data
        if country == rec[key]
            players.push rec
    show_players players


link_click = (d)->
    position_detail_info()
    update_links [d]

    players = []
    for rec in data
        if node_name(d.source.name) == rec.birthCountry and node_name(d.target.name) == rec.nationality
            players.push rec
    show_players players


init_sankey = (config, csv)->
    data = csv
    make_graph config
    draw_sankey()
    draw_rankings()

    d3.select('#close-overlay')
        .on('click', ()->
            d3.select('#overlay').style('display', 'none')
            d3.select('#rankings').style('display', 'block')
            update_links graph.links)


(exports? or this).init_sankey = init_sankey