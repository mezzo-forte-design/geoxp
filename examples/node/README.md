# GeoXp Node JS Example App

This is an example application demonstrating how to use the **GeoXp core** library in a Node.js environment.

## Setup and Usage

1. **Install Dependencies**  
   Use the following command to install the required dependencies:  
   ```bash
   yarn
   ```

2. **Run the Server**  
   Start the Express server with:  
   ```bash
   yarn start
   ```

---

## API Endpoints

The server exposes the following endpoints:

1. **GET /health**  
   Check if the server is running.

2. **GET /config**  
   Retrieve the current GeoXp configuration as a JSON file.

3. **POST /location**  
   Update a user's position with the following JSON format:  
   ```json
   {
     "lat": <latitude>,
     "lon": <longitude>,
     "accuracy": <accuracy>
   }
   ```
   Updating the position triggers GeoXp's internal mechanisms. 
   **If a spot is activated, a log message will appear on the server**.

---

## Next Steps and Ideas 💡

This example demonstrates a minimal setup for running GeoXp core in Node.js. Here are some suggestions for extending its functionality:

- Add a **POST /config** endpoint to dynamically update the GeoXp configuration.
- Integrate **WebSocket** support for bi-directional communication, enabling the server to send GeoXp events to clients.
- Trigger external API calls whenever a GeoXp event occurs.
- Combine GeoXp events from multiple clients for more complex workflows—**unleash your creativity**!


---

Happy GeoXp experience! 🚀
