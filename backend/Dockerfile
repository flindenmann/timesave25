# backend/Dockerfile
FROM node:20

# Arbeitsverzeichnis im Container
WORKDIR /app

# Nur package-Dateien kopieren -> schnelleres Caching von npm install
COPY package*.json ./

# Abhängigkeiten installieren (nutzt lockfile, fällt sonst auf install zurück)
RUN npm ci || npm install

# Fallback: falls "cors" noch nicht in package.json steht, installiere es trotzdem.
# (So startet der Container sicher, auch ohne lokales npm.)
RUN node -e "const p=require('./package.json'); process.exit(p.dependencies && p.dependencies.cors ? 0 : 1)" \
  || npm install cors@^2.8.5 --save

# Restlichen Code kopieren
COPY . .

# Der App-Port im Container
EXPOSE 5000

# Start
CMD ["npm", "start"]