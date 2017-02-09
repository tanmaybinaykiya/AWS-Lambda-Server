module.exports.creditCardRegex = new RegExp(/^((\d{16})|((\d{4}-){3}\d{4}))$/);
module.exports.expirationDateRegex = new RegExp(/^(((0[1-9])|(1[1-2]))\/\d{2})$/);
module.exports.ENROLLMENT_STATES = {
    PENDING_REVIEW: 'PENDING_REVIEW',
    WAITLIST: 'WAITLIST',
    IN_PROCESS: 'IN_PROCESS',
    REGISTERED: 'REGISTERED'
};
module.exports.nonRegisteredEnrollmentStateRegex = new RegExp(/^(PENDING_REVIEW)|(WAITLIST)|(IN_PROCESS)|(REGISTERED)$/);
module.exports.enrollmentStateRegex = new RegExp(/^(PENDING_REVIEW)|(WAITLIST)|(IN_PROCESS)|(REGISTERED)$/);
