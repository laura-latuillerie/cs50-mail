/***********************************************************************/
//
//
document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

/***********************************************************************/
//
//
function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

/***********************************************************************/
//
//
function send_email() {
  // Get values from the forms
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  // Fetch Api and post the form
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
        console.log(result);
        // When successfully sent, load the "SENT" mailbox
        load_mailbox('sent');
      })
      // Error prevention
      .catch(error => {
        console.log('Error:', error);
    });
    // Prevent default submission
    return false;
}

/***********************************************************************/
//
//
function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  // Empty the current mailbox to switch to another mailbox content
  document.querySelector('#emails-view').innerHTML = '';
  // Show the mailbox name
  document.querySelector('#mailbox-title').innerHTML = `<h3 class="text-center">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Use Api to fetch all the emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        //
        const email_table_sections = [['sender', 3], ['subject', 2], ['timestamp', 2], ['body', 5]];
        const email_table_titles = {'sender': 'Sender', 'subject': 'Subject', 'timestamp': 'Date and time', 'body' : 'Content',  'read': true};
        emails = [ email_table_titles, ...emails];
        emails.forEach(email => {
          const email_line = document.createElement('div');
          email_line.classList.add("row","email-line", email["read"] ? "read" : "unread");
            if (email ===  email_table_titles) {
              email_line.id = 'email-table-titles';}
            email_table_sections.forEach(
                section => {
                    const section_name = section[0];
                    const section_size = section[1];
                    const div_section = document.createElement('div');
                    div_section.classList.add(`col-${section_size}`, `${section_name}-section`);
                    div_section.innerHTML = `<p>${email[section_name]}</p>`;
                    email_line.append(div_section);

                            });
            if (email !==  email_table_titles) {
                email_line.addEventListener('click', () => load_email(email["id"], mailbox));
            }

            document.querySelector('#emails-view').append(email_line);
        })
})
}