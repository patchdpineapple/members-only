const { DateTime } = require("luxon");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

MessageSchema
.virtual("timestamp_formatted")
.get(function() {
    return this.timestamp ? 
    DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED) 
    : "";
});

MessageSchema
.virtual("timestamp_form")
.get(function() {
    return DateTime.fromJSDate(this.timestamp).toISODate();
});

// Virtual for User's url
MessageSchema
.virtual("url")
.get(function() {
    return "/club/message/" + this._id;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);

