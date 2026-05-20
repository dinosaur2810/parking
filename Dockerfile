FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy all application files to nginx html directory
COPY *.html ./
COPY *.css ./
COPY *.js ./
COPY *.md ./
COPY *.txt ./

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/index.html || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
