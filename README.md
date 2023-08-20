To run the locally:

1. Clone this repository and `cd` into it

2. Install dependencies

    ```bash
    $ npm install
    ```

3. Copy the sample configuration file and edit it to match your configuration

   ```bash
   $ cp .env.example .env
   ```

4. Run the application

    ```bash
    $ npm start
    ```

5. Expose the application using [ngrok](http://ngrok.com).

   ```bash
   $ npm i -g ngrok
   $ ngrok http 3000
   ```

6. Check it out at [http://localhost:3000](http://localhost:3000)

