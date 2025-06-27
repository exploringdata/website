barh = (selector, data, options)->

    if options and options.width
        width = options.width
    else
        width = 400
    bar_height = 26


    x = d3.scale.linear()
        .domain([0, d3.max(data, (d)-> d.value)])
        .range([0, width]);

    chart = d3.select(selector)
        .attr('width', width)
        .attr('height', bar_height * data.length)

    bar = chart.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', (d, i)-> 'translate(0,' + i * bar_height + ')')

    bar.append('rect')
        .attr('width', (d) -> x(d.value))
        .attr('height', bar_height - 4)

    bar.append('text')
        .attr('x', 3)
        .attr('y', bar_height / 2)
        .attr('dy', bar_height / 16)
        .text((d)-> d.name)


(exports? or this).barh = barh