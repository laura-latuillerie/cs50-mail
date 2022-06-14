/**********************************************************************/
//
function hide(component){
  document.querySelector(component).style.display = 'none';
}
function show(component){
  document.querySelector(component).style.display = 'block';
}
function show_flex(component){
  document.querySelector(component).style.display = 'flex';
}
function show_ib(component){
  document.querySelector(component).style.display = 'inline-block';
}
function clear(component){
  document.querySelector(component).value = '';
}
function clear_HTML(component){
  document.querySelector(component).innerHTML =  '';
}

/***********************************************************************/
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
function compose_email() {
  // Show compose view and hide other views
  hide('#email-table-titles');
  hide('#mailbox-title');
  hide('#email-view');
  hide('#emails-view');
  show('#compose-view');
  // Clear out composition fields
  clear('#compose-recipients');
  clear('#compose-subject');
  clear('#compose-body');
}

/***********************************************************************/
//
function read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function archive_email(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  }).then( () => load_mailbox("archive"));
}

/***********************************************************************/
//
function send_email() {
  // Get email components' values from the form
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
  hide('#email-view');
  hide('#compose-view');
  show('#emails-view');
  clear_HTML('#emails-view');
  // Mailbox Title
  document.querySelector('#mailbox-title').innerHTML = `<h3 class="text-center">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // API
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
      const email_line = document.createElement('div');
      email_line.classList.add("row", "email-line", "my-2", "px-1", "rounded", email["read"] ? "read" : "unread");
      email_line.addEventListener('click', () => load_email(email["id"], mailbox));
      document.querySelector('#emails-view').append(email_line);
      
      const sections_sent = [['recipients', 3], ['timestamp', 2], ['subject', 3], ['body', 4] ];
      const sections = [['sender', 3], ['timestamp', 2], ['subject', 3], ['body', 4] ];
      
      if (mailbox === "sent") {
        sections_sent.forEach(
          section => {
            const section_name = section[0];
            const section_size = section[1];
            const div_section = document.createElement('div');
            div_section.classList.add(`col-${section_size}`, `${section_name}-section`, 'p-2', 'my-1', 'text-truncate');
            div_section.innerHTML = `<span>${email[section_name]}</span>`;
            email_line.append(div_section);
          })
        } else {
          sections.forEach(
            section => {
              const section_name = section[0];
              const section_size = section[1];
              const div_section = document.createElement('div');
              div_section.classList.add(`col-${section_size}`, `${section_name}-section`, 'p-2', 'my-1', 'text-truncate');
              div_section.innerHTML = `<span>${email[section_name]}</span>`;
              email_line.append(div_section);
            })
          }
        })
      })
      show('#email-table-titles')
      if (mailbox === "sent") {
        hide('#titles');
        show_flex('#titles-sent');
      } else {
        hide('#titles-sent');
        show_flex('#titles');
      }
    }
  
    /***********************************************************************/
    //
    function load_email(email_id, mailbox) {
      // Show the mail view and hide other views
      hide('#emails-view');
      hide('#compose-view');
      hide('#email-table-titles');
      show('#email-view');
      // Empty all content for switching views purpose
      clear_HTML('#subject-timestamp');
      clear_HTML('#email-data');
      clear_HTML('#email-body');
      // Use api to fetch this email
      fetch(`/emails/${email_id}`)
      .then(response => response.json())
      .then(email => {
        // Get all the data I need in an array and for each one, create div with unique ID. Inside is inserted their respective content.
        ["subject", "timestamp", "sender", "recipients", "body"].forEach(email_element => {
          const email_section = document.createElement('div');
          email_section.id = `email-${email_element}-section`;
          email_section.innerHTML = `<span>${email[email_element]}</span>`;
          if (mailbox !== 'sent'){
            show_ib('#reply-btn');
            document.querySelector("#reply-btn").addEventListener("click", () => reply_email(email));
          } else {
            hide('#reply-btn');
          }
          // Personnalized positions and CSS classes for each email component
          if (email_element === 'subject'){
            document.querySelector('#subject-timestamp').append(email_section);
            email_section.classList.add('col-8', 'fs-2', 'fw-bold');
          }
          else if(email_element === 'timestamp'){
            document.querySelector('#subject-timestamp').append(email_section);
            email_section.classList.add('col-4','fw-bold', 'text-end');
          }else if(email_element === 'body'){
            const email_body = document.querySelector('#email-body')
            email_body.append(email_section);
            email_body.classList.add('row', 'mx-0', 'mt-3', 'glass', 'p-2');
          }else{
            document.querySelector('#email-data').append(email_section);
            if(email_element === 'sender'){
              email_section.innerHTML = `From <span class="badge rounded-pill 
              text-bg-primary my-1">${email[email_element]}</span>`;
            } else {
              email_section.innerHTML = `To <span class="badge rounded-pill 
              text-bg-light my-1">${email[email_element]}</span>`;
            }
          }
        })
      })
      // Mark the email as read
      read(email_id);
    }

     /***********************************************************************/
    //
    function reply_email(email) {
      compose_email();
      document.querySelector('#compose-recipients').value = email["sender"];
      document.querySelector('#compose-subject').value = "Re: " + email["subject"] ;
      const pre_body_text = `\n \n \n------ On ${email['timestamp']} ${email["sender"]} wrote : \n`;
      document.querySelector('#compose-body').value = ` ${pre_body_text} \n ${email["body"]} \n`;
}
    