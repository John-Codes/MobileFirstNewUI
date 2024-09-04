
        const textarea = document.querySelector('.input');
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadDropdown = document.getElementById('uploadDropdown');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sidebar = document.getElementById('sidebar');
        const sendButton = document.getElementById('sendBtn');
        const messageList = document.getElementById('messageList');
        const userInput = document.getElementById('userInput');
        var debugMode=false
        // Initialize the todo list on page load
        document.addEventListener('DOMContentLoaded', function() {
            const todos = getTodos();
            console.log('Initial Todo List:', todos);
        });

        // Set initial state of the toggle based on localStorage
        debugMode = getDebugMode();
        
    

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


function getTodos() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

//
//old Send mSG
// async function sendMessage() {
//     const userMessage = userInput.value.trim();
//     if (!userMessage) return;

//     // Add user message to UI
//     addMessageToUI('user', userMessage);
//     userInput.value = '';

//     // Get the monthly goal
//     const monthlyGoal = getMonthlyGoal();

//         // Get the todos
//         const todos = getTodos();

//     // Call API
//     try {
//         const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//             method: "POST",
//             headers: {
//                 "Authorization": "Bearer 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",
//                 "HTTP-Referer": "http://localhost", // Replace with your actual site URL
//                 "X-Title": "Efexzium Chat", // Replace with your actual site name
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 "model": "meta-llama/llama-3.1-8b-instruct:free",
//                 "messages": [
//                     {"role": "system", "content": `The user's monthly goal information is: ${monthlyGoal}`},
//                     {"role": "system", "content": `If the user's monthly goal is not set, tell the user to go to settings and set their goal. If it's set, ignore this instruction.`},
//                     {"role":"system","content":`The user's current todos are: ${JSON.stringify(todos)}`},
//                     {"role": "user", "content": userMessage},
//                 ],
//             })
//         });

//         const data = await response.json();
//         const aiMessage = data.choices[0].message.content;

//         // Parse markdown and add AI message to UI
//         addMessageToUI('assistant', parseMarkdown(aiMessage));
//     } catch (error) {
//         console.error('Error:', error);
//         addMessageToUI('assistant', 'Sorry, I encountered an error while processing your request.');
//     }
// }



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


        // Function to get the debug mode state from localStorage
function getDebugMode() {
    return localStorage.getItem('debugMode') === 'true';
}
// New method to conditionally call addMessageToUI based on debug mode
function debugMessage(message, type = 'info') {
    if (getDebugMode()) {
        addMessageToUI(type,message);
    }
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




//
//
//todo crud functions
//
//


// Main function to handle user input and process messages
async function sendMessage() {
    
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessageToUI('user', userMessage);
    userInput.value = '';

    console.log('Processing user message:', userMessage);

    const crudOperation = await processTodoCRUDRequest(userMessage);

    if (crudOperation) {
        await handleCRUDOperation(crudOperation);
    } else {
        await handleGoalTaskMode(userMessage);
    }
}




// Function to handle CRUD operations
async function handleCRUDOperation(crudOperation) {
    console.log('Detected CRUD operation:', crudOperation);
    try {
        const result = handleTodoCRUD(crudOperation);
        if (result) {
            addMessageToUI('assistant', `Todo list updated. Operation result: ${JSON.stringify(result)}`);
        } else {
            throw new Error('Operation returned no result');
        }
    } catch (error) {
        console.error('Error in CRUD operation:', error);
        debugMessage('assistant', `Error in CRUD operation: ${error.message}`);
    }
}

// Function to handle goal task mode
async function handleGoalTaskMode(userMessage) {
    console.log('Entering goal task mode');
    const monthlyGoal = getMonthlyGoal();
    const todos = getTodos();
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "http://localhost",
                "X-Title": "Efexzium Chat",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.1-8b-instruct:free",
                "messages": [
                    {"role": "system", "content": `The user's monthly goal information is: ${monthlyGoal}`},
                    {"role": "system", "content": `The user's current todos are: ${JSON.stringify(todos)}`},
                    {"role": "system", "content": `If the user's monthly goal is not set, tell the user to go to settings and set their goal. If it's set, ignore this instruction.`},
                    {"role": "user", "content": userMessage},
                ],
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        addMessageToUI('assistant', parseMarkdown(aiMessage));
    } catch (error) {
        console.error('Error in goal task mode:', error);
        debugMessage('assistant', 'Sorry, I encountered an error while processing your request.');
    }
}

