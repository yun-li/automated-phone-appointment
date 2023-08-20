const VoiceResponse = require("twilio").twiml.VoiceResponse;
const SurveyResponse = require("../models/SurveyResponse");
const { survey, appointments } = require("../survey");

// Main interview loop
exports.interview = async function (request, response) {
  const phone = request.body.From;
  const input = request.body.RecordingUrl || request.body.Digits;
  const twiml = new VoiceResponse();

  // respond with the current TwiML content
  const respond = () => {
    response.type("text/xml");
    response.send(twiml.toString());
  };

  // Find an in-progess survey if one exists, otherwise create one
  SurveyResponse.advanceSurvey(
    {
      phone: phone,
      input: input,
      survey: survey,
      appointments: appointments,
    },
    (err, surveyResponse, questionIndex, prompt='') => {
      const question = survey[questionIndex];

      if (err || !surveyResponse) {
        twiml.say("Sorry, but an error has occurred. Goodbye.");
        return respond();
      }

      // If question is null, we're done!
      if (!question) {
        twiml.say("You will receive a short message confirmation. Thank you for taking this survey. Goodbye!");
        return respond();
      }

      // Add a greeting if this is the first question
      if (questionIndex === 0) {
        twiml.say(
          "Thank you for taking our survey. Please listen carefully " +
            "to the following questions."
        );
      }

      if(prompt) {
        twiml.say( prompt);
      }

      // Otherwise, ask the next question
      twiml.say(question.text);

      // Depending on the type of question, we either need to get input via
      // DTMF tones or recorded speech
      if (question.type === "text") {
        twiml.say(
          "Please record your response after the beep. " +
            "Press any key to finish."
        );
        twiml.record({
          transcribe: true,
          transcribeCallback:
            "/voice/" + surveyResponse._id + "/transcribe/" + questionIndex,
          maxLength: 60,
        });
      } else if (question.type === "boolean") {
        twiml.say('Press one for "yes", and any other key for "no".');
        twiml.gather({
          timeout: 10,
          numDigits: 1,
        });
      } else {
        // Only other supported type is number
        twiml.say(
          "Enter the number using the number keys on your telephone." +
            " Press star to finish."
        );
        twiml.gather({
          timeout: 10,
          finishOnKey: "*",
        });
      }

      // render TwiML response
      respond();
    }
  );
};

// Transcripton callback - called by Twilio with transcript of recording
// Will update survey response outside the interview call flow
exports.transcription = (request, response) => {
  var responseId = request.params.responseId;
  var questionIndex = request.params.questionIndex;
  var transcript = request.body.TranscriptionText;

  SurveyResponse.findById(responseId, function (err, surveyResponse) {
    if (err || !surveyResponse || !surveyResponse.responses[questionIndex])
      return response.status(500).end();

    // Update appropriate answer field
    surveyResponse.responses[questionIndex].answer = transcript;
    surveyResponse.markModified("responses");
    surveyResponse.save(function (err, doc) {
      return response.status(err ? 500 : 200).end();
    });
  });
};
