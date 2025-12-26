// A simple map of keywords to responses for our basic chatbot.
const responses = {
    'hello': 'Hello! How can I help you today? I can answer questions about symptoms, appointments, billing, pharmacy, and hospital services.',
    'hi': 'Hi there! How can I assist you? You can ask me about symptoms, appointments, billing, pharmacy, or services.',
    'symptoms': 'I can provide general information about symptoms. What symptoms are you experiencing? Please remember, this is not a diagnosis. For a real diagnosis, please consult a doctor.',
    'headache': 'Common causes for headaches include stress, dehydration, or lack of sleep. Rest and hydration often help. If the headache is severe, persistent, or accompanied by other symptoms like fever or dizziness, please see a doctor.',
    'fever': 'A fever is often a sign that your body is fighting an infection. Rest and fluids are important. If your fever is very high or lasts more than a few days, you should contact a doctor.',
    'appointment': 'To schedule, reschedule, or cancel an appointment, please call our reception at 555-123-4567 or use the patient portal on our website.',
    'hours': 'The hospital is open 24/7 for emergencies. For visiting hours and clinic appointments, please check our website or call reception.',
    'services': 'We offer a wide range of services including emergency care, surgery, maternity, pediatrics, and more. What specific service are you interested in?',
    'billing': 'For questions about billing, payments, or insurance, please contact our billing department at 555-123-5678 during business hours, or visit the billing office on the ground floor.',
    'payment': 'For questions about billing, payments, or insurance, please contact our billing department at 555-123-5678 during business hours, or visit the billing office on the ground floor.',
    'insurance': 'For questions about billing, payments, or insurance, please contact our billing department at 555-123-5678 during business hours, or visit the billing office on the ground floor.',
    'pharmacy': 'Our on-site pharmacy is located on the first floor and is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends. For prescriptions or refills, please call 555-123-8765.',
    'prescription': 'Our on-site pharmacy is located on the first floor and is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends. For prescriptions or refills, please call 555-123-8765.',
    'refill': 'Our on-site pharmacy is located on the first floor and is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends. For prescriptions or refills, please call 555-123-8765.',
    'medication': 'Our on-site pharmacy is located on the first floor and is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends. For prescriptions or refills, please call 555-123-8765.',
    'default': "I'm sorry, I'm not sure how to help with that. You can ask me about symptoms, appointments, services, billing, or our pharmacy. For medical advice, please consult a doctor. For other inquiries, please call reception at 555-123-4567."
};

/**
 * Generates a simple response based on keywords in the message.
 * @param {string} message The user's message.
 * @returns {string} A canned response.
 */
const getSimpleResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    for (const keyword in responses) {
        if (lowerCaseMessage.includes(keyword)) {
            return responses[keyword];
        }
    }
    return responses['default'];
};

/**
 * @desc    Handle chatbot conversation
 * @route   POST /api/chatbot/chat
 * @access  Public
 */
const chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const responseText = getSimpleResponse(message);

        // Simulate a small delay for better UX
        setTimeout(() => {
            res.status(200).json({
                success: true,
                response: responseText,
                source: 'simple_bot'
            });
        }, 500);
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred in the chatbot.'
        });
    }
};

module.exports = {
    chat
};