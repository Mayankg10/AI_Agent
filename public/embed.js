(function(d, w) {
  function loadChatbotWidget() {
    const config = {
      businessId: 'your-business-id',
      apiEndpoint: '/api/chat',
      businessName: 'Example Business',
      primaryColor: '#3b82f6',
      accentColor: '#10b981',
      welcomeMessage: 'Hello! How can I help you today?',
      placeholder: 'Ask me anything...',
      position: 'bottom-right',
      theme: 'auto',
      size: 'medium',
      logo: ''
    };

    w.ChatbotWidget = {
      init: function(customConfig) {
        w.ChatbotWidget.config = { ...config, ...customConfig };
        const script = d.createElement('script');
        script.src = '/path/to/your/widget.js';
        script.async = true;
        d.head.appendChild(script);
      }
    }
  }

  if (d.readyState === 'complete') {
    loadChatbotWidget();
  } else {
    w.addEventListener('load', loadChatbotWidget);
  }
})(document, window);
