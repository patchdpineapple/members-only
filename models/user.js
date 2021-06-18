const { DateTime } = require("luxon");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    membership: { type: String, required: true, enum:["Exclusive", "Basic"], default: "Basic" },
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true, default: false }
});

// Virtual for User's full name
UserSchema
.virtual("name")
.get(function() {
    return this.family_name + ", " + this.first_name;
});

// Virtual for User's url
UserSchema
.virtual("url")
.get(function() {
    return "/club/member/" + this._id;
});

// Export model
module.exports = mongoose.model("User", UserSchema);

