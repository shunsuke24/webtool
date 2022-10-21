FROM node:18

RUN mkdir -p /app

WORKDIR /app

COPY ./entrypoint.sh /scripts/entrypoint.sh

# CMD ["npm", "run", "dev-host"]
RUN chmod +x /scripts/entrypoint.sh

ENTRYPOINT ["/scripts/entrypoint.sh"]

# RUN npm install 

# CMD ["./node", "./server.js" ]