// Function to process user input and determine if it's a CRUD operation
async function processTodoCRUDRequest(userInput) {
    try {
        // Get current todos
        const currentTodos = getTodos();
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "http://localhost",
                "X-Title": "Efexzium Chat",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.1-8b-instruct:free",
                "messages": [
                    {"role": "system", "content": `You are an AI assistant that analyzes user input to determine if it's a CRUD (Create, Read, Update, Delete) operation for a todo list. If it is, respond with a JSON structure containing the operation and relevant details in this exact format:
                    {"OPERATION":"Update","task":"buy plane ticket","Due Date":"this week","PriorityStatus":3,"Notes":"find a good deal"}
                    Replace the values with the appropriate information from the user's input. The OPERATION should be Create, Read, Update, or Delete. Use null for any missing values. Ensure all property names and string values are in double quotes. If it's not a CRUD operation, respond with null.
                    
                    Here are the current todos:
                    ${JSON.stringify(currentTodos, null, 2)}
                    
                    Use this information to provide context-aware responses. For update and delete operations, use the exact task name for matching.`},
                    {"role": "user", "content": `Analyze this request and respond with a JSON structure if it's a CRUD operation for todos: "${userInput}"`}
                ],
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        console.log("Raw AI response:", aiMessage);
        debugMessage('system', `Raw AI response: ${aiMessage}`);

        const processedMessage = preprocessJsonString(aiMessage);

        console.log("Processed AI response:", processedMessage);
        debugMessage('system', `Processed AI response: ${processedMessage}`);

        let crudOperation = null;
        try {
            crudOperation = JSON.parse(processedMessage);
        } catch (e) {
            const errorMessage = `Error: Invalid JSON response from AI. Details: ${e.message}`;
            console.error(errorMessage);
            debugMessage('assistant', errorMessage);
            return null;
        }

        if (crudOperation && !crudOperation.OPERATION) {
            const errorMessage = "Error: Invalid CRUD operation. Missing OPERATION field.";
            addMessageToUI('assistant', errorMessage);
            return null;
        }

        return crudOperation;
    } catch (error) {
        const errorMessage = `Error processing CRUD request: ${error.message}`;
        console.error(errorMessage);
        debugMessage('assistant', errorMessage);
        return null;
    }
}


// Function to preprocess the JSON string and fix common formatting issues
function preprocessJsonString(jsonString) {
    let processed = jsonString.trim();
    if (processed.startsWith('`') && processed.endsWith('`')) {
        processed = processed.slice(1, -1);
    }
    processed = processed.replace(/(\w+):/g, '"$1":');
    processed = processed.replace(/'/g, '"');
    return processed;
}


// Function to handle CRUD operations on todos
function handleTodoCRUD(operation) {
    if (!operation || !operation.OPERATION) {
        const errorMessage = 'Invalid operation';
        addMessageToUI('assistant', errorMessage);
        throw new Error(errorMessage);
    }

    const todos = getTodos();
    let result;

    try {
        switch (operation.OPERATION) {
            case 'Create':
                const newTodo = {
                    id: Date.now(),
                    task: operation.task,
                    dueDate: operation["Due Date"],
                    priorityStatus: operation.PriorityStatus,
                    notes: operation.Notes,
                    completed: false
                };
                todos.push(newTodo);
                console.log('CRUD Operation - Create:', newTodo);
                addMessageToUI('system', `CRUD Operation - Create: ${JSON.stringify(newTodo)}`);
                result = newTodo;
                break;
            case 'Read':
                console.log('CRUD Operation - Read:', todos);
                debugMessage('system', `CRUD Operation - Read: ${JSON.stringify(todos)}`);
                result = todos;
                addMessageToUI(result)
                break;
            case 'Update':
                const todoToUpdate = todos.find(todo => todo.task.toLowerCase() === operation.task.toLowerCase());
                if (todoToUpdate) {
                    if (operation["Due Date"]) todoToUpdate.dueDate = operation["Due Date"];
                    if (operation.PriorityStatus) todoToUpdate.priorityStatus = operation.PriorityStatus;
                    if (operation.Notes) todoToUpdate.notes = operation.Notes;
                    console.log('CRUD Operation - Update:', todoToUpdate);
                    debugMessage('system', `CRUD Operation - Update: ${JSON.stringify(todoToUpdate)}`);
                    result = todoToUpdate;
                } else {
                    throw new Error(`Todo with task "${operation.task}" not found`);
                }
                break;
            case 'Delete':
                const index = todos.findIndex(todo => todo.task.toLowerCase() === operation.task.toLowerCase());
                if (index !== -1) {
                    const deletedTodo = todos.splice(index, 1)[0];
                    console.log('CRUD Operation - Delete:', deletedTodo);
                    addMessageToUI('system', `CRUD Operation - Delete: ${JSON.stringify(deletedTodo)}`);
                    result = deletedTodo;
                } else {
                    throw new Error(`Todo with task "${operation.task}" not found`);
                    
                }
                break;
            default:
                throw new Error(`Unknown CRUD Operation: ${operation.OPERATION}`);
        }

        saveTodos(todos);
        console.log('Updated Todo List:', todos);
        debugMessage('system', `Updated Todo List: ${JSON.stringify(todos)}`);
        return result;
    } catch (error) {
        const errorMessage = `Error in CRUD operation: ${error.message}`;
        console.error(errorMessage);
        debugMessage('assistant', errorMessage);
        throw error;
    }
}



// Function to get todos from local storage
function getTodos() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

// Function to save todos to local storage
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
