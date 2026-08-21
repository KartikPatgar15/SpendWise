// src/utils/notes/templates.js
// Pre-built note templates.

export const TEMPLATES = [
  {
    key: "shopping",
    label: "🛒 Shopping List",
    category: "Shopping",
    color: "yellow",
    title: "Shopping List",
    content: `<div><ul class="checklist">
<li class="check-item"><input type="checkbox"> Milk</li>
<li class="check-item"><input type="checkbox"> Bread</li>
<li class="check-item"><input type="checkbox"> Eggs</li>
<li class="check-item"><input type="checkbox"> Rice</li>
<li class="check-item"><input type="checkbox"> Vegetables</li>
<li class="check-item"><input type="checkbox"> Fruits</li>
</ul></div>`,
  },
  {
    key: "meeting",
    label: "📋 Meeting Notes",
    category: "Work",
    color: "blue",
    title: "Meeting Notes",
    content: `<div>
<p><strong>📅 Date:</strong> </p>
<p><strong>👥 Attendees:</strong> </p>
<p><strong>📌 Agenda:</strong></p>
<p>1. </p>
<p>2. </p>
<p>3. </p>
<p><strong>📝 Notes:</strong></p>
<p></p>
<p><strong>✅ Action Items:</strong></p>
<ul class="checklist">
<li class="check-item"><input type="checkbox"> </li>
<li class="check-item"><input type="checkbox"> </li>
</ul>
</div>`,
  },
  {
    key: "journal",
    label: "📔 Daily Journal",
    category: "Personal",
    color: "green",
    title: "Daily Journal",
    content: `<div>
<p><strong>📅 Date:</strong> ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
<p><strong>😊 Mood:</strong> </p>
<p><strong>🌟 Today's Highlights:</strong></p>
<p></p>
<p><strong>📚 What I Learned:</strong></p>
<p></p>
<p><strong>🎯 Tomorrow's Goals:</strong></p>
<ul class="checklist">
<li class="check-item"><input type="checkbox"> </li>
<li class="check-item"><input type="checkbox"> </li>
</ul>
<p><strong>💭 Thoughts:</strong></p>
<p></p>
</div>`,
  },
  {
    key: "study",
    label: "📚 Study Notes",
    category: "Study",
    color: "pink",
    title: "Study Notes",
    content: `<div>
<p><strong>📖 Topic:</strong> </p>
<p><strong>📅 Date:</strong> </p>
<p><strong>🔑 Key Concepts:</strong></p>
<p>1. </p>
<p>2. </p>
<p>3. </p>
<p><strong>📝 Summary:</strong></p>
<p></p>
<p><strong>❓ Questions:</strong></p>
<p></p>
<p><strong>✅ To Review:</strong></p>
<ul class="checklist">
<li class="check-item"><input type="checkbox"> </li>
<li class="check-item"><input type="checkbox"> </li>
</ul>
</div>`,
  },
  {
    key: "travel",
    label: "✈️ Travel Plan",
    category: "Personal",
    color: "blue",
    title: "Travel Plan",
    content: `<div>
<p><strong>🏖 Destination:</strong> </p>
<p><strong>📅 Dates:</strong> </p>
<p><strong>🎫 Bookings:</strong></p>
<ul class="checklist">
<li class="check-item"><input type="checkbox"> Flights</li>
<li class="check-item"><input type="checkbox"> Hotel</li>
<li class="check-item"><input type="checkbox"> Transport</li>
</ul>
<p><strong>🎒 Packing List:</strong></p>
<ul class="checklist">
<li class="check-item"><input type="checkbox"> Passport / ID</li>
<li class="check-item"><input type="checkbox"> Charger</li>
<li class="check-item"><input type="checkbox"> Medicines</li>
<li class="check-item"><input type="checkbox"> Clothes</li>
</ul>
<p><strong>📍 Places to Visit:</strong></p>
<p>1. </p>
<p>2. </p>
<p>3. </p>
</div>`,
  },
];
