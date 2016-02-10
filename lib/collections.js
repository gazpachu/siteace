Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

// set up security on collections
Websites.allow({
    insert: function(userId, doc) {

        if (Meteor.user()) {
            if (userId != doc.user) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    },
    
    update: function(userId, doc) {
        return true; // everybody can add votes
    }
});

Comments.allow({
    insert: function(userId, doc) {

        if (Meteor.user()) {
            if (userId != doc.user) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
});