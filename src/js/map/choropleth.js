let animation = null;


function animate(map, columns, interval_length=300, selector='#animate') {
    d3.select(selector).on('click', () => {
        clearInterval(animation);
        let cols = columns.slice();
        animation = setInterval(() => {
            selected_col = cols.shift();
            if (selected_col) {
                map.column(selected_col).update();
            } else {
                clearInterval(animation);
            }
        }, interval_length);
    });
}


function colSelect(map, columns, selector='#col-select') {
    let selection = d3.select(selector);
    selection.selectAll('li').data(columns).enter()
        .append('li').append('a')
            .text(d => d)
            .on('click', () => {
                clearInterval(animation);
                selected_col = d3.event.target.text;
                map.column(selected_col).update();
            });
}


function annotate(map, rect_height=75, x_offset=160, title='', data_source='') {
    let footer_width = map.width() - x_offset;
    let map_source = 'https://exploring-data.com' + document.location.pathname;

    // Hack to move legend to the right
    // let legend = map.svg.select('g.legend');
    // let [x, y] = legend.attr('transform').match(/(\d+)/g);
    // legend.attr('transform', `translate(${x + map.width() / 24}, ${y})`);

    d3.select('g.footer').remove();

    let g = map.svg.append('g')
        .attr('class', 'footer')
        .attr('width', '100%')
        .attr('height', rect_height)
        .attr('transform', `translate(0, ${map.height() - rect_height})`);

    g.append('rect')
        .attr('class', 'footer')
        .attr('width', footer_width)
        .attr('height', rect_height)
        .attr('x', x_offset);

    g.append('text')
        .attr('class', 'title')
        .attr('width', footer_width)
        .attr('x', x_offset)
        .attr('y', 20)
        .text(title || map.column());

    g.append('text')
        .attr('width', footer_width)
        .attr('x', x_offset)
        .attr('y', 36)
        .text('Data: ');

    g.append('svg:a')
        .attr('xlink:href', data_source)
        .append('svg:text')
            .text(data_source.replace(/https?:\/\//, ''))
            .attr('class', 'link')
            .attr('x', x_offset + 32)
            .attr('y', 36);

    g.append('text')
        .attr('width', footer_width)
        .attr('x', x_offset)
        .attr('y', 52)
        .text('Source: ');

    g.append('svg:a')
        .attr('xlink:href', map_source)
        .append('svg:text')
            .text(map_source.replace('https://', ''))
            .attr('class', 'link')
            .attr('x', x_offset + 45)
            .attr('y', 52);

    g.append('text')
        .attr('x', x_offset)
        .attr('y', 68)
        .text('Author: ');

    g.append('svg:a')
        .attr('xlink:href', 'https://ramiro.org/')
        .append('svg:text')
            .text('Ramiro Gómez - ramiro.org')
            .attr('class', 'link')
            .attr('x', x_offset + 42)
            .attr('y', 68);
}