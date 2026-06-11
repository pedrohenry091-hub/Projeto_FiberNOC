function login() {
    window.location.href = "index.html";
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expanded");
}

function goToDetails(id, status, signal) {
    window.location.href = `details.html?id=${id}&status=${status}&signal=${signal}`;
}

const params = new URLSearchParams(window.location.search);

if (document.getElementById("onuId")) {
    document.getElementById("onuId").textContent = params.get("id");
    document.getElementById("onuStatus").textContent = params.get("status");
    document.getElementById("onuSignal").textContent = params.get("signal");
}

function filterOnu() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll(".onu-table tbody tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

function colorSignal() {
    const signals = document.querySelectorAll(".signal");

    signals.forEach(el => {
        const value = parseInt(el.textContent);

        el.classList.remove("good", "medium", "bad");

        if (value >= -20) {
            el.classList.add("good");
        } else if (value >= -25) {
            el.classList.add("medium");
        } else {
            el.classList.add("bad");
        }

        el.textContent = value + " dBm";
    });
}

document.addEventListener("DOMContentLoaded", colorSignal);

function applyStatusColor() {
    const statusEl = document.getElementById("onuStatus");

    if (!statusEl) return;

    const status = statusEl.textContent.toLowerCase();

    statusEl.classList.add("status");

    if (status === "online") {
        statusEl.classList.add("online");
    } else {
        statusEl.classList.add("offline");
    }
}

document.addEventListener("DOMContentLoaded", applyStatusColor);
