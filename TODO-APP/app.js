const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');

//const liveCount = require('./moment/moment');

const errorController = require('./controllers/error')
const sequelize = require('./util/database');
const Task = require('./models/todo');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'Views');

const addTodoRoutes = require('./routes/admin')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//initializing the session to be use
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err)
    })
});

app.use('/admin', addTodoRoutes);

//handling error 404
app.use(errorController.get404);
const PORT = process.env.PORT || 5000

Task.belongsTo(User, { constraints: true, onDelete: "CASCADE" })//A user created the product/task
User.hasMany(Task);

sequelize
    //.sync({force: true})
     .sync()
    .then(result => {
        return User.findByPk(1)
            // console.log(result);
            .then(user => {
                if (!user) {
                  return  User.create({ name: 'Jenny', email: 'jenny@gmail.com' })
                }
                return user;
            })
           // .then(user => {
               // return user.createComplete();//creating complete from the datatbase model
           // })
            .then(complete => {
                app.listen(PORT, () => console.log(`server running at ${PORT}`));
            })
    }).catch(err => {
        console.log(err);
    });