MAKE = make
DOCKER = docker
IMAGE_NAME = fluzz-server

.dockerbuild: Dockerfile requirements.txt
	@$(DOCKER) build -t $(IMAGE_NAME) .
	@touch $@

run: .dockerbuild
	$(DOCKER) run \
		-ti --rm \
		-p 0.0.0.0:5000:5000 \
		-v $(CURDIR)/app:/app \
		$(IMAGE_NAME)

frontend: 
	$(MAKE) -C app/frontend build

frontend-watch:
	$(MAKE) -C app/frontend watch

.PHONY: run frontend
