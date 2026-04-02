async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  sendBtn.disabled = true;
  document.getElementById('quickPrompts').style.display = 'none';

  addMessage(text, 'user');
  conversationHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    removeTyping();

    const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';
    addMessage(reply, 'ai');
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    removeTyping();
    addMessage('Connection error. Please check your internet and try again.', 'ai');
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

function sendQuick(text) {
  chatInput.value = text;
  sendMessage();
}
