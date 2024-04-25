### Translation Routes

1. **Get All Translations**
   - **Endpoint:** `GET /translations`
   - **Controller Function:** `translationController.getAll`

2. **Find Translation by Language**
   - **Endpoint:** `GET /translations/:lang`
   - **Controller Function:** `translationController.findByLang`
   - **Parameters:** 
     - `lang` (string): Language code (e.g., `en`, `ru`, `uz`, `kr`).

3. **Search Translations**
   - **Endpoint:** `GET /translations/search/:message`
   - **Controller Function:** `translationController.search`
   - **Parameters:** 
     - `message` (string): Message content to search for.

4. **Create or Update Translation**
   - **Endpoint:** `POST /translations/:lang`
   - **Controller Function:** `translationController.create`
   - **Parameters:** 
     - `lang` (string): Language code (e.g., `en`, `ru`, `uz`, `kr`).
   - **Request Body:** 
     ```json
     {
       "message": "Your message here",
       "text": "Your translation here"
     }
     ```

5. **Update Translation**
   - **Endpoint:** `PUT /translations/:id`
   - **Controller Function:** `translationController.update`
   - **Parameters:** 
     - `id` (string): ID of the translation to update.
   - **Request Body:** 
     ```json
     {
       "lang": "en",
       "translation": "Updated translation text"
     }
     ```

### User Routes

1. **Get User Information**
   - **Endpoint:** `GET /get-me`
   - **Middleware:** `authMiddleware`
   - **Controller Function:** `userController.getMe`

2. **User Login**
   - **Endpoint:** `POST /login`
   - **Controller Function:** `userController.login`
   - **Request Body:** 
     ```json
     {
       "username": "exampleuser",
       "password": "password123"
     }
     ```

3. **Update User Information**
   - **Endpoint:** `PUT /update-user`
   - **Middleware:** `authMiddleware`
   - **Controller Function:** `userController.updateUser`
   - **Request Body:** 
     ```json
     {
       "username": "newusername",
       "password": "newpassword"
     }
     ```
