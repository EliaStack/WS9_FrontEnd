# ---- Étape 1 : build (Node, produit les fichiers statiques) ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# URL de l'API, gravée dans le JS au moment du build (doit être joignable
# depuis le navigateur, pas depuis le réseau interne Docker)
ARG VITE_API_URL=http://localhost:3000/
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Étape 2 : diffusion (nginx sert les fichiers statiques) ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
