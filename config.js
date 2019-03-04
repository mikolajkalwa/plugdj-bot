module.exports = {
    email: 'email@example.com', // bot account credentials
    password: 'S0m3 Pa55w0rd', // bot account credentials
    room: 'room slug', // the part after https://plug.dj/
    prefix: '!', // must be one character
    /* DCMoveback time in minutes.
    Users won't be moved back in waitlist if they were disconnected for longer than X minutes. */
    maxDcTime: 30,
    welcomeMessage: 'Welcome', // Bot will mention joining users with this message (in this case: "Welcome @username")
    sendWelcomeMessage: true, // should bot welcome users with welcomeMessage
    autowoot: true, // should bot woot the songs?
    voteSkip: true, // should bot skip songs if they reach specified number of mehs?
    /* Mehs to skip are calculated based on the number of people in the community.
    For example, if the precentageToSkip is set to 0.45
    it means 45% of the people in the community must meh the song to skip it. */
    precentageToSkip: 0.45, // value between 0-1
    historySkip: true, // should bot skip songs in history?
    partyNeverEnds: false, // should bot join booth if waitlist is empty?
};
