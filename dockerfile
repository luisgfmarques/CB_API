FROM node

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . /app

EXPOSE 8000

CMD ["npm", "start"]
