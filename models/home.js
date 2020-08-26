var mongoose = require('mongoose');



var Schema = mongoose.Schema;

HomeSchema = new Schema( {
	
	unique_id: Number,
    propertyName : String,
    value: Number,
    Location: String,
    Decription: String,
    Date : Date,
    user : String,
    Type: String,
    Imageurl : String
}),
Home = mongoose.model('Home', HomeSchema);

module.exports = Home;