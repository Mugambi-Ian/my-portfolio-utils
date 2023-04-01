FROM node:latest
RUN apt-get update
RUN apt-get install -y build-essential gcc autoconf automake zlib1g-dev libpng-dev nasm bash libvips-dev yarn fonts-liberation gconf-service libappindicator1 libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgbm-dev libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils
ARG APP_PORT=5555
ENV APP_PORT=${APP_PORT}
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN yarn install --frozen-lockfile
RUN yarn export
EXPOSE 5555
CMD ["npm", "run", "start"]
