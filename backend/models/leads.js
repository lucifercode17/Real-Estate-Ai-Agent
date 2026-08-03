const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({

    name: String,

    phone: String,

    email: String,

    location: String,

    budget: String,

    propertyType: String,

    purpose: String,

    timeline: String,

    interestLevel: String,

    summary: String

}, {
    timestamps: true
});

module.exports = mongoose.model("Lead", LeadSchema);