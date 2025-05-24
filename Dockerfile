FROM registry.access.redhat.com/ubi8/nodejs-14:1

# Copy app source
COPY . .

# Install app dependencies
RUN npm install

# Build app
RUN npm run build

EXPOSE 4000
EXPOSE 4001

CMD ["npm", "start"]
