const { DateTime } = require("luxon");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

MessageSchema
.virtual("timestamp_formatted")
.get(function() {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

MessageSchema
.virtual("timestamp_form")
.get(function() {
    return DateTime.fromJSDate(this.due_back).toISODate();
});

// Virtual for User's url
MessageSchema
.virtual("url")
.get(function() {
    return "/club/member/" + this._id;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);

