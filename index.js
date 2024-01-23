const express = require('express');
const path = require('path')

const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const { homedir } = require('os');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRoute');
const userRoute = require('./routes/user');

const PORT = 8001;
const app = express();

// Mention to use ejs view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('MongoDB Connected'));

// server accepts json data     
app.use(express.json());

// server accepts form data
app.use(express.urlencoded({ extended: false }))

app.use("/url", urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);

// app.get("/test", async(req, res) => {
//     const allURLs = await URL.find({});

//     // Variables can be passed
//     return res.render("home", {
//         urls: allURLs
//     });
// //     return res.end(`
// //     <html> 
// //         <head>
// //         </head>
// //         <body>
// //             <ul>
// //                 ${allURLs.map(url => `${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}`).join('<br>')}
// //             </ul>
// //         </body>
// //     </html>
// // `);
// });

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true } // Return the modified document rather than the original
        );

        if (entry) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).send('URL not found'); // Handle the case when entry is not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));