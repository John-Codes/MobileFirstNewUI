
        const textarea = document.querySelector('.input');
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadDropdown = document.getElementById('uploadDropdown');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sidebar = document.getElementById('sidebar');
        const sendButton = document.getElementById('sendBtn');
        const messageList = document.getElementById('messageList');
        const userInput = document.getElementById('userInput');

        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            const maxHeight = window.innerHeight * 0.35;
            if (this.scrollHeight > maxHeight) {
                this.style.height = maxHeight + 'px';
                this.style.overflowY = 'scroll';
            } else {
                this.style.overflowY = 'hidden';
            }
        });

        window.addEventListener('resize', function() {
            const event = new Event('input');
            textarea.dispatchEvent(event);
        });

        uploadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            uploadDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!uploadBtn.contains(e.target)) {
                uploadDropdown.classList.remove('show');
            }
        });

        uploadDropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('dropdown-item')) {
                e.preventDefault();
                console.log('Selected:', e.target.textContent);
                uploadDropdown.classList.remove('show');
            }
        });

        hamburgerMenu.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', function(e) {
            if (!hamburgerMenu.contains(e.target) && !sidebar.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });

        sendButton.addEventListener('click', sendMessage);

        
                // Add event listener for Enter key
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent default to avoid line break
                sendMessage();
            }
        });


    

    function parseCSVGoal() {
    const csvData = localStorage.getItem('monthlyGoalCSV');
    if (!csvData) return { goal: '', startDate: '', totalRemainingDays: 0 };

    const [goal, startDate, totalRemainingDays] = csvData.split(',');
    return { goal, startDate, totalRemainingDays: parseInt(totalRemainingDays, 10) };
    }

function getMonthlyGoal() {
    const { goal, startDate, totalRemainingDays } = parseCSVGoal();
    if (!goal) return '';
    return `Goal: ${goal}, Start Date: ${startDate}, Total Remaining Days: ${totalRemainingDays}`;
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Add user message to UI
    addMessageToUI('user', userMessage);
    userInput.value = '';

    // Get the monthly goal
    const monthlyGoal = getMonthlyGoal();

    // Call API
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "http://localhost", // Replace with your actual site URL
                "X-Title": "Efexzium Chat", // Replace with your actual site name
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.1-8b-instruct:free",
                "messages": [
                    {"role": "system", "content": `The user's monthly goal information is: ${monthlyGoal}`},
                    {"role": "system", "content": `If the user's monthly goal is not set, tell the user to go to settings and set their goal. If it's set, ignore this instruction.`},
                    {"role": "user", "content": userMessage},
                ],
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // Parse markdown and add AI message to UI
        addMessageToUI('assistant', parseMarkdown(aiMessage));
    } catch (error) {
        console.error('Error:', error);
        addMessageToUI('assistant', 'Sorry, I encountered an error while processing your request.');
    }
}



        function addMessageToUI(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', role);
            messageDiv.innerHTML = `
                <div class="message-content">
                    ${content}
                </div>
            `;
            messageList.appendChild(messageDiv);
            messageList.scrollTop = messageList.scrollHeight;
        }



function parseMarkdown(markdown) {
    // Convert code blocks with language specification
    markdown = markdown.replace(/```(\w+)\n([\s\S]*?)```/g, function(match, language, code) {
        return `<pre><code class="language-${language}">${escapeHTML(code.trim())}</code></pre>`;
    });
    
    // Convert code blocks without language specification
    markdown = markdown.replace(/```([\s\S]*?)```/g, function(match, code) {
        return `<pre><code>${escapeHTML(code.trim())}</code></pre>`;
    });
    
    // Convert headers
    markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert bold and italic
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links
    markdown = markdown.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert inline code
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert unordered lists
    markdown = markdown.replace(/^\s*[\-\*] (.*)$/gim, '<ul><li>$1</li></ul>');
    markdown = markdown.replace(/<\/ul><ul>/g, '');
    
    // Convert ordered lists
    markdown = markdown.replace(/^\s*\d+\. (.*)$/gim, '<ol><li>$1</li></ol>');
    markdown = markdown.replace(/<\/ol><ol>/g, '');
    
    // Convert paragraphs
    markdown = markdown.replace(/^(?!<[uo]l|<p|<h|<pre)(.*$)/gim, '<p>$1</p>');
    
    return markdown.trim();
}

// Helper function to escape HTML special characters
function escapeHTML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
    