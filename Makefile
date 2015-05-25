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

frontend: 
	$(MAKE) -C app/frontend build

frontend-watch:
	$(MAKE) -C app/frontend watch

.PHONY: run frontend
