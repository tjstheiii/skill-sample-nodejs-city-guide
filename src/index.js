var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "RockIsland";

var numberOfResults = 3;

var APIKey = "62262567410945cdaf5c6025d45406f7";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Rock Island is a great city and hosts many great rap bands, mainly Town Business with their hit song A Nite In Rock Island. With an estimated 38,210 residents as of 2016, Rock Island is not the largest city in the Quad Cities.  What else would you like to know?";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Gas Land", content: "Conveniently located near Rock Island High School, an abundance of food and other quick snacks can be purchased here.  You may be interested to know that you can't actually buy gas at Gas Land.", location: "2420 24th St, Rock Island, IL 61201", contact: "(309) 786-8160" },
    { name: "The District", content: "The place to be at night when in Rock Island.  ", location: "Rock Island, IL 61201", contact: "no contact info" },
    { name: "Quick Stop", content: "Popular reviews say: Great selection of items and congrats you lost a good customer, written from a customer that was upset she was carded.  Get all your intake needs", location: "2030 11th St, Rock Island, IL 61201", contact: "(309) 786-5750" },
    { name: "Lonnie Rays", content: "Rest in peace, Lonnie Rays.  A once great wing spot in the QC is no longer with us.  You've miss out on this attraction, better get to the others while you still can.", location: "Somewhere below the hill, Rock Island, IL 61201", contact: "no contact info available" },
    { name: "Da Green Sto (AKA Quicks Corner)", content: "A lot is left unknown about Da Green Store.  We were given glimpses of the front of it in the popular music video A nite in rock island.", location: "Rock Island, IL 61201", contact: "206 684 4075" },
    { name: "Bucks", content: "Buck's Tap is a popular watering hole (aka bar) in rock island.  Want to throw a huge party with 300 of your closest friends? Buck's Tap is probably not the place to do it. But if you’re interested in grabbing a quick drink and possibly some bar food, Buck's Tap is more than able to oblige.", location: "725 12th St, Rock Island, IL 61201", contact: "309-786-8962" },
    { name: "Jimmies", content: "Good food, good service, and reasonable prices.  Great service. Great ribs, chicken, tacos , steaks,  burgers,  tenderloins, all around delicious menu! Decor is a nautical theme, historic Mississippi River port", location: "108 S Main St, Port Byron, IL 61275", contact: "(309) 523-9409" },
];

var topFive = [
    { number: "1", caption: "Visit the District for drinks and great nightlife fun", more: "This district is the arts and entertainment destination of the Quad Cities. Located on the Mississippi River, the district is a revitalized and vibrant area. You'll find art galleries, restaurants, pubs, nightclubs, comedy clubs, dinner theater, shops, microbrewery, and a hotel.", location: "120 16th Street, Rock Island IL 61201", contact: "(309) 788-6311" },
    { number: "2", caption: "GET your gamble on at Jumers Casino Rock Island", more: "The Jumer's Casino gaming floor spreads out over 42,000 square feet, complete with slots, table games, and poker, with new machines added regularly.", location: "777 Jumer Dr., Rock Island, IL 61201", contact: "(800)-477-7747" },
    { number: "3", caption: "Visit the Rock Island Arsenal Museum", more: "The Rock Island Arsenal Museum is the Army’s second oldest museum.  It first opened to the public on July 4, 1905.  The primary mission is to collect, preserve, and interpret the history of Rock Island Arsenal and Arsenal Island.", location: "1 Rock Island Arsenal, Building 60 - 3500 North Avenue, Rock Island, IL 61299-5000", contact: "309-782-5021" },
    { number: "4", caption: "Enjoy a stroll around the QC Botanical Center", more: "Opening on June 20, 1998, the Quad City Botanical Centeris a 501 c 3, non-profit organization dedicated to bringing people and plants together in fun and meaningful ways. Adjacent to the Mississippi River in downtown Rock Island, IL, the Quad City Botanical Center is comprised of an indoor tropical atrium, a spacious banquet room, a physically enabling garden, a G-Scale garden train exhibit(seasonal), other thriving outdoor gardens, an educational greenhouse, a three-season event canopy, resource library, and gift shop.", location: "2525 4th Avenue, Rock Island IL 61201", contact: "309-794-0991" },
    { number: "5", caption: "Learn about the Great Mississippi River at the Mississippi River Vistors Center", more: "A must for Bald Eagle watchers and photographers", location: "328 Rodman Ave. Rock Island, IL", contact: "1 800-645-0248" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':tellWithCard', output, location, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Rock%20Island%20illinois&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
