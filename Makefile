MERCH=$(wildcard src/img/print/*.*)
MERCH_LARGE=$(subst src/img/print/,static/img/print/large/,$(MERCH))
MERCH_PREVIEW=$(subst src/img/print/,static/img/print/preview/,$(MERCH))
MERCHMANAGER=~/repos/priv/merchmanager
MERCHMANAGER_PYTHON=~/.virtualenvs/merchmanager/bin/python
PRODUCT_MAPPING=exploringdata-product-mapping.csv
TEST_IMG_SRC=src/img/print/programming-languages-influence-network-2019.jpg
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
	$(MERCHMANAGER_PYTHON) $(MERCHMANAGER)/export_logya.py $(MERCHMANAGER)/data/$(PRODUCT_MAPPING) . --design_alias 'print' --index 'prints' --index_title 'Prints for Data Geeks & Nerds' --image_dir 'src/img/print' --image_product 'Poster'


static/img/print/large/%: src/img/print/%
	composite -dissolve 50% -gravity center $(WATERMARK) $< $@


static/img/print/preview/%: src/img/print/%
	convert $< -resize x300\> -background white -gravity center $@


test_image_resizing:
	rm test/*.jpg
	composite -dissolve 50% -gravity center $(WATERMARK) $(TEST_IMG_SRC) test/product_large.jpg
	convert $(TEST_IMG_SRC) -resize x300\> -background white -gravity center test/product_preview.jpg


update_merch:
	$(Make) import_designs
	$(Make) images
	./deploy.sh


update_vendor:
	npm update
