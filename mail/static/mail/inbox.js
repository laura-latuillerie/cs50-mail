/***********************************************************************/
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

/**********************************************************************/
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
function compose_email() {
  // Show compose view and hide other views
  show('#compose-view');
  hide('#emails-view');
  hide('#email-view');
  hide('#email-table-titles');
  hide('#mailbox-title');
  // Clear out composition fields
  clear('#compose-recipients');
  clear('#compose-subject');
  clear('#compose-body');
}

/***********************************************************************/
function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  // Fetch Api, assign the data values with queries
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
    load_mailbox('sent');
  });
}
/***********************************************************************/

function reply_email(email) {
  compose_email();
  console.log(email)
  document.querySelector('#compose-recipients').value = email["sender"];
  document.querySelector('#compose-subject').value = "Re: " + email["subject"] ;
  const pre_body_text = `\n \n \n------ On ${email['timestamp']} ${email["sender"]} wrote : \n`;
  document.querySelector('#compose-body').value = ` ${pre_body_text} \n ${email["body"]} \n`;
}

/***********************************************************************/
function read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function archive_email(email_id, status){
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: status
    })
  }).then(()=> 
  load_mailbox('archive'));
}

/***********************************************************************/
function structure_email_mailbox(array, email, email_line) {
  array.forEach(
    section => {
      const section_name = section[0];
      const section_size = section[1];
      const div_sections = document.createElement('div');
      div_sections.classList.add(`col-${section_size}`, `${section_name}-section`, 'p-2', 'my-1', 'text-truncate');
      div_sections.innerHTML = `<span>${email[section_name]}</span>`;
      email_line.append(div_sections);
    })
    document.querySelector('#emails-view').append(email_line);
  }
  
  /***********************************************************************/
  
  function load_mailbox(mailbox) {
    // Mailbox Title
    document.querySelector('#mailbox-title').innerHTML = `<h3 class="text-center">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    // Api will fetch all my emails according to mailbox origin
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        // Email line component (email 'design' for mailbox)
        const email_line = document.createElement('div');
        email_line.classList.add("row", "email-line", "my-2", "px-1", "rounded", email["read"] ? "read" : "unread", email["archived"] ? "archived" : "unarchived");
        // Each email line links to its single email view
        email_line.addEventListener('click', () => load_email(email["id"], mailbox));
        // Sections structure in an email line
        const sections_sent = [['recipients', 3], ['timestamp', 2], ['subject', 3], ['body', 4] ];
        const sections = [['sender', 3], ['timestamp', 2], ['subject', 3], ['body', 4] ];
        if (mailbox === "sent") {
          structure_email_mailbox(sections_sent, email, email_line);
          email_line.classList.add("bg-dark");
        } else {
          structure_email_mailbox(sections, email, email_line);
        }
      })
    })
    // Switch views (hide/show)
    hide('#email-view');
    hide('#compose-view');
    show('#mailbox-title');
    show('#email-table-titles');
    show('#emails-view');
    clear_HTML('#emails-view');
    if (mailbox === "sent") {
      hide('#titles');
      show_flex('#titles-sent');
    } else {
      hide('#titles-sent');
      show_flex('#titles');
    };
    console.log(`Trip to ${mailbox}`)
  }
  
  /***********************************************************************/
  //
  function load_email(email_id, mailbox) {
    // Show the mail view and hide other views
    hide('#emails-view');
    hide('#compose-view'); 
    hide('#email-table-titles');
    clear_HTML('#email-view');
    show_flex('#email-view');
    // Empty all content for switching views purpose
    // Use api to fetch this email
    fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      // Get all the data I need in an array and for each one, create div with unique ID. Inside is inserted their respective content.
      ["subject", "timestamp", "sender", "recipients", "body"].forEach(email_element => {
        const email_section = document.createElement('div');
        email_section.classList.add(`email-${email_element}-section`);
        email_section.innerHTML = `<p>${email[email_element]}</p>`;
        // Personnalized positions and CSS classes for each email component
        switch (email_element){
          case 'subject' :
          email_section.classList.add('col-8', 'fs-2', 'fw-bold', 'text-start');
          document.querySelector('#email-view').append(email_section);
          break;
          case 'timestamp' :
          email_section.classList.add('col-4','fw-bold', 'text-end');
          document.querySelector('#email-view').append(email_section);
          break;
          case 'sender' :
          email_section.innerHTML = `From <span class="badge rounded-pill 
          text-bg-primary my-1">${email[email_element]}</span>`;
          document.querySelector('#email-view').append(email_section);
          break;
          case 'recipients' :
          email_section.innerHTML = `To <span class="badge rounded-pill 
          text-bg-light my-1">${email[email_element]}</span>`;
          document.querySelector('#email-view').append(email_section);
          break;
          case 'body' :
          const email_body = document.createElement('div');
          email_body.id = 'email-body';
          email_body.classList.add('row', 'mx-0', 'mt-3', 'glass', 'p-2');
          email_body.append(email_section);
          document.querySelector('#email-view').append(email_body);
          break;
        }
      })
      if (mailbox !== 'sent'){
        const btn_view = document.createElement('div');
        btn_view.id = 'btn-status-view';
        btn_view.classList.add('text-center', 'my-3');
        document.querySelector('#email-view').append(btn_view);
        // Reply
        const reply_btn = document.createElement('button');
        reply_btn.id = 'reply-btn';
        reply_btn.classList.add('btn', 'btn-light', 'mx-1'),
        reply_btn.innerHTML = 'Reply <i class="fa-solid fa-reply"></i>';
        reply_btn.addEventListener("click", () => reply_email(email));
        btn_view.append(reply_btn); 
        // Archive
        const archive_btn = document.createElement('button');
        archive_btn.id = 'archive-btn';
        archive_btn.classList.add('btn', `${email["archived"] ? 'btn-danger' : 'btn-outline-dark'}`)
        archive_btn.innerHTML = `${email["archived"] ? "Unarchive <i class='fa-solid fa-box-archive'></i>" : "Archive <i class='fa-solid fa-box-archive'></i>"}`;
        archive_btn.addEventListener("click", () => archive_email(email_id, !email["archived"]));
        btn_view.append(archive_btn);
      };
      // Mark the email as read
      read(email_id);
    })  
  }
  