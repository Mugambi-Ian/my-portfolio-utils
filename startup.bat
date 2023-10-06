docker rm "portfolio.online" -f
docker rmi "portfolio.online" -f

COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
docker run -d  -p 1338:1338 --name "portfolio.online" --network portfolio-network -i -t "portfolio.online" 