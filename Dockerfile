# Use the official PHP 8.2 image with Apache
FROM php:8.2-apache

# Install dependencies for Composer and enable useful PHP extensions
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev libpng-dev && \
    docker-php-ext-install intl zip gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set the working directory
WORKDIR /var/www/html

# Copy the entire project into the container
COPY . .

# Install PHP dependencies (Twig)
RUN composer install --no-dev --optimize-autoloader

# Expose port 80 (Render will map to $PORT automatically)
EXPOSE 80

# Start the PHP built-in server serving the public folder
CMD ["php", "-S", "0.0.0.0:80", "-t", "public"]
