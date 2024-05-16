# Use an official Node.js image as the base
FROM node:20.10.0
# Set the working directory inside the container
WORKDIR /app

# Copy the shared package.json and package-lock.json
COPY package*.json ./

RUN npm install husky -g

# Install dependencies
RUN npm install

RUN npm install bcrypt

# Copy the entire project (both React and Nest JS code)
COPY . .

RUN npm run build

# Specify the command to start your combined app
CMD ["npm", "run" , "start"]