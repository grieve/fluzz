REQUIREMENTS = gulp webpack
K := $(foreach exec,$(REQUIREMENTS),\
	$(if \
		$(shell which $(exec)),\
		some string,\
		$(error '$(exec)' not found. Please run `make setup`)\
	)\
)


setup: node_modules
	@sudo npm install -g gulp webpack

node_modules: package.json
	@npm install
	@touch $@

build: node_modules
	gulp build

watch: node_modules
	gulp watch

clean: 
	@rm -f ../static/js/*.bundle.js*


.PHONY: setup build watch
