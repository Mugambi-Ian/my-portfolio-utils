# Stage 1: Install dependencies only when needed
FROM node:20 AS deps
# Check https://github.com/nodejs/docker-node/tree/main for latest details

WORKDIR /opt/app
COPY package.json yarn.lock ./

# Stage 2: Prepare runtime environment
FROM  node:20 AS runner

WORKDIR /opt/app

# Install system dependencies for Chromium & other libraries
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      libasound2 wget gnupg libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 \
       libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3 libxss1 \
       fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*


# Ensure non-root user for better security (e.g., Puppeteer compatibility)
RUN groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

COPY . .

# Ensure compatibility with monorepos / workspaces
RUN yarn workspaces focus --all || yarn install

# Build & Export
RUN yarn export

# Set environment variables
ENV PORT=1338
EXPOSE 1338

# Start the application
CMD ["yarn", "start"]
