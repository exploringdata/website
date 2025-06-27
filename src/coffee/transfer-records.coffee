node_map = {}
agg_transfers = {}
graph = {
    nodes: [],
    links: [],
    data: null,
    summary: {
        total: 0
    },
    teams: {},
    players: {}
}
formatNumber = d3.format(',.0f')
format = (d)-> formatNumber(d) + '€'


add_node = (name)->
    if not node_map.hasOwnProperty name
        graph.nodes.push({name: name})
        node_map[name] = graph.nodes.length - 1
    return node_map[name]


add_team_fee = (name, fee)->
    if not graph.teams.hasOwnProperty name
        graph.teams[name] = 0
    graph.teams[name] += fee


add_player_fee = (name, fee)->
    if not graph.players.hasOwnProperty name
        graph.players[name] = 0
    graph.players[name] += fee


team_name = (s)->
    s.replace /[FT]:/, ''


make_graph = (csv) ->
    graph.data = csv

    # aggregate transfers
    for row in csv
        from_team = add_node('F:' + row['From Team Name'])
        to_team = add_node('T:' + row['To Team Name'])

        transfer_key = from_team + '|' + to_team
        if not agg_transfers.hasOwnProperty transfer_key
            agg_transfers[transfer_key] = 0

        fee = parseInt(row['Transfer Fee'])
        agg_transfers[transfer_key] += fee
        graph.summary.total += fee

        # team stats
        add_team_fee from_team, fee
        add_team_fee to_team, -fee

        # player stats
        add_player_fee row['Player Name'], fee

    # create links
    for key, fee of agg_transfers
        teams = key.split('|')
        graph.links.push {
            source: graph.nodes[teams[0]],
            target: graph.nodes[teams[1]],
            value: fee}


transfer_row = (row)->
    '<tr><td>' + row['Rank'] + '</td><td>' + row['Player Name'] + '</td><td>' + row['From Team Name'] + '</td><td>' + row['To Team Name'] + '</td><td>' + row['Transfer Season'] + '</td><td>' + format(row['Transfer Fee']) + '</td></tr>'


transfer_modal = (rows)->
    d3.select('#transfer-table tbody').html rows.join('')
    tm = d3.select('#transfer-modal')
    tm.style('display', 'block')
    top = window.pageYOffset + 200
    tm.style('top', top.toString() + 'px')

close_modal = ()->
    d3.select('#transfer-modal').style('display', 'None')


money_flow_table = ()->
    graph.links = graph.links.sort((a, b)-> b.value - a.value)

    table = d3.select('#team-money-flow tbody')
    rows = []
    for idx, link of graph.links.slice(0, 15)
        rows.push '<tr><td>' + team_name(link.source.name) + '</td><td>' + team_name(link.target.name) + '</td><td>' + format(link.value) + '</td></tr>'
    table.html rows.join('')


node_info = (d)->
    if d.name[0] == 'F'
        key = 'From Team Name'
        suffix = 'from '
    else
        key = 'To Team Name'
        suffix = 'to '

    rows = []
    tname = team_name d.name
    for row in graph.data
        if row[key] == tname
            rows.push transfer_row row

    transfer_modal rows
    d3.select('#transfer-table-suffix').text(suffix + tname)


link_info = (d)->
    from_team = team_name d.source.name
    to_team = team_name d.target.name
    rows = []
    for row in graph.data
        if row['From Team Name'] == from_team and row['To Team Name'] == to_team
            rows.push transfer_row row

    transfer_modal rows
    d3.select('#transfer-table-suffix').text(from_team + ' to ' + to_team)


draw_sankey = ()->
    width = parseInt(d3.select('#vis').style('width').replace('px', ''))
    if width < 400
        width = 400

    click_hint = '\n\nClick for more details.'

    # create vis
    margin = {top: 1, right: 1, bottom: 6, left: 1}
    width = width - margin.left - margin.right
    height = 1200 - margin.top - margin.bottom

    color = d3.scale.category20()

    svg = d3.select('#vis').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height])
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(46)

    path = sankey.link()

    link = svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', (d)-> Math.max(1, d.dy))
        .sort((a, b)-> b.dy - a.dy)
        .on('click', link_info)

    link.append('title')
        .text((d)->
            team_name(d.source.name) + ' → ' + team_name(d.target.name) + '\n' + format(d.value) + click_hint)

    node = svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', (d)-> 'translate(' + d.x + ',' + d.y + ')')

    node.append('rect')
        .attr('height', (d)-> d.dy)
        .attr('width', sankey.nodeWidth())
        .style('fill', (d)-> d.color = color(team_name(d.name)))
        .style('stroke', (d)-> d3.rgb(d.color).darker(2))
        .on('click', node_info)
        .append('title')
        .text((d)-> team_name(d.name) + '\n' + format(d.value) + click_hint)

    node.append('text')
        .attr('x', -6)
        .attr('y', (d)-> d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .text((d)-> team_name(d.name))
        .filter((d)->  d.x < width / 2)
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start')


summary = ()->
    d3.select('#summary-total').text(format(graph.summary.total))

    # convert teams into an sorted (desc) array
    graph.teams = d3.entries(graph.teams).sort((a, b)-> b.value - a.value)

    # team stats
    team_spent = graph.teams[graph.teams.length - 1]
    team_spent_name = team_name graph.nodes[team_spent.key].name
    d3.select('#summary-team-spent').text(team_spent_name)
    d3.select('#summary-team-spent-total').text(format(team_spent.value))

    team_spent = graph.teams[0]
    team_spent_name = team_name graph.nodes[team_spent.key].name
    d3.select('#summary-team-earned').text(team_spent_name)
    d3.select('#summary-team-earned-total').text(format(team_spent.value))

    # player stats
    graph.players = d3.entries(graph.players).sort((a, b)-> b.value - a.value)
    player = graph.players[0]
    d3.select('#summary-player').text(player.key)
    d3.select('#summary-player-total').text(format(player.value))


init_sankey = (error, csv)->
    make_graph csv
    draw_sankey()
    summary()
    money_flow_table()
    d3.select('#transfer-modal .close').on('click', close_modal)
    document.body.onkeydown = (e)-> e.keyCode == 27 and close_modal()


(exports? or this).init_sankey = init_sankey