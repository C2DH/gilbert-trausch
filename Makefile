BUILD_TAG ?= latest

build:
	docker build -t c2dhunilu/gilbert-trausch:${BUILD_TAG} \
	--build-arg BUILD_DATE=$(shell date -u +'%Y-%m-%dT%H:%M:%SZ') \
	--build-arg GIT_TAG=latest \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg GIT_COMMIT_SHA=$(shell git rev-parse --short HEAD) \
	--build-arg GIT_LAST_COMMIT_DATE=$(shell git log -1 --format=%cd --date=format:%Y-%m-%d) .