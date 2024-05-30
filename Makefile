#!/usr/bin/make

.PHONY: build test help
.DEFAULT_GOAL := help


install: ## install all deps
	@npm install --no-fund --no-audit --quiet
	@docker compose run --no-deps --rm server npm ci --no-fund --no-audit --quiet

start: install ## start the project in foreground
	@docker compose up server

run: install ## start the project in background
	@docker compose up -d server

test: ## run all tests
	@docker compose run --rm -e NODE_ENV=test server npm run test:ci

stop: ## Stop and remove all containers forcefully
	@docker compose down --remove-orphans

clean: stop ## remove running containers, volumes, node_modules & anything else
	@docker compose rm --force -v
	@rm -rf node_modules coverage src/openapi.json dist

help: ## help to deplay this
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
