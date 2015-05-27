MAKE = make
DOCKER = docker
IMAGE_NAME = fluzz-server
DB_IMAGE_NAME = rethinkdb

.dockerbuild: Dockerfile requirements.txt
	@$(DOCKER) build -t $(IMAGE_NAME) .
	@touch $@

database:
	-$(DOCKER) run \
		-d \
		-v $(CURDIR)/.data:/data \
		-p 0.0.0.0:8080:8080 \
		--name fluzz-database \
		$(DB_IMAGE_NAME)
	@sleep 2 # to ensure db is up


run: .dockerbuild database
	$(DOCKER) run \
		-ti --rm \
		--link fluzz-database:database \
		-p 0.0.0.0:5000:5000 \
		-v $(CURDIR)/app:/app \
		$(IMAGE_NAME)

shell: .dockerbuild
	$(DOCKER) run \
		-ti --rm \
		-p 0.0.0.0:5000:5000 \
		-v $(CURDIR)/app:/app \
		$(IMAGE_NAME) \
		bash

clean:
	find . -name "*.pyc" -exec rm -rf {} \;
	find . -name "*.swp" -exec rm -rf {} \;
	find . -name "*.swo" -exec rm -rf {} \;
	find . -name "node_modules" -exec rm -rf '{}' +


frontend: 
	$(MAKE) -C app/frontend build

frontend-watch:
	$(MAKE) -C app/frontend watch

deploy: 
	$(MAKE) -C app/frontend build
	$(DOCKER) build -t $(IMAGE_NAME)-deploy .
	$(DOCKER) tag -f $(IMAGE_NAME)-deploy ida.ryangrieve.com/fluzz
	$(DOCKER) push ida.ryangrieve.com/fluzz



.PHONY: run frontend
