let loadingInterval;

async function generateContent() {
    const name = document.getElementById("productName").value;
    const desc = document.getElementById("description").value;
    const tone = document.getElementById("styleTone").value;

    const button = document.querySelector("button");

    if (!name || !desc) {
        alert("Please fill all fields");
        return;
    }

    // Disable button
    button.disabled = true;
    button.innerText = "Generating... ⏳";

    // Show skeleton loading UI
    document.getElementById("output").innerHTML = `
    <div class="mt-6 flex flex-col items-center justify-center space-y-4 animate-pulse">

      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      <p id="loadingText" class="text-gray-600">
        Generating your landing page...
      </p>

      <div class="w-full mt-6 space-y-4">
        <div class="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>

        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="h-24 bg-gray-300 rounded"></div>
          <div class="h-24 bg-gray-300 rounded"></div>
          <div class="h-24 bg-gray-300 rounded"></div>
        </div>

        <div class="h-10 bg-gray-300 rounded w-1/3 mx-auto mt-6"></div>
      </div>
    </div>
  `;

    // Dynamic loading messages
    const messages = [
        "Generating headline...",
        "Designing layout...",
        "Writing content...",
        "Finalizing your page..."
    ];

    let i = 0;
    loadingInterval = setInterval(() => {
        const el = document.getElementById("loadingText");
        if (el) {
            el.innerText = messages[i % messages.length];
            i++;
        }
    }, 1200);

    try {
        const res = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description: desc, tone }),
        });

        const data = await res.json();

        // Stop loading messages
        clearInterval(loadingInterval);

        // Render result
        document.getElementById("output").innerHTML = `
      <div class="mt-6">
        <iframe 
          class="w-full h-[700px] border rounded-xl shadow"
          srcdoc="${data.html.replace(/"/g, '&quot;')}">
        </iframe>

        <button onclick="downloadHTML()" 
          class="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          ⬇ Download Landing Page
        </button>
      </div>
    `;

        window.generatedHTML = data.html;

        // Smooth scroll to result
        document.getElementById("output").scrollIntoView({
            behavior: "smooth"
        });

    } catch (err) {
        clearInterval(loadingInterval);

        document.getElementById("output").innerHTML = `
      <div class="mt-6 text-center text-red-500">
        ❌ Error generating landing page. Try again.
      </div>
    `;
    }

    // Re-enable button
    button.disabled = false;
    button.innerText = "Generate Landing Page";
}

// Download function
function downloadHTML() {
    const blob = new Blob([window.generatedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    a.click();

    URL.revokeObjectURL(url);
}