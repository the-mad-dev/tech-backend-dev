const StateMachineActions = {
    PlaceOrder: "PlaceOrder",
    CapturePayment: "CapturePayment",
    SendEmail: "SendEmail"
}

const StateMachineEvents = {
    Start: "Start",
    PlaceOrderSuccess: "PlaceOrderSuccess",
    PlaceOrderFailed: "PlaceOrderFailed"
}

module.exports = {
    StateMachineEvents,
    StateMachineActions
}

