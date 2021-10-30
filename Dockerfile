FROM node AS frontend
WORKDIR /svelte
COPY PlaylistDJ.Frontend/package.json .
RUN yarn install --production
COPY PlaylistDJ.Frontend/ .
CMD ["yarn", "build"]

FROM node
WORKDIR /backend
# Install dependecies
COPY PlaylistDJ.API/package.json .
RUN yarn install --production
# Copy other files
COPY PlaylistDJ.API/ .
RUN yarn build
COPY --from=frontend /svelte/public dist
CMD ["yarn", "start"]
