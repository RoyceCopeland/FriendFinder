// Import friend data.
var friendData = require('../data/friends.js');

module.exports = function(app) {

    // GET route for /api/friends returns friendData.
    app.get('/data/friends', function(req, res) {
        res.json(friendData);
    });

    // POST route for /api/friends takes in the new data and responds with the most compatible match.
    app.post('/data/friends', function(req, res) {
        // Our user is the data sent in the request.
        var thisUser = req.body;
        var differences = [];

        // If there is more than one friend to compare to,
        if (friendData.length > 1) {
            // Step through these potential friends.
            friendData.forEach(function(user) {
                var totalDifference = 0;

                // For each answer, compare the answers and add the absolute value of the difference to the total difference.
                for (var i = 0; i < thisUser.answers.length; i++) {
                    var otherAnswer = user.answers[i];
                    var thisAnswer = thisUser.answers[i];
                    var difference = +otherAnswer - +thisAnswer;
                    totalDifference += Math.abs(difference);
                }

                differences.push(totalDifference);
            });

            // Find the minimum difference score.
            var minimumDifference = Math.min.apply(null, differences);

            // Since there may be more than one potential friend with that score, create an array.
            var bestMatches = [];

            // For each item in differences, if it is equal to the minimum Difference, add the corresponding friendData to the bestMatches array.
            for (var i = 0; i < differences.length; i++) {
                if (differences[i] === minimumDifference) {
                    bestMatches.push(friendData[i]);
                }
            }

            // Then send bestMatches to the client.
            res.json(bestMatches);
            // If there is only one friend to compare to, skip all that work and just send back that friend.
        } else {
            res.json(friendData);
        }

        // Once you're done comparing, add the new user to the potential friends data.
        friendData.push(thisUser);

    });
};