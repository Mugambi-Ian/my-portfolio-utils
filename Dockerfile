# Install dependencies only when needed
FROM --platform=linux/amd64 node:18  AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#node20 to understand why libc6-compat might be needed.

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn

FROM --platform=linux/amd64 node:18 AS runner

WORKDIR /opt/app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get update \
    && apt-get install -y libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn postinstall


RUN yarn export

ENV PORT=4000
EXPOSE 4000

CMD ["yarn", "start"]
