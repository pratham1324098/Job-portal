const express= require("express");
const swaggerUi = require("swagger-ui-express")
const swaggerDoc = require("swagger-jsdoc")
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDb = require("./config/dbConnection");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes.js")
const testRoutes = require("./routes/testRoutes.js")
const jobsRoutes= require("./routes/jobsRoutes.js")
const helmet = require("helmet");
const asyncHandler = require("express-async-handler");
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize")
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes.js")
const errorMiddleware = require("./middlewares/errorMiddleware");
const app = express();
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(mongoSanitize());
app.use(cors());
app.use(morgan("dev"));
connectDb();

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Job Portal Application",
            description:"Node Expressjs Job Portal Application"
        },
        servers:[
            {
                url:"http://localhost:7000"
            }
        ]
    },
    apis:["./routes/*.js"]
}

const spec = swaggerDoc(options);

app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);  
app.use('/api/v1/user', userRoutes);  
app.use('/api/v1/job', jobsRoutes);  
app.use("/api-doc",swaggerUi.serve,swaggerUi.setup(spec))
app.use(errorMiddleware);

  
const port = process.env.PORT || 7001||8000;
app.listen(port,()=>{
    console.log(`Node server running on port ${port} and on ${process.env.DEV_MODE} mode`.bgCyan.white)
});
