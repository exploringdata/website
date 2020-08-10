MERCH=$(wildcard src/img/print/*.*)
MERCH_LARGE=$(subst src/img/print/,static/img/print/large/,$(MERCH))
MERCH_PREVIEW=$(subst src/img/print/,static/img/print/preview/,$(MERCH))
MERCHMANAGER=~/repos/priv/merchmanager
MERCHMANAGER_PYTHON=~/anaconda3/envs/dm/bin/python
PRODUCT_MAPPING=exploringdata-product-mapping.csv
WATERMARK=src/img/watermark.png


clean_all: clean_compiled clean_design clean_images


clean_compiled:
	rm -rf static/compiled/*


clean_design:
	rm -f content/design/*


clean_images:
	rm -f static/img/print/large/*
	rm -f static/img/print/preview/*


images: $(MERCH_LARGE) $(MERCH_PREVIEW)


import_designs:
	$(MERCHMANAGER_PYTHON) $(MERCHMANAGER)/export_logya.py $(MERCHMANAGER)/data/$(PRODUCT_MAPPING) . --design_alias 'print' --index 'prints' --index_title 'Prints for Data Geeks & Nerds' --image_dir 'src/img/print'


static/img/print/large/%: src/img/print/%
	composite -dissolve 30% -gravity south $(WATERMARK) $< $@


static/img/print/preview/%: src/img/print/%
	convert $< -resize x300\> -background white -gravity center -extent 300x360 -crop 250x250+0-25 +repage $@


update_vendor:
	npm update
