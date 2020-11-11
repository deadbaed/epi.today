# build stage
FROM node:10 AS BUILDER

WORKDIR /usr/src/build/epi.today

ADD . .

RUN npm install --silent

RUN npm run build

# final stage
FROM node:10

# copy build files
WORKDIR /usr/src/final/epi.today/build
COPY --from=builder /usr/src/build/epi.today/build .

# copy public files
WORKDIR /usr/src/final/epi.today/public
COPY --from=builder /usr/src/build/epi.today/public .

# copy template files
WORKDIR /usr/src/final/epi.today/views
COPY --from=builder /usr/src/build/epi.today/views .

# copy npm stuff
WORKDIR /usr/src/final/epi.today
COPY --from=builder /usr/src/build/epi.today/package.json .
COPY --from=builder /usr/src/build/epi.today/package-lock.json .
ADD .env-docker .env

RUN npm install --only=prod --silent

EXPOSE 8042

CMD [ "node", "build/app.js" ]
