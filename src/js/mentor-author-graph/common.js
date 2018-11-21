function bookLinks(attr) {
    let links = [];
    if (attr.hasOwnProperty('asin')) {
        links.push(`<a href="${attr.url}">Amazon.com</a>`);
        links.push(`<a href="https://openlibrary.org/search?isbn=${attr.asin}&mode=everything">Open Library</a>`);
    } else {
        links.push(`<a href="https://www.amazon.com/gp/search?ie=UTF8&tag=xpdt-20&index=books&keywords=${encodeURIComponent(attr.title)}">Amazon.com</a>`);
        links.push(`<a href="https://openlibrary.org/search?q=${encodeURIComponent(attr.title)}&mode=everything">Open Library</a>`);
    }
    links.push(`<a href="https://www.overdrive.com/search?q=${encodeURIComponent(attr.title)}">Overdrive</a>`);
    return links;
}
