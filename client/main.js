Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

/////
// routing 
/////

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {
        to: 'navbar'
    });
    this.render('website_form', {
        to: 'form'
    });
    this.render('website_list', {
        to: 'main'
    });
});

Router.route('/:_id', function () {
    this.render('navbar', {
        to: 'navbar'
    });
    this.render('website_detail', {
        to: 'main',
        data: function() {
            return Websites.findOne({_id: this.params._id});
        }
    });
    this.render('comments_list', {
        to: 'comments'
    });
    this.render('comment_form', {
        to: 'comment'
    });
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
    websites:function(){
        return Websites.find({}, {sort: {up:-1}});
    }
});

// format the date
Template.registerHelper('formattedDate', function() {
     return moment(this.createdOn).format("MM/DD/YYYY");  // or whatever format you prefer
});

// List all the comments for a given website
Template.comments_list.helpers({
    comments:function(){
        return Comments.find({website: Router.current().params._id});
    }
});


/////
// template events 
/////

Template.ApplicationLayout.events({
    "click .js-upvote":function(event){
        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Up voting website with id "+website_id);
        
        // put the code in here to add a vote to a website!
        Websites.update({_id: website_id},
                        {$set: {up: this.up + 1}});
        
        return false;// prevent the button from reloading the page
    }, 
    "click .js-downvote":function(event){

        // example of how you can access the id for the website in the database
        // (this is the data context for the template)
        var website_id = this._id;
        console.log("Down voting website with id "+website_id);

        // put the code in here to remove a vote from a website!
        Websites.update({_id: website_id},
                        {$set: {down: this.down + 1}});
        
        return false;// prevent the button from reloading the page
    }
})

Template.website_form.events({
    "click .js-toggle-website-form":function(event){
        $("#website_form").toggle('slow');
    },
    "submit .js-save-website-form":function(event){

        if (Meteor.user()) {
            // here is an example of how to get the url out of the form:
            var url = event.target.url.value;
            console.log("The url they entered is: "+url);

            //  put your website saving code in here!
            Meteor.call("getWebsiteData", url, function(error, results) {
                var el = $('<div></div>');
                el.html(results.content);
                var title = $('title', el).text();
                var description = $('meta[name="description"]', el).attr('content');

                Websites.insert({
                    title: title, 
                    url: url, 
                    description: description, 
                    createdOn: new Date(),
                    user: Meteor.user().username,
                    up: 0,
                    down: 0
                });
            });
        }
        else {
            alert('You need to be logged in to submit websites!');
        }

        return false; // stop the form submit from reloading the page
    }
});

Template.comment_form.events({
    "submit .js-save-comment-form":function(event){

        if (Meteor.user()) {
            
            // here is an example of how to get the comment out of the form:
            var comment = event.target.comment.value;
            console.log("The comment they entered is: "+comment);

            Comments.insert({
                website: Router.current().params._id, 
                comment: comment, 
                createdOn: new Date(),
                user: Meteor.user().username
            });
        }
        else {
            alert('You need to be logged in to submit comments!');
        }

        return false; // stop the form submit from reloading the page

    }
});