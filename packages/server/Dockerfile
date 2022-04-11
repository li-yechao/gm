FROM node:16-slim AS build

WORKDIR /app

COPY . /app

RUN yarn install && \
	yarn build && \
	yarn install --prod && \
	rm -rf /target && \
	mkdir -p /target && \
	cp -r /app/package.json /app/node_modules /app/dist /app/.env /target/

FROM node:16-slim

WORKDIR /app/

RUN apt-get update && \
	apt-get install -y graphicsmagick && \
	apt-get clean autoclean && \
	apt-get autoremove -y && \
	rm -rf /var/lib/{apt,dpkg,cache,log}/

COPY --from=build /target .

CMD ["yarn", "start"]
