docker rm portfolio-utils -f
docker rmi portfolio-utils -f
docker build -t "portfolio-utils" . --network="host"
docker run  -d --name "portfolio-utils" -t  -i -p 5555:5555 portfolio-utils
