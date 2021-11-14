#include our base image of node 
FROM node:15
#make starting working directory /app all our file go there 
WORKDIR /app
#copy package.json file
COPY package.json .
#then runstart 
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
# copy all current directory and store in /app directory
COPY . ./  
ENV PORT 3000
# Expose the port 
EXPOSE $PORT
# now run file 
CMD ["node","index.js"]