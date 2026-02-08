.PHONY: *

install:
	@yarn install

prisma-dev:
	@yarn prisma generate
	@yarn prisma migrate dev

prisma-prod: 
	@yarn prisma generate
	@yarn prisma migrate deploy

build:
	@yarn build

start:
	@$(MAKE) install
	@$(MAKE) prisma-dev
	@yarn start

start-dev:
	@$(MAKE) install
	@$(MAKE) prisma-dev
	@yarn start:dev

start-prod:
	@$(MAKE) install
	@$(MAKE) prisma-prod
	@$(MAKE) build
	@yarn start:prod
