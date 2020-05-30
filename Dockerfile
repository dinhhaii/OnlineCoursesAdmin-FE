FROM node:12

WORKDIR /usr/src/fe-hacademy-admin

COPY package*.json ./

RUN npm install -f

COPY ./ ./

EXPOSE 3002

CMD ["npm", "start"]