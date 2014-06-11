[Exploring Data](http://exploringdata.github.com/)

* GH Archive: Pull requests to different repos by users/language.
* How are World Leaders Connected by Google Searches

# TODOs

* World Aid Transparency: label font sizes in firefox
* Upgrade earthquakes to d3.v3, with different colors for countries and sea
* add visual legends that explain gaphs, size, color etc

## Sigma

* Zoom with buttons instead of mousewheel, closable div with details instead of modal see http://retts.net/viz/elmcip_events_all_pres_connected/
* Restict nodes to set filter when highlighting nodes
* Show node labels for faded sigma graph nodes on mouseover
* don't split explaining text in post and help/Single help button with generic info for all sigma graphs?

# Fix git repo

$ git gc
error: Could not read 8c297d8b1e8be5abc7673a79cd973a653578655e
fatal: bad tree object 8c297d8b1e8be5abc7673a79cd973a653578655e
error: failed to run repack


https://github.com/exploringdata/exploringdata.github.com/commit/4aabfccdcf6fc0045492c337ae60d4016c6fa5bd

https://github.com/exploringdata/exploringdata.github.com/commit/ccdab70d429d1e35ca65e8d1670906aef0756864

http://git.kernel.org/cgit/git/git.git/tree/Documentation/howto/recover-corrupted-blob-object.txt

http://stackoverflow.com/questions/14797978/git-recovery-object-file-is-empty-how-to-recreate-trees

## STEPS

git rev-list --all | xargs -l -I '{}' sh -c 'if git ls-tree -rt {} > /dev/null 2>&1 ; then true; else git log --oneline -1 {}; git ls-tree -r -t {} | tail -1; fi'

git diff 31cc332 4cc73b7

git ckeckout 31cc332

git diff 31cc332 09a1104 > ~/repos/fix/exploringdata/patch.31cc332

git apply --ignore-space-change --ignore-whitespace patch.31cc332

git commit -am'fixed sigma graph resizing'