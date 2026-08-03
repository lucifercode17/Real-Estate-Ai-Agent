const { generateReply, deleteHistory } = require("../Services/Ai.Services");

const { getLead, deleteLead } = require("../Utils/Leads");

const { isCallEnded } = require("../Utils/CallEndDector");

const { generateSummary } = require("../Services/summary.service");

const { saveLead } = require("../Services/lead.service");
exports.PostReply = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    const result = await generateReply(sessionId, message);

    const callEnded = isCallEnded(message);
    if (callEnded) {
      const lead = getLead(sessionId);

      const summary = await generateSummary(lead.conversation);

      await saveLead(summary);

      deleteHistory(sessionId);

      deleteLead(sessionId);
    }

    res.json({
      success: true,
      reply: result.reply,
      lead: result.lead,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};
