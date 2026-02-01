MERCH=$(wildcard src/img/print/*.*)
MERCH_LARGE=$(subst src/img/print/,static/img/print/large/,$(MERCH))
MERCH_PREVIEW=$(subst src/img/print/,static/img/print/preview/,$(MERCH))
MERCHMANAGER=~/repos/priv/merchmanager
MERCHMANAGER_PYTHON=~/.virtualenvs/merchmanager/bin/python
PRODUCT_MAPPING=exploringdata-product-mapping.csv
TEST_IMG_SRC=src/img/print/programming-languages-influence-network-2019.jpg
WATERMARK=src/img/watermark.png


define dl_optimize_image
	$(eval FILENAME := $(notdir $(1)))
	$(eval OUTPUT := static/img/public/$(FILENAME))
	@echo "Downloading and optimizing image from $(1)..."
	@curl --location --silent --show-error --fail $(1) | \
		pngquant --speed 1 --quality 65-80 - | \
		tee $(OUTPUT) > /dev/null
	@echo "Image processed and saved to $(OUTPUT)"
endef


clean_all: clean_compiled clean_design clean_images


clean_compiled:
	rm -rf static/compiled/*


clean_design:
	rm -f content/design/*


clean_images:
	rm -f static/img/print/large/*
	rm -f static/img/print/preview/*


dl_images:
	$(call dl_optimize_image,https://unpkg.com/three-globe/example/img/earth-topology.png)
	$(call dl_optimize_image,https://unpkg.com/three-globe/example/img/night-sky.png)


favicon:
	convert src/img/ed.png -resize 256x256 \
		-define icon:auto-resize=16,32,48,64,128,256 static/favicon.ico


images: $(MERCH_LARGE) $(MERCH_PREVIEW)


import_designs:
	$(MERCHMANAGER_PYTHON) $(MERCHMANAGER)/export_logya.py $(MERCHMANAGER)/data/$(PRODUCT_MAPPING) . --design_alias 'print' --index 'prints' --index_title 'Prints for Data Geeks & Nerds' --image_dir 'src/img/print' --main_product 'Poster'


logo:
	convert -background transparent -resize ^20x20 src/img/ed.svg src/img/ed-20.png
	convert -background transparent -resize ^42x42 src/img/ed.svg static/img/exploring-data.png


static/img/print/large/%: src/img/print/%
	composite -dissolve 50% -gravity center $(WATERMARK) $< $@


static/img/print/preview/%: src/img/print/%
	convert $< -resize x300\> -background white -gravity center $@


test_image_resizing:
	rm test/*.jpg
	composite -dissolve 50% -gravity center $(WATERMARK) $(TEST_IMG_SRC) test/product_large.jpg
	convert $(TEST_IMG_SRC) -resize x300\> -background white -gravity center test/product_preview.jpg


update_merch:
	$(MAKE) import_designs
	$(MAKE) images
	./deploy.sh


update_vendor:
	npm update
