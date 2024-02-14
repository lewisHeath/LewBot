FROM node:18.17.1

WORKDIR /app

COPY . .
RUN apt update && apt install -y python3 ffmpeg vim
RUN npm install
RUN npm install node-opus

CMD [ "node", "index.js" ]
