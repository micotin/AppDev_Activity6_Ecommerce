exports.getContactPage = (req, res) => {
    res.render('contact', { title: 'Contact Us' });
  };
  
  exports.submitContactForm = (req, res) => {
    const { name, email, message } = req.body;
    // Here you would typically send an email or save the message to a database
    console.log('Contact form submission:', { name, email, message });
    res.render('contact', { title: 'Contact Us', success: true });
  };