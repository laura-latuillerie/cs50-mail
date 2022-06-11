/***********************************************************************/
// Define global variables usables to several functions using query selectors
//
// Inbox Buttons
const btnInbox =  document.querySelector('#inbox');
const btnSent = document.querySelector('#sent');
const btnArchived = document.querySelector('#archived');
const btnCompose = document.querySelector('#compose');
// Inbox Views
const viewEmails = document.querySelector('#emails-view');
const viewCompose = document.querySelector('#compose-view');
// Compose Mail Form Elements
const mailRecipients =  document.querySelector('#compose-recipients');
const mailSubject = document.querySelector('#compose-subject');
const mailBody = document.querySelector('#compose-body');

/***********************************************************************/
//
//
document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  btnInbox.addEventListener('click', () => load_mailbox('inbox'));
  btnSent.addEventListener('click', () => load_mailbox('sent'));
  btnArchived.addEventListener('click', () => load_mailbox('archive'));
  btnCompose.addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

/***********************************************************************/
//
//
function compose_email() {
  // Show compose view and hide other views
  viewEmails.style.display = 'none';
  viewCompose.style.display = 'block';
  // Clear out composition fields
  mailRecipients.value = '';
  mailSubject.value = '';
  mailBody.value = '';
  document.querySelector('#compose-form').onsubmit = send_email;
}

/***********************************************************************/
//
//
function send_email() {
  const recipients = mailRecipients.value;
  const subject = mailSubject.value;
  const body = mailBody.value;
  console.log(recipients);
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
      .then(result => {
        if ("message" in result) {
            // The email was sent successfully!
            load_mailbox('sent');
        }

        if ("error" in result) {
            // There was an error in sending the email
            // Display the error next to the "To:"
            document.querySelector('#to-text-error-message').innerHTML = result['error']
        }
      })
  return false;
}

/***********************************************************************/
//
//
function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  viewEmails.style.display = 'block';
  viewCompose.style.display = 'none';
  // Show the mailbox name
  viewEmails.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}