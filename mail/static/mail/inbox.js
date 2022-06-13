/**********************************************************************/
//
function hide(component){
  document.querySelector(component).style.display = 'none';
}

function show(component){
  document.querySelector(component).style.display = 'block';
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
  // When you compose a new email and submit this form, it triggers the send email function
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

/***********************************************************************/
//
function compose_email() {
  // Show compose view and hide other views
  hide('#email-table-titles-view');
  hide('#emails-view');
  show('#compose-view');
  // Clear out composition fields
  clear('#compose-recipients');
  clear('#compose-subject');
  clear('#compose-body');
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
  // Show the mailbox and hide other views
  hide('#email-view');
  hide('#compose-view');
  show('#emails-view');
  // Empty the current mailbox to switch to another mailbox content
  clear_HTML('#emails-view');
  // Show the mailbox name
  document.querySelector('#mailbox-title').innerHTML = `<h3 class="text-center">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Use Api to fetch all the emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Create objects for emails table
    const email_table_sections = [['sender', 3], ['subject', 2], ['timestamp', 2], ['body', 5]];
    // Re-assign titles for json fetched datas
    const email_table_titles = {'sender': 'Sender', 'subject': 'Subject', 'timestamp': 'Date and time', 'body' : 'Content',  'read': true};
    // Define the emails array
    emails = [ email_table_titles, ...emails];
    // Define an email line in the emails array => How your email will be represented and its composition
    emails.forEach(email => {
      // Create an HTML Div for all the "email lines"
      const email_line = document.createElement('div');
      // If this is the email line created for a titling purpose,
      if (email ===  email_table_titles) {
        // Add specific html details to it
        email_line.classList.add("d-flex", "fw-bold");
        email_line.id = 'email-table-titles';
        // The condition below is my solution to prevent the titling row to repeat when toggling the nav buttons.
        if (document.querySelector('#email-table-titles')) {
          console.log('Already have titles')
        } else {
          document.querySelector('#email-table-titles-view').append(email_line);
        }
      }
      // Create an email line :
      email_table_sections.forEach(
        // Define the composition of an email line thanks to the Objects created above
        section => {
          const section_name = section[0];
          const section_size = section[1];
          // Each email-line is composed of several sections. We create a div for each seaction and assign specific classes/content
          const div_section = document.createElement('div');
          div_section.classList.add(`col-${section_size}`, `${section_name}-section`, 'p-2', 'my-1', 'text-truncate');
          div_section.innerHTML = `<p class="my-0">${email[section_name]}</p>`;
          // Adding each section to create an email line.
          email_line.append(div_section);
        });
        // For all the email lines except the titling one, 
        if (email !==  email_table_titles) {
          // Add specific classes
          email_line.classList.add("row", "email-line", "my-2", "px-1", "rounded", email["read"] ? "read" : "unread");
          // Add the controls to open an individual view for each mail
          email_line.addEventListener('click', () => load_email(email["id"], mailbox));
          // All the email lines will append and appear in the "emails view" div
          document.querySelector('#emails-view').append(email_line);
        }
      })
    })
  }
  
  /***********************************************************************/
  //
  function load_email(email_id) {
    // Show the mail view and hide other views
    hide('#email-table-titles-view');
    hide('#emails-view');
    hide('#compose-view');
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
        // Now I use conditionnal to assign personnalized positions, CSS (boostrap classes) and content
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
  }