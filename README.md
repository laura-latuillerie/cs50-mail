# CS50 Mail Project
Project 3 of Harvard's CS50 Programming Course : Mail Web App<br>
Picture below is provided by Harvard. My capture arriving soon.

![website capture](https://i9.ytimg.com/vi_webp/gv61hVqPWCM/sddefault.webp?sqp=CPjjrZUG&rs=AOn4CLA1C4-UG4_-aWllilKgxNtAypClvA "website example")
<br/>

## Project's Requirements
### Send Mail
When a user submits the email composition form, add JavaScript code to actually send the email.
<li>You’ll likely want to make a POST request to /emails, passing in values for recipients, subject, and body.
<li>Once the email has been sent, load the user’s sent mailbox.</li>

### Mailbox
When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
<li> You’ll likely want to make a GET request to /emails/<mailbox> to request the emails for a particular mailbox.</li>
<li> When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.</li>
<li> When a mailbox is visited, the name of the mailbox should appear at the top of the page (this part is done for you).</li>
<li> Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.</li>
<li> If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.</li>

### View Email
When a user clicks on an email, the user should be taken to a view where they see the content of that email.
<li> You’ll likely want to make a GET request to /emails/<email_id> to request the email.</li>
<li> Your application should show the email’s sender, recipients, subject, timestamp, and body.</li>
<li> You’ll likely want to add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.</li>
<li>See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.</li>
<li> Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.</li>
  
### Archive and Unarchive
Allow users to archive and unarchive emails that they have received.
<li> When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.</li>
<li>Recall that you can send a PUT request to /emails/<email_id> to mark an email as archived or unarchived.</li>
<li>Once an email has been archived or unarchived, load the user’s inbox.</li>
  
### Reply
Allow users to reply to an email.
<li>When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.</li>
<li>When the user clicks the “Reply” button, they should be taken to the email composition form.</li>
<li>Pre-fill the composition form with the recipient field set to whoever sent the original email.</li>
<li>Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)</li>
<li>Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.</li>
  
## Languages
<table><tr><td valign="top">
  
####  Front-End  
<div align="left">  
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/html5-original-wordmark.svg" alt="HTML5" height="30" />  
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/css3-original-wordmark.svg" alt="CSS3" height="30" />  
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/bootstrap-plain.svg" alt="Bootstrap" height="30" />
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/javascript-original.svg" alt="Javascript" height="30" />
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/react-original-wordmark.svg" alt="React" height="30" />  
</div>
<br/>
</td><td valign="top">

####  Back-end  
<div align="left">  
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/python-original.svg" alt="Python" height="30" />  
<img style="margin: 20px" src="https://profilinator.rishav.dev/skills-assets/django-original.svg" alt="Django" height="30" />  
</div>
<br/>
</td></tr></table> 

## Tools

For [gradient background](https://cssgradient.io/)

##  Deployment

This [video](https://www.youtube.com/watch?v=GMbVzl_aLxM) saved my life
Also check [Heroku's documentation](https://devcenter.heroku.com/categories/python-support)





