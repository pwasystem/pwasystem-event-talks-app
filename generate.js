const fs = require('fs');
const path = require('path');

const eventName = "Tech Talk Day";

const talks = [
    {
        id: 1,
        title: "The Future of AI",
        speakers: ["Jane Doe"],
        categories: ["AI", "Machine Learning", "Future Tech"],
        description: "A deep dive into the future of AI and its impact on society."
    },
    {
        id: 2,
        title: "Modern JavaScript Frameworks",
        speakers: ["John Smith"],
        categories: ["JavaScript", "Web Development", "Frameworks"],
        description: "An overview of the most popular JavaScript frameworks in 2026."
    },
    {
        id: 3,
        title: "The Cloud Native Revolution",
        speakers: ["Peter Jones"],
        categories: ["Cloud", "DevOps", "Kubernetes"],
        description: "How cloud-native technologies are changing the way we build and deploy software."
    },
    {
        id: 4,
        title: "Cybersecurity in a Post-Quantum World",
        speakers: ["Mary Johnson"],
        categories: ["Cybersecurity", "Quantum Computing", "Cryptography"],
        description: "Exploring the challenges and solutions for cybersecurity in the age of quantum computers."
    },
    {
        id: 5,
        title: "Building Scalable and Resilient Systems",
        speakers: ["David Williams", "Susan Brown"],
        categories: ["System Design", "Architecture", "Scalability"],
        description: "Best practices for designing and building systems that can handle millions of users."
    },
    {
        id: 6,
        title: "The Ethics of AI",
        speakers: ["Michael Miller"],
        categories: ["AI", "Ethics", "Society"],
        description: "A discussion on the ethical implications of artificial intelligence and how we can ensure it is used for good."
    }
];

const schedule = [
    { time: "10:00 AM - 11:00 AM", talkId: 1 },
    { time: "11:00 AM - 11:10 AM", break: "Transition" },
    { time: "11:10 AM - 12:10 PM", talkId: 2 },
    { time: "12:10 PM - 12:20 PM", break: "Transition" },
    { time: "12:20 PM - 1:20 PM", talkId: 3 },
    { time: "1:20 PM - 2:20 PM", break: "Lunch Break" },
    { time: "2:20 PM - 3:20 PM", talkId: 4 },
    { time: "3:20 PM - 3:30 PM", break: "Transition" },
    { time: "3:30 PM - 4:30 PM", talkId: 5 },
    { time: "4:30 PM - 4:40 PM", break: "Transition" },
    { time: "4:40 PM - 5:40 PM", talkId: 6 },
];

const generateScheduleHTML = () => {
    let html = '';
    schedule.forEach(slot => {
        if (slot.talkId) {
            const talk = talks.find(t => t.id === slot.talkId);
            html += `
                <div class="schedule-slot" data-categories="${talk.categories.join(',').toLowerCase()}">
                    <div class="time">${slot.time}</div>
                    <div class="talk-details">
                        <h3>${talk.title}</h3>
                        <p class="speakers"><strong>By:</strong> ${talk.speakers.join(', ')}</p>
                        <p>${talk.description}</p>
                        <div class="categories">
                            ${talk.categories.map(cat => `<span>${cat}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="schedule-slot break">
                    <div class="time">${slot.time}</div>
                    <div class="talk-details">
                        <h3>${slot.break}</h3>
                    </div>
                </div>
            `;
        }
    });
    return html;
};

const css = `
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        background-color: #f8f9fa;
        color: #343a40;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
    }
    header {
        text-align: center;
        border-bottom: 1px solid #dee2e6;
        padding-bottom: 20px;
        margin-bottom: 30px;
    }
    header h1 {
        margin: 0;
        font-size: 2.5rem;
        color: #007bff;
    }
    .search-container {
        text-align: center;
        margin-bottom: 30px;
    }
    #search-bar {
        width: 100%;
        max-width: 400px;
        padding: 10px 15px;
        border: 1px solid #ced4da;
        border-radius: 20px;
        font-size: 1rem;
        transition: box-shadow 0.2s;
    }
    #search-bar:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
    .schedule-slot {
        display: flex;
        border: 1px solid #e9ecef;
        background-color: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
    }
    .schedule-slot.hidden {
        display: none;
    }
    .time {
        background-color: #007bff;
        color: white;
        padding: 20px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
        text-align: center;
        font-weight: bold;
        flex-shrink: 0;
    }
    .talk-details {
        padding: 20px;
        flex-grow: 1;
    }
    .talk-details h3 {
        margin-top: 0;
        color: #0056b3;
    }
    .speakers {
        font-style: italic;
        color: #6c757d;
        margin-bottom: 15px;
    }
    .categories span {
        display: inline-block;
        background-color: #e9ecef;
        color: #495057;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        margin-right: 5px;
        margin-top: 10px;
    }
    .schedule-slot.break {
        background-color: #f1f3f5;
    }
    .schedule-slot.break .time {
        background-color: #6c757d;
    }
    .schedule-slot.break .talk-details h3 {
        color: #495057;
        text-align: center;
        width: 100%;
    }
`;

const js = `
    document.addEventListener('DOMContentLoaded', () => {
        const searchBar = document.getElementById('search-bar');
        const scheduleSlots = document.querySelectorAll('.schedule-slot');

        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            scheduleSlots.forEach(slot => {
                const isBreak = slot.classList.contains('break');
                if (isBreak) return;

                const categories = slot.dataset.categories;
                if (categories.includes(searchTerm)) {
                    slot.classList.remove('hidden');
                } else {
                    slot.classList.add('hidden');
                }
            });
        });
    });
`;


const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${eventName}</title>
    <style>
        ${css}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${eventName}</h1>
        </header>

        <div class="search-container">
            <input type="text" id="search-bar" placeholder="Search by category (e.g., AI, Cloud)...">
        </div>

        <div id="schedule-container">
            ${generateScheduleHTML()}
        </div>
    </div>
    <script>
        ${js}
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlTemplate);

console.log('index.html has been generated successfully!');
