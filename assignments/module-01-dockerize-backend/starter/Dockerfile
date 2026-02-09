# TODO: Choose an appropriate Node.js base image
# Hint: Use node:20-alpine for smaller image size
FROM ____

# TODO: Set the working directory inside the container
# Hint: Use /app as the working directory
WORKDIR ____

# TODO: Copy package.json and package-lock.json
# Hint: Copy these files first to leverage Docker layer caching
COPY ____ ____

# TODO: Install production dependencies
# Hint: Use npm ci for faster, more reliable installs
RUN ____

# TODO: Copy the rest of the application source code
# Hint: Copy everything from current directory to working directory
COPY ____ ____

# TODO: Expose the port the app runs on
# Hint: The backend runs on port 3000 by default
EXPOSE ____

# TODO: Define the command to run the application
# Hint: Use JSON array format ["node", "src/index.js"]
CMD ____
