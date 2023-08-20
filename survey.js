const appointments = [
    {
        doctor: 'Mike',
        date: "August 14",
        time: '11 am '
    },
    {
        doctor: 'Mike',
        date: "August 16",
        time: '11 am '
    },
    {
        doctor: 'Andy',
        date: "August 16",
        time: '11 am'
    },
]

function getAppointText(appointments){
    text = `We have ${appointments.length} available appointment slots. Please indicate which one you want to see by pressing the number on the phone. ` 
    for (let i = 0; i < appointments.length; i++) {
        appointment = appointments[i]
        texti = `Number ${i + 1}, Dr ${appointment.doctor} on ${appointment.date}, ${appointment.time}. `
        text += texti
      }
    return text
}


const getConfirmationText = (answer) => {
    const {doctor, date, time} = appointments[answer]
    return `You are confirmed to talk with Dr ${doctor} on ${date}, ${time}.`
}

const survey = [
    {
        name: 'name',
        text: 'Please tell us your name.',
        type: 'text'
    },
    {
        dob: 'dob',
        text: 'Please tell us your date of birth.',
        type: 'text'
    },
    {
        name: 'payer',
        text: 'Now we are collecting your insurance information. Please tell us your Payer name',
        type: 'text'
    },
    {
        name: 'id',
        text: 'Please tell us your insurance Payer ID',
        type: 'text'
    },
    {
        name: 'complaint', 
        text: 'Please tell us your medical complaint',
        type: 'text'
    },
    {
        name: 'address',
        text: 'Please tell us your address',
        type: 'text'
    },
    {
        name: 'contact',
        text: 'What is your contact number?',
        type: 'number'
    },
    {
        name: 'appointment',
        text: getAppointText(appointments),
        type: 'number'
    }
];


// Hard coded survey questions
module.exports = {
    survey, appointments, getConfirmationText
}