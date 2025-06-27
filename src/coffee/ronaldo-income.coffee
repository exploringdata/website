set_val = (selector, val)-> $(selector).each (idx, e) -> e.innerHTML = val

euro_to_dollar = 1.24 # conversion rate as of Nov 12, 2014
income_ronaldo = 8e7 / euro_to_dollar # Ronaldo's income in 2014: 80 million USD
gain_ortega = 7e9 / euro_to_dollar # Ortega added $7 billion to his fortune http://www.forbes.com/profile/amancio-ortega/
spain_avg_wage = 2019 * 12 # gross wage from http://en.wikipedia.org/wiki/List_of_European_countries_by_average_wage

factor_avg_wage = parseInt(income_ronaldo / spain_avg_wage, 10)
factor_ortega = parseInt(gain_ortega / income_ronaldo, 10)
factor_ortega_avg_wage = factor_ortega * factor_avg_wage

set_val '.answer-avg-wage', factor_avg_wage
set_val '.answer-ortega', factor_ortega
set_val '.workers-lives', parseInt(factor_avg_wage / 50, 10)
set_val '.ortega-avg-wage', factor_ortega_avg_wage


container = document.getElementById('avg-wage')
for num in [1..factor_avg_wage]
    e = document.createElement('div')
    e.setAttribute('class', 'worker icon')
    container.appendChild(e)


container = document.getElementById('ortega')
for num in [1..factor_ortega]
    e = document.createElement('div')
    e.setAttribute('class', 'ronaldo icon')
    container.appendChild(e)