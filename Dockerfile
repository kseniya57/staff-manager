FROM node:10
WORKDIR /opt/staff-manager/frontend
RUN npm i -g @vue/cli
COPY frontend/package.json ./
RUN npm i
COPY frontend ./
RUN npm run build
WORKDIR /opt/staff-manager/backend
COPY backend/package.json ./
RUN npm i -g typescript
RUN npm i
COPY backend ./
RUN mkdir -p uploads/images
CMD ["npm", "start"]
