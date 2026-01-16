# frontend/Dockerfile
# Alpine wenuwata Slim use karamu (More stable for Next.js 16+)
FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Next.js telemetry disable karamu (podi performance boost ekak)
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "dev"]
EXPOSE 3000