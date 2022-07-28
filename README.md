## About
Backend Belanja 

## Installation

Follow the steps below

1. Clone this repo
```
git clone this repo
```

2. Install module & Import Database
##### Install Module
```
npm install
```

3. Create env file
```
# ---------------------------------------
#               CONFIG DB
# ---------------------------------------
DB_USERNAME  = 
DB_HOST = 
DB_DATABASE = 
DB_PASSWORD = 
DB_PORT = 
PORT = 


Detail CONFIG GENERAL
| EXAMPLE URL | [http://localhost:4000]() |
| :-------------: |:-------------:|
| PORT | 4000 |
| HOST | [http://localhost]() |

4. Done, You can run it in the way below
##### Developer Mode (with nodemon)
```
npm run dev
```
##### Production Mode (only node)
```
npm start
```

##  Standard Response & Preview Request By Postman
#### Standard Response API
```json
{
    "status": true,
    "message": "success register",
    "data": [object Object]
}
```
Object data contains content according to the request

##  Built Using

- [ExpressJS](https://expressjs.com)
- [CORS Package](https://www.npmjs.com/package/cors)
- [Morgan Package](https://www.npmjs.com/package/morgan)
- [DotEnv Package](https://www.npmjs.com/package/dotenv)
- [JWT Package](https://www.npmjs.com/package/jsonwebtoken)
- [Nodemailer Package](https://www.npmjs.com/package/nodemailer)
- [UUID Package](https://www.npmjs.com/package/uuid)
- [Multer Package](https://www.npmjs.com/package/multer)
- [Bcrypt Package](https://www.npmjs.com/package/bcrypt))
# BE-Food-Recipes
