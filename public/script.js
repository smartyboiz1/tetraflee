document.getElementById("suggestionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const occasion = document.getElementById("occasion").value;
  const budget = document.getElementById("budget").value;
  const time = document.getElementById("time").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "<p>⏳ Generating suggestions...</p>";

  try {
    const response = await fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: occasion, budget, preferences: time })
    });

    if (!response.ok) {
      resultDiv.innerHTML = "<p style='color:red;'>⚠️ Server error. Please try again.</p>";
      return;
    }

    const data = await response.json();
    
    if (data.answer) {
      resultDiv.innerHTML = `<p>🎉 Suggestions:</p><p>${data.answer}</p>`;
    } else {
      resultDiv.innerHTML = "<p style='color:red;'>⚠️ Unexpected response from server.</p>";
    }
  } catch (error) {
    resultDiv.innerHTML = "<p style='color:red;'>⚠️ Error fetching suggestions.</p>";
  }
});
