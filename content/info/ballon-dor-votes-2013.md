---
url: /info/ballon-dor-male-players-votes-2013/
related: /vis/ballon-dor-male-players-votes-2013/
title: Falcao and Iniesta the top players in 2013 according to Ronaldo and Messi
description: The Ballon d'Or 2013 visualization shows an interactive network graph of voters and voted football players related based on votes cast for the male FIFA Ballon d'Or award in 2013.
template: post.html
created: 2014-01-13 21:50:20
image: /img/preview/ballon-dor-male-players-2013.jpg
tags: [network graph, football, sigmajs, gephi, networkx, interactive]
---
For the 2nd time in his career a visibly moved Cristiano Ronaldo won the FIFA Ballon d'Or. Although many people expected him to win in 2013, the final vote tally reveals a tighter finish than [in the past year](/info/ballon-dor-votes-2012/):

- [Cristiano Ronaldo](/vis/ballon-dor-male-players-votes-2013/#Cristiano Ronaldo): 28.03%
- [Lionel Messi](/vis/ballon-dor-male-players-votes-2013/#Messi Lionel): 24.74%
- [Franck Ribéry](/vis/ballon-dor-male-players-votes-2013/#Ribéry Franck): 23.14%

Ronaldo scored 66 goals in 56 matches in 2013 (Messi 91 goals in 2012) but didn't win important titles, Ribéry won 5 in 2013. Still Ronaldo, who certainly benefited from the extension of the voting period, has had a tremendous year and many regard him as the best player in his current form.

## Voting Breakdown

Let's see which players scored best with the individual groups of voters.

### Captains Votes

![Imgur](http://i.imgur.com/QwiuyIH.png)

### Coaches Votes

![Imgur](http://i.imgur.com/VHsclQH.png)

### Media Votes

![Imgur](http://i.imgur.com/xnaU15V.png)

So Ribéry won media pretty clearly and Ronaldo won coaches and captains.

### How Messi, Ronaldo and Ibrahimovic voted

Some tidbits from the voting behaviour of these 3 team captains, who all played on a top level in 2013.

#### Cristiano Ronaldo voted

1. [Radamel Falcao](/vis/ballon-dor-male-players-votes-2013/#Falcao Radamel)
2. [Gareth Bale](/vis/ballon-dor-male-players-votes-2013/#Bale Gareth)
3. [Mesut Özil](/vis/ballon-dor-male-players-votes-2013/#Özil Mesut)

#### Lionel Messi voted

1. [Andrés Iniesta](/vis/ballon-dor-male-players-votes-2013/#Iniesta Andrés)
2. [Xavi](/vis/ballon-dor-male-players-votes-2013/#Xavi)
3. [Neymar](/vis/ballon-dor-male-players-votes-2013/#Neymar)

#### Zlatan Ibrahimovic voted

1. [Franck Ribéry](/vis/ballon-dor-male-players-votes-2013/#Ribéry Franck)
2. [Lionel Messi](/vis/ballon-dor-male-players-votes-2013/#Messi Lionel)
3. [Cristiano Ronaldo](/vis/ballon-dor-male-players-votes-2013/#Cristiano Ronaldo)

Unsurprisingly, neither Ronaldo nor Messi wanted to help their main competitors. Both prefer their team mates with the exception of Ronaldo's number 1 [Radamel Falcao](/vis/ballon-dor-male-players-votes-2013/#Falcao Radamel). I was a bit surprised to see [Zlatan Ibrahimovic](/vis/ballon-dor-male-players-votes-2013/#Ibrahimovic Zlatan) not voting for himself 3 times, if someone was capable of doing so, it was certainly him ;-)

Be it as it is congratulations to Cristiano Ronaldo!

## About the Visualization

The [network graph](/vis/ballon-dor-male-players-votes-2013/) is interactive, you can click on nodes to highlight their connections or search nodes from the top menu. You can zoom in and out with the mouse wheel and move the graph by clicking and dragging the mouse.

Players are colored in red, captains in a darker red brown tone, coaches in dark and media people in light blue. For voters in the graph (captains, coaches, media people) the vote breakdown is shown when the mouse is moved over the corresponding node.

The voting data is retrieved from this [PDF document](http://www.fifa.com/mm/document/ballond%27or/playeroftheyear%28men%29/02/26/02/68/fboaward_menplayer2013_neutral.pdf). The graph file was created with a [Python script](https://github.com/exploringdata/ballon-dor-votes-2013) and preprocessed using the [Gephi visualization platform](https://gephi.org/) to apply a Force Atlas layout as well as node sizing and coloring. The [interactive version](/vis/ballon-dor-male-players-votes-2013/) is rendered with the [JavaScript library sigma.js](http://sigmajs.org/).