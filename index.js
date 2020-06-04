require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var request = require('superagent')
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const mailchimpInstance = process.env.MAILCHIMP_INSTANCE
var listUniqueId = process.env.LIST_UNIQUE_ID
var mailchimpApiKey = process.env.MAILCHIMP_API_KEY

app.get("/", (req, res) => {
  console.log("Hello World");
});

app.get('/members', (req, res) => {
  request
    .get('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members')
    .auth('owner', mailchimpApiKey)
    .then(res => {
      let textObj = JSON.parse(res.res.text)
      console.log('Total New Members: ', textObj.members.length);
      // console.log('Members: ', textObj.members);

      textObj.members.forEach(member => {
        let id = member.id
        let email = member.email_address
        //! The following MUST MATCH the merge field names from the given form
        // let name = member.merge_fields.<field_name>
        // let businessName = member.merge_fields.<field_name>
        // let category = member.merge_fields.<field_name>
        // let location = member.merge_fields.<field_name>
        // let donationSite = member.merge_fields.<field_name>
        // let website = member.merge_fields.<field_name>

        //! For testing only
        let name = member.merge_fields.NAME
        let category = member.merge_fields.MMERGE2
        let location = member.merge_fields.MMERGE3
        let website = member.merge_fields.MMERGE4

        console.log({ 'ID:': id, 'Email:': email, 'Name': name, 'Category': category, 'Location': location, 'Website': website });
      })
    })
    .catch(err => {
      console.log(err)
    })
})

app.listen(3000, () => {
  console.log('App listening on port 3000')
})