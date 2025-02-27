docker rm "portfolio.online" -f
docker rmi "portfolio.online" -f

COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
docker run -d --restart unless-stopped -p 1338:1338 --name "portfolio.online" -i -t "portfolio.online"