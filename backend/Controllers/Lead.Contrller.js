const { getLead } = require("../Utils/Leads");

exports.getCurrentLead = (req, res) => {

    const { sessionId } = req.params;

    const lead = getLead(sessionId);

    res.json({
        success: true,
        lead
    });

};